import express from 'express';
import {
  getAllUsers,
  getAllArtisans,
  approveArtisan,
  getAllProducts,
  approveProduct,
  deleteProduct,
  getAllOrders,
  toggleUserBlock, 
  updateOrderStatus, 
  getAllReviewsAdmin,
   deleteReviewAdmin,
   getDashboardStats,
} from '../controllers/adminController.js';

import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, isAdmin); // all routes below are admin-protected

router.get('/users', getAllUsers);
router.get('/artisans', getAllArtisans);
router.patch('/artisans/:id/approve', approveArtisan);
router.patch('/users/:id/block', toggleUserBlock);

router.get('/products', getAllProducts);
router.get('/orders', getAllOrders);
router.patch('/products/:id/approve', approveProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/orders/:id/status', updateOrderStatus);

router.get("/reviews", getAllReviewsAdmin);
router.delete("/reviews/:id", deleteReviewAdmin);
router.get("/dashboard-stats", authenticate, isAdmin, getDashboardStats);

export default router;
