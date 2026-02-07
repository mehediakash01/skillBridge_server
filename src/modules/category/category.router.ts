


import express from "express";
import { categoryController } from "./category.controller.js";
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";



const router = express.Router();

// Public
router.get("/", categoryController.getAllCategories);

// Admin only
router.post(
  "/",
  sessionAuth(UserRole.ADMIN),
  categoryController.createCategory
);

router.delete(
  "/:id",
  sessionAuth(UserRole.ADMIN),
  categoryController.deleteCategory
);

export const categoryRoutes = router;


