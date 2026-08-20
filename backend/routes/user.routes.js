import express from 'express';
import userController from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post("/register", authLimiter, singleUpload, userController.registerUser);
router.post("/login", authLimiter, userController.loginUser);
router.get("/logout", userController.logoutUser);
router.post("/profile/update", isAuthenticated, singleUpload, userController.updateProfile);

export default router;