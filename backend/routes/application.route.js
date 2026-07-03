import express from 'express';
import  applicationController  from '../controllers/application.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
const router = express.Router();

router.post("/apply/:id",isAuthenticated, applicationController.applyJob);
router.get("/get",isAuthenticated, applicationController.getAppliedJobs);
router.get("/:id/applicants", isAuthenticated,applicationController.getApplicant);
router.post("/status/:id/update",isAuthenticated, applicationController.updateStatus);

export default router; 