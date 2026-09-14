import express from 'express';
import companyController from '../controllers/company.controller.js';
import isAuthenticated, { isRecruiter } from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';
const router = express.Router();

router.post("/register", isAuthenticated, isRecruiter, companyController.registerCompany);
router.get("/get", isAuthenticated, companyController.getCompanies);
router.get("/get/:id", isAuthenticated, companyController.getCompanyById);
router.put("/update/:id", isAuthenticated, isRecruiter, singleUpload, companyController.updateCompany);

export default router; 