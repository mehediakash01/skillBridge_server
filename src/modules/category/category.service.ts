import { prisma } from "../../lib/prisma.js";

const createCategory = async (categoryName: string) => {
  return prisma.category.create({
    data: { categoryName },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { categoryName: "asc" },
  });
};

const deleteCategory = async (id: number) => {
  return prisma.category.delete({
    where: { id },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  deleteCategory,
};
