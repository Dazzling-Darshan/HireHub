/**
 * Normalize skill name for fuzzy matching
 */
const normalizeSkill = (skill = '') => {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[.\-\s_]/g, '')
    .replace('javascript', 'js')
    .replace('typescript', 'ts')
    .replace('reactjs', 'react')
    .replace('nodejs', 'node')
    .replace('expressjs', 'express')
    .replace('mongodb', 'mongo')
    .replace('tailwindcss', 'tailwind');
};

/**
 * Calculate match percentage and skill breakdown between user profile skills and job requirements
 * @param {string[]} userSkills
 * @param {string[]} jobRequirements
 * @returns {{ percentage: number, matchedSkills: string[], missingSkills: string[], label: string, colorClass: string }}
 */
export const calculateSkillMatch = (userSkills = [], jobRequirements = []) => {
  if (!Array.isArray(jobRequirements) || jobRequirements.length === 0) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: [],
      label: 'General Role',
      colorClass: 'bg-muted text-muted-foreground border-border',
    };
  }

  if (!Array.isArray(userSkills) || userSkills.length === 0) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: [...jobRequirements],
      label: 'Add Skills to Match',
      colorClass: 'bg-muted text-muted-foreground border-border',
    };
  }

  const normalizedUserSkills = new Set(userSkills.map(normalizeSkill));

  const matchedSkills = [];
  const missingSkills = [];

  jobRequirements.forEach((req) => {
    const normReq = normalizeSkill(req);
    // Check direct equality or substring inclusion
    const isMatched = Array.from(normalizedUserSkills).some(
      (userSkill) => userSkill === normReq || userSkill.includes(normReq) || normReq.includes(userSkill)
    );

    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const percentage = Math.round((matchedSkills.length / jobRequirements.length) * 100);

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
