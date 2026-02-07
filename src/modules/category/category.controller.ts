import { Request, Response } from "express";
import { categoryService } from "./category.service.js";

const createCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const category = await categoryService.createCategory(categoryName);

  res.status(201).json({
    success:true,
    message: "Category created successfully",
    data: category,
  });
};

const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();

  res.status(200).json({
    success:true,
    message:"retrieving category successfully",
    data: categories,
  });
};

const deleteCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const category = await categoryService.deleteCategory(id);

  res.status(200).json({
    success:true,
    message: "Category deleted",
    data: category,
  });
};

export const categoryController = {
  createCategory,
  getAllCategories,
  deleteCategory,
};
