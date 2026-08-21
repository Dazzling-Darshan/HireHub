import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { analyzeCandidateSkillFit } from '../controllers/ai.controller.js';

const router = express.Router();

// Candidate AI Skill Match & Resume Analysis
router.route('/skill-match/:jobId').post(isAuthenticated, analyzeCandidateSkillFit);

export default router;
