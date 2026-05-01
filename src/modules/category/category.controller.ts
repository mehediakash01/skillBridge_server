import { Request, Response } from "express";
import { categoryService } from "./category.service.js";

const createCategory = async (req: Request, res: Response) => {
  const { categoryName, description, icon, isTrending, learnerCount, startingPrice, tags } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const category = await categoryService.createCategory({
    categoryName,
    description,
    icon,
    isTrending,
    learnerCount: learnerCount !== undefined ? Number(learnerCount) : undefined,
    startingPrice,
    tags: Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.trim()
        ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
        : undefined,
  });

  res.status(201).json({
    success:true,
    message: "Category created successfully",
    data: category,
  });
};

const updateCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { categoryName, description, icon, isTrending, learnerCount, startingPrice, tags } = req.body;

  const category = await categoryService.updateCategory(id, {
    categoryName,
    description,
    icon,
    isTrending,
    learnerCount: learnerCount !== undefined ? Number(learnerCount) : undefined,
    startingPrice,
    tags: Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.trim()
        ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
        : undefined,
  });

  res.status(200).json({
    success:true,
    message: "Category updated successfully",
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
  updateCategory,
  getAllCategories,
  deleteCategory,
};
