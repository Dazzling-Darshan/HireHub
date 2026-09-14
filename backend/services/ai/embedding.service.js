import { getGenAIClient, isAiConfigured } from './gemini.client.js';

/**
 * Generate semantic vector embedding for a given text using Google Gemini
 * @param {string} text
 * @returns {Promise<number[]|null>}
 */
export const generateEmbedding = async (text) => {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return null;
  }

  if (!isAiConfigured()) {
    console.warn('[EmbeddingService] Gemini API unconfigured. Skipping vector generation.');
    return null;
  }

  try {
    const client = getGenAIClient();
    if (!client) return null;

    // Truncate to first 3,000 characters for optimal embedding performance
    const cleanText = text.trim().slice(0, 3000);

    const model = client.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent(cleanText);

    return result?.embedding?.values || null;
  } catch (error) {
    console.warn('[EmbeddingService] Error generating embedding:', error.message);
    return null;
  }
};

/**
 * Compute cosine similarity between two numeric vectors
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Score between -1 and 1 (1 = identical semantic direction)
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length === 0 || vecB.length === 0) {
    return 0;
  }

  const minLength = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < minLength; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Format standard searchable text document for a Job posting
 * @param {Object} job
 * @returns {string}
 */
export const buildJobEmbeddingText = (job) => {
  const reqs = Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements || '';
  const companyName = job.company?.name || 'Company';
  const descSnippet = (job.description || '').replace(/\s+/g, ' ').slice(0, 500);

  return `Title: ${job.title} | Company: ${companyName} | Location: ${job.location} | Role Type: ${job.jobType} | Experience: ${job.experience} yrs | Requirements: ${reqs} | Description: ${descSnippet}`;
};

export default {
  generateEmbedding,
  cosineSimilarity,
  buildJobEmbeddingText,
};
