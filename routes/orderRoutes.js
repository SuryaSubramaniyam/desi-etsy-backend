import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getSales,
  updateOrderStatus, 
  getOrderById,
  cancelOrder,
  createRazorpayOrder, 
  verifyRazorpayPayment,
} from '../controllers/orderController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post("/create-razorpay-order", authenticate, createRazorpayOrder);
router.post("/verify-razorpay", authenticate, verifyRazorpayPayment);

router.post('/', authenticate, placeOrder); // customer places order
router.get('/my', authenticate, getMyOrders); // customer order history
router.get('/sales', authenticate, getSales); // artisan sales
router.patch('/:id/status', authenticate, updateOrderStatus); // artisan/admin updates status
router.get("/:id", authenticate, getOrderById);
// routes/orderRoutes.js
router.patch("/:id/cancel", authenticate, cancelOrder);



export default router;
