import express from 'express';
import {
  createProduct,
  getAllProducts,
  getMyProducts,
  updateProduct,
  deleteProduct, getProductById
} from '../controllers/productController.js';
import { authenticate, restrictTo } from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

// Public
router.get("/", getAllProducts);

// Artisan routes
router.post("/", authenticate, restrictTo("artisan"), upload.single("image"), createProduct);
 // already exists, make sure it supports pagination

router.get('/me', authenticate, getMyProducts);
// router.put('/:id', authenticate, updateProduct);
// router.delete('/:id', authenticate, deleteProduct);
router.put("/:id", authenticate, restrictTo("artisan"), upload.single("image"), updateProduct);
router.delete("/:id", authenticate, restrictTo("artisan"), deleteProduct);

router.get("/:id", getProductById);
export default router;
