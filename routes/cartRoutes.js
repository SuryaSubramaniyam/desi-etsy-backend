import express from "express";
import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", authenticate, addToCart);
router.get("/", authenticate, getCartItems);
router.delete("/:id", authenticate, removeCartItem);
router.patch("/:id", authenticate, updateCartItem);
router.delete("/clear", authenticate, clearCart);

export default router;
