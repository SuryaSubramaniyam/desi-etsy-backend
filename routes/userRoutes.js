import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/profile")
  .get(authenticate, getUserProfile)
  .patch(authenticate, updateUserProfile);

export default router;
