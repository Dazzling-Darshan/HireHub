import { GoogleGenerativeAI } from '@google/generative-ai';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { getCache, setCache, CACHE_TTL } from '../utils/redis.js';

/**
 * Fallback heuristic analysis generator when Gemini API is unavailable or unconfigured
 */
const generateHeuristicAnalysis = (candidate, job) => {
  const userSkills = Array.isArray(candidate?.profile?.skills)
    ? candidate.profile.skills.map((s) => s.toLowerCase().trim())
    : [];
  const bio = (candidate?.profile?.bio || '').toLowerCase();
  const resumeName = (candidate?.profile?.resumeOriginalName || '').toLowerCase();
  const requirements = Array.isArray(job?.requirements) ? job.requirements : [];

  const matched = [];
  const missing = [];

  requirements.forEach((req) => {
    const norm = req.toLowerCase().trim();
    const found =
      userSkills.some((s) => s.includes(norm) || norm.includes(s)) ||
      bio.includes(norm) ||
      resumeName.includes(norm);

    if (found) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const baseScore =
    requirements.length > 0
      ? Math.round((matched.length / requirements.length) * 100)
      : 70;
  const matchScore = candidate?.profile?.resume
    ? Math.min(100, baseScore + 5)
    : baseScore;

  let fitSummary = '';
  if (matchScore >= 75) {
    fitSummary = `Exceptional fit for ${job.title}. Your profile demonstrates strong coverage across core technical competencies required for this role.`;
  } else if (matchScore >= 45) {
    fitSummary = `Good baseline compatibility for ${job.title}. You have key prerequisite skills, with opportunities to strengthen specific stack requirements.`;
  } else {
    fitSummary = `Growing match for ${job.title}. Building hands-on experience in the missing core skills will significantly boost your application.`;
  }

  const suggestions = [];
  if (missing.length > 0) {
    suggestions.push(
      `Build or showcase a project demonstrating proficiency in ${missing.slice(0, 3).join(', ')}.`
    );
  }
  if (!candidate?.profile?.resume) {
    suggestions.push(
      'Upload an updated PDF resume highlighting your practical achievements and code repositories.'
    );
  }
  if (userSkills.length < 5) {
    suggestions.push(
      'Add more specific technology badges and framework proficiencies to your profile.'
    );
  }
  suggestions.push(
    `Review system design patterns and common interview algorithms relevant to ${job.title}.`
  );

  const interviewPrepTips = [
    `Be prepared to explain your experience with ${matched.slice(0, 2).join(' and ') || 'your primary tech stack'}.`,
    `Review key architectural considerations for scalable web systems in ${job.location || 'remote teams'}.`,
    `Prepare real-world examples of technical challenges you solved and trade-offs you made.`,
  ];

  return {
    matchScore,
    fitSummary,
    strengths: matched.length > 0 ? matched : ['Foundational Problem Solving', 'Adaptability'],
    missingSkills: missing,
    suggestions,
    interviewPrepTips,
    modelUsed: 'heuristic-rule-engine',
  };
};

/**
 * Controller: Analyze candidate fit against job requirements using Google Gemini AI
 * Route: POST /api/v1/ai/skill-match/:jobId
 */
export const analyzeCandidateSkillFit = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        message: 'Job ID is required for AI skill analysis',
        success: false,
      });
    }

    // 1. Check Redis Cache first
    const cacheKey = `ai_match:${userId}:${jobId}`;
    const cachedAnalysis = await getCache(cacheKey);
    if (cachedAnalysis) {
      return res.status(200).json({
        success: true,
        analysis: cachedAnalysis,
        cached: true,
      });
    }

    // 2. Fetch candidate and job entities
    const [candidate, job] = await Promise.all([
      User.findById(userId).select('-password'),
      Job.findById(jobId).populate('company'),
    ]);

    if (!candidate) {
      return res.status(404).json({
        message: 'Candidate user profile not found',
        success: false,
      });
    }

    if (!job) {
      return res.status(404).json({
        message: 'Job opening not found',
        success: false,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 3. Fallback if Gemini API Key is missing or empty
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      const fallbackAnalysis = generateHeuristicAnalysis(candidate, job);
      await setCache(cacheKey, fallbackAnalysis, CACHE_TTL.SHORT);
      return res.status(200).json({
        success: true,
        analysis: fallbackAnalysis,
        note: 'Calculated with internal intelligent matching engine (Gemini API key not configured).',
      });
    }

    // 4. Call Google Gemini AI
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are an expert technical recruiter and talent evaluator for tech jobs.
Evaluate the compatibility between this candidate and the job opening.

CANDIDATE DATA:
- Name: ${candidate.fullName}
- Explicit Skills: ${JSON.stringify(candidate.profile?.skills || [])}
- Bio / Summary: "${candidate.profile?.bio || 'Not provided'}"
- Uploaded Resume Name: "${candidate.profile?.resumeOriginalName || 'None'}"
- Has Resume Uploaded: ${Boolean(candidate.profile?.resume)}

JOB REQUISITION:
- Job Title: ${job.title}
- Company: ${job.company?.name || 'Technology Employer'}
- Location: ${job.location}
- Experience Level Required: ${job.experienceLevel} years
- Salary Bracket: ₹${job.salary} LPA
- Required Skills / Stack: ${JSON.stringify(job.requirements || [])}
- Job Description: "${job.description || ''}"

TASK:
Provide an objective, constructive, and highly accurate candidate fit evaluation.
You MUST reply with ONLY a valid, raw JSON object (without markdown code fences or backticks, or wrapped in a standard JSON block) following this exact schema:

{
  "matchScore": <number between 0 and 100 representing overall compatibility percentage>,
  "fitSummary": "<2-3 sentence overview explaining the candidate's alignment with this position>",
  "strengths": ["<specific skill or quality 1>", "<specific skill 2>", "<specific skill 3>"],
  "missingSkills": ["<critical missing requirement 1>", "<missing requirement 2>"],
  "suggestions": [
    "<actionable suggestion 1 for candidate to bridge skill gaps>",
    "<actionable suggestion 2 to stand out in the application>",
    "<actionable suggestion 3>"
  ],
  "interviewPrepTips": [
    "<practical technical interview question/topic to prepare 1>",
    "<practical question/topic 2>"
  ]
}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean markdown codeblocks if returned
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();

      let parsedAnalysis;
      try {
        parsedAnalysis = JSON.parse(cleanedText);
      } catch (jsonErr) {
        console.warn('[Gemini AI] JSON parse error, falling back:', jsonErr.message);
        parsedAnalysis = generateHeuristicAnalysis(candidate, job);
      }

      parsedAnalysis.modelUsed = 'Google Gemini 1.5 Flash';

      // Cache in Redis
      await setCache(cacheKey, parsedAnalysis, CACHE_TTL.MEDIUM);

      return res.status(200).json({
        success: true,
        analysis: parsedAnalysis,
      });
    } catch (aiError) {
      console.warn('[Gemini AI Error]', aiError.message);
      // Fallback gracefully without error
      const fallbackAnalysis = generateHeuristicAnalysis(candidate, job);
      return res.status(200).json({
        success: true,
        analysis: fallbackAnalysis,
        warning: `AI analysis service momentarily unavailable (${aiError.message}). Rendered heuristic match.`,
      });
    }
  } catch (error) {
    console.error('[AI Match Controller Error]', error);
    return res.status(500).json({
      message: 'Failed to generate AI candidate analysis',
      success: false,
      error: error.message,
    });
  }
};
