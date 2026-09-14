import { SchemaType } from '@google/generative-ai';

/**
 * Strict JSON Schema for Resume Parsing & Information Extraction
 */
export const resumeExtractionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    fullName: {
      type: SchemaType.STRING,
      description: "Candidate's full name extracted from the resume",
    },
    email: {
      type: SchemaType.STRING,
      description: "Primary contact email address",
    },
    phoneNumber: {
      type: SchemaType.STRING,
      description: "Primary contact phone number",
    },
    summary: {
      type: SchemaType.STRING,
      description: "Professional bio or summary (2-3 sentences max)",
    },
    skills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of technical skills, languages, frameworks, and domain competencies",
    },
    experience: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          role: { type: SchemaType.STRING },
          company: { type: SchemaType.STRING },
          duration: { type: SchemaType.STRING, description: "e.g., 'Jan 2022 - Present' or '2 years'" },
          highlights: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Key achievements, responsibilities, or technologies used",
          },
        },
        required: ['role', 'company'],
      },
    },
    education: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          degree: { type: SchemaType.STRING },
          institution: { type: SchemaType.STRING },
          year: { type: SchemaType.STRING },
        },
        required: ['degree', 'institution'],
      },
    },
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          techStack: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ['title'],
      },
    },
  },
  required: ['fullName', 'skills'],
};

/**
 * Strict JSON Schema for Candidate-to-Job Skill Match Analysis
 */
export const skillFitSchema = {
  type: SchemaType.OBJECT,
  properties: {
    matchScore: {
      type: SchemaType.NUMBER,
      description: "Compatibility score between 0 and 100",
    },
    fitSummary: {
      type: SchemaType.STRING,
      description: "Objective 2-3 sentence overview assessing candidate fit for this specific job",
    },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Strongest technical skills and experiences that directly align with the job requirements",
    },
    missingSkills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Missing or weak qualifications compared to the job description",
    },
    suggestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Actionable steps to bridge gaps and strengthen application",
    },
    interviewPrepTips: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Practical technical interview questions/topics to prepare based on stack requirements",
    },
  },
  required: ['matchScore', 'fitSummary', 'strengths', 'missingSkills', 'suggestions', 'interviewPrepTips'],
};

/**
 * Strict JSON Schema for Batch Recruiter Candidate Ranking
 */
export const recruiterRankingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    rankedCandidates: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          candidateId: {
            type: SchemaType.STRING,
            description: "Unique MongoDB ObjectId string of the candidate user",
          },
          matchScore: {
            type: SchemaType.NUMBER,
            description: "Match score between 0 and 100",
          },
          recommendation: {
            type: SchemaType.STRING,
            description: "Categorical decision: 'strong_hire', 'hire', 'possible_fit', or 'not_recommended'",
          },
          strengths: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Top 2-3 strengths regarding this role",
          },
          missingSkills: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Missing prerequisites or gaps",
          },
          summaryReasoning: {
            type: SchemaType.STRING,
            description: "1-2 sentence executive briefing explaining the score to the recruiter",
          },
        },
        required: ['candidateId', 'matchScore', 'recommendation', 'summaryReasoning'],
      },
    },
  },
  required: ['rankedCandidates'],
};

/**
 * Strict JSON Schema for AI Job Description Generation
 */
export const jobDescriptionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "Refined, industry-standard professional job title",
    },
    description: {
      type: SchemaType.STRING,
      description: "Comprehensive 2-3 paragraph role overview, team context, and opportunity details",
    },
    requirements: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of technical requirements, tools, competencies, and qualifications",
    },
    responsibilities: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Day-to-day responsibilities and core deliverables",
    },
    suggestedExperienceYears: {
      type: SchemaType.NUMBER,
      description: "Recommended years of experience for this role",
    },
    suggestedSalaryRange: {
      type: SchemaType.STRING,
      description: "Industry competitive salary bracket in LPA (e.g. '12 - 18 LPA')",
    },
  },
  required: ['title', 'description', 'requirements', 'responsibilities'],
};

/**
 * Strict JSON Schema for Grounded Multi-Job RAG Career Navigator
 */
export const careerNavigatorSchema = {
  type: SchemaType.OBJECT,
  properties: {
    adviceSummary: {
      type: SchemaType.STRING,
      description: "Actionable, tailored career transition and application strategy guidance",
    },
    skillRecommendations: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Specific high-demand skills to learn or highlight based on retrieved job openings",
    },
    citedJobs: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          jobId: {
            type: SchemaType.STRING,
            description: "The exact MongoDB _id of the retrieved matching job",
          },
          jobTitle: {
            type: SchemaType.STRING,
            description: "Title of the cited job",
          },
          companyName: {
            type: SchemaType.STRING,
            description: "Company offering the job",
          },
          relevanceExplanation: {
            type: SchemaType.STRING,
            description: "Why this specific position is a good fit for the candidate",
          },
          matchingSkills: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ['jobId', 'jobTitle', 'companyName', 'relevanceExplanation'],
      },
    },
  },
  required: ['adviceSummary', 'skillRecommendations', 'citedJobs'],
};
