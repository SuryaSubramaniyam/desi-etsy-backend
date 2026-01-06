import express from "express";
import {
  getAllCategories,      // public GET /categories/public
  createCategory,        // admin POST /categories
  getCategories,         // admin GET /categories
  updateCategory,        // admin PATCH /categories/:id
  deleteCategory         // admin DELETE /categories/:id
} from "../controllers/categoryController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ PUBLIC route
router.get("/public", getAllCategories);

// ✅ ADMIN-only routes
router.use(authenticate, isAdmin);

router.post("/", createCategory);
router.get("/", getCategories);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
