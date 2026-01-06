import express from 'express';
import {
  requestArtisan,
  getPendingArtisans,
  approveArtisan, 
  getMyOrders,
getReviewsForMyProducts,
getArtisanDashboardStats,
getAllArtisans,
  
} from '../controllers/artisanController.js';
import { authenticate, isAdmin, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get("/", getAllArtisans);
router.post('/request', authenticate, requestArtisan); // artisan request
router.get('/pending', authenticate, isAdmin, getPendingArtisans); // admin views pending
router.patch('/approve/:id', authenticate, isAdmin, approveArtisan); // admin approves
router.get("/orders", authenticate, restrictTo("artisan"), getMyOrders);
router.get("/reviews", authenticate, restrictTo("artisan"), getReviewsForMyProducts);
router.get("/dashboard", authenticate, getArtisanDashboardStats);

export default router;
