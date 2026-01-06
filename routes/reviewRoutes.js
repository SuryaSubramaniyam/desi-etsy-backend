import express from "express";
import { createReview, getProductReviews, getMyReviews, getReviewById,  updateReview, deleteReview } from "../controllers/reviewController.js";
import { authenticate, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:productId", authenticate, createReview);
router.get("/my", authenticate, getMyReviews);


router.get("/product/:productId", getProductReviews);


router
  .route("/:id")
  .get(authenticate, getReviewById)
  .put(authenticate, updateReview)
  .delete(authenticate, deleteReview);


export default router;
