import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let genAIInstance = null;

/**
 * Get or initialize the GoogleGenerativeAI SDK singleton
 * @returns {GoogleGenerativeAI|null}
 */
export const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey.trim());
  }
  return genAIInstance;
};

/**
 * Check if the Gemini AI service is configured with a valid API key
 * @returns {boolean}
 */
export const isAiConfigured = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');
};

/**
 * Get a configured generative model
 * @param {Object} options
 * @param {string} options.model - Default: 'gemini-3.6-flash'
 * @param {number} options.temperature - Default: 0.2 (low temperature for deterministic, factual outputs)
 * @param {Object} options.responseSchema - Optional SchemaType definition for guaranteed structured JSON
 * @returns {any}
 */
export const getGenerativeModel = ({
  model = 'gemini-3.6-flash',
  temperature = 0.2,
  responseSchema = null,
} = {}) => {
  const client = getGenAIClient();
  if (!client) {
    throw new Error('Gemini API key is not configured in environment variables.');
  }

  const generationConfig = {
    temperature,
  };

  if (responseSchema) {
    generationConfig.responseMimeType = 'application/json';
    generationConfig.responseSchema = responseSchema;
  }

  return client.getGenerativeModel({
    model,
    generationConfig,
  });
};

export default {
  getGenAIClient,
  isAiConfigured,
  getGenerativeModel,
};
