import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';
import {
  parseResume,
  analyzeCandidateSkillFit,
  rankApplicantsForJob,
  generateJobDescription,
  careerNavigator,
} from '../controllers/ai.controller.js';

const router = express.Router();

// Apply AI rate limiter to all AI endpoints
router.use(aiLimiter);

// Parse Resume (PDF Upload or Existing Cloudinary Resume)
router.route('/parse-resume').post(isAuthenticated, singleUpload, parseResume);

// Candidate AI Skill Match & Resume Analysis
router.route('/skill-match/:jobId').post(isAuthenticated, analyzeCandidateSkillFit);

// Recruiter AI Candidate Ranking
router.route('/rank-applicants/:jobId').post(isAuthenticated, rankApplicantsForJob);

// Recruiter AI Job Description Generation
router.route('/generate-job-description').post(isAuthenticated, generateJobDescription);

// Grounded Multi-Job RAG Career Navigator
router.route('/career-navigator').post(isAuthenticated, careerNavigator);

export default router;
