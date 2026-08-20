/**
 * Normalize text/skill token for fuzzy matching
 */
const normalizeToken = (token = '') => {
  return token
    .toLowerCase()
    .trim()
    .replace(/[.\-\s_,/\\()]/g, '')
    .replace('javascript', 'js')
    .replace('typescript', 'ts')
    .replace('reactjs', 'react')
    .replace('nodejs', 'node')
    .replace('expressjs', 'express')
    .replace('mongodb', 'mongo')
    .replace('tailwindcss', 'tailwind')
    .replace('postgresql', 'postgres')
    .replace('amazonwebservices', 'aws');
};

/**
 * Common technical keywords dictionary for keyword extraction from bio & resume names
 */
const KNOWN_TECH_KEYWORDS = [
  'react', 'node', 'express', 'mongodb', 'javascript', 'typescript', 'python',
  'java', 'c++', 'c#', '.net', 'django', 'flask', 'fastapi', 'spring', 'springboot',
  'sql', 'postgres', 'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure',
  'gcp', 'terraform', 'graphql', 'rest', 'tailwind', 'nextjs', 'redux', 'flutter',
  'reactnative', 'kotlin', 'swift', 'ci/cd', 'git', 'linux', 'html', 'css',
  'figma', 'ui/ux', 'scikitlearn', 'pytorch', 'tensorflow', 'pandas', 'nlp',
  'tableau', 'powerbi', 'cybersecurity', 'selenium', 'cypress', 'playwright'
];

/**
 * Extract candidate skill keywords from profile (skills list, bio text, resume name)
 * @param {object} profile - user.profile object
 * @returns {Set<string>} Set of normalized skill tokens
 */
export const extractCandidateSkills = (profile = {}) => {
  const candidateTokens = new Set();

  // 1. Direct skills array
  if (Array.isArray(profile?.skills)) {
    profile.skills.forEach((s) => {
      if (s && typeof s === 'string') {
        candidateTokens.add(normalizeToken(s));
      }
    });
  }

  // 2. Extract from bio text
  if (profile?.bio && typeof profile.bio === 'string') {
    const bioLower = profile.bio.toLowerCase();
    KNOWN_TECH_KEYWORDS.forEach((kw) => {
      if (bioLower.includes(kw.toLowerCase())) {
        candidateTokens.add(normalizeToken(kw));
      }
    });
  }

  // 3. Extract from resume original name
  if (profile?.resumeOriginalName && typeof profile.resumeOriginalName === 'string') {
    const resumeNameLower = profile.resumeOriginalName.toLowerCase();
    KNOWN_TECH_KEYWORDS.forEach((kw) => {
      if (resumeNameLower.includes(kw.toLowerCase())) {
        candidateTokens.add(normalizeToken(kw));
      }
    });
  }

  return candidateTokens;
};

/**
 * Calculate match percentage and skill breakdown between candidate profile and job requirements
 * @param {object|string[]} userOrSkills - user profile object or user skills array
 * @param {string[]} jobRequirements - job requirements list
 * @param {object} [job] - optional job object for extra title/description matching
 * @returns {{ percentage: number, matchedSkills: string[], missingSkills: string[], label: string, colorClass: string }}
 */
export const calculateSkillMatch = (userOrSkills, jobRequirements = [], job = null) => {
  if (!Array.isArray(jobRequirements) || jobRequirements.length === 0) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: [],
      label: 'General Role',
      colorClass: 'bg-muted text-muted-foreground border-border',
    };
  }

  // Extract all candidate tokens from profile
  let candidateTokens = new Set();
  if (userOrSkills && typeof userOrSkills === 'object' && !Array.isArray(userOrSkills)) {
    candidateTokens = extractCandidateSkills(userOrSkills.profile || userOrSkills);
  } else if (Array.isArray(userOrSkills)) {
    userOrSkills.forEach((s) => s && candidateTokens.add(normalizeToken(s)));
  }

  if (candidateTokens.size === 0) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: [...jobRequirements],
      label: 'Add Skills to Match',
      colorClass: 'bg-muted text-muted-foreground border-border',
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  const candidateArray = Array.from(candidateTokens);

  jobRequirements.forEach((req) => {
    const normReq = normalizeToken(req);
    const isMatched = candidateArray.some(
      (token) => token === normReq || token.includes(normReq) || normReq.includes(token)
    );

    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  // Base match percentage on requirements
  let percentage = Math.round((matchedSkills.length / jobRequirements.length) * 100);

  // Bonus match if candidate has resume uploaded
  const hasResume = (userOrSkills?.profile?.resume || userOrSkills?.resume);
  if (hasResume && percentage > 0 && percentage < 95) {
    percentage = Math.min(100, percentage + 5);
  }

  let label = 'Needs Skills';
  let colorClass = 'bg-amber-500/10 text-amber-600 border-amber-500/20';

  if (percentage >= 70) {
    label = 'Great Match';
    colorClass = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  } else if (percentage >= 40) {
    label = 'Good Match';
    colorClass = 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  }

  return {
    percentage,
    matchedSkills,
    missingSkills,
    label,
    colorClass,
  };
};
