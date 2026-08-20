import express from 'express';
import  jobController  from '../controllers/job.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
const router = express.Router();

router.post("/post", isAuthenticated, jobController.postJob);
router.put("/update/:id", isAuthenticated, jobController.updateJob);
router.get("/get", jobController.getAllJobs);
router.get("/get/adminjobs", isAuthenticated, jobController.getAdminJobs);
router.get("/get/:id", jobController.getJobById);

router.get("/test", (req, res) => {
    res.send("Job route working");
});

export default router; 