import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type CategoryPayload = {
  categoryName: string;
  description?: string;
  icon?: string;
  isTrending?: boolean;
  learnerCount?: number;
  startingPrice?: string | number;
  tags?: string[];
};

const createCategory = async (payload: CategoryPayload) => {
  const startingPrice =
    payload.startingPrice !== undefined && payload.startingPrice !== null
      ? new Prisma.Decimal(payload.startingPrice)
      : undefined;

  return prisma.category.create({
    data: {
      categoryName: payload.categoryName,
      description: payload.description,
      icon: payload.icon,
      isTrending: payload.isTrending,
      learnerCount: payload.learnerCount,
      startingPrice,
      tags: payload.tags ?? [],
    },
  });
};

const updateCategory = async (id: number, payload: Partial<CategoryPayload>) => {
  const startingPrice =
    payload.startingPrice !== undefined && payload.startingPrice !== null
      ? new Prisma.Decimal(payload.startingPrice)
      : undefined;

  return prisma.category.update({
    where: { id },
    data: {
      ...(payload.categoryName !== undefined ? { categoryName: payload.categoryName } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.icon !== undefined ? { icon: payload.icon } : {}),
      ...(payload.isTrending !== undefined ? { isTrending: payload.isTrending } : {}),
      ...(payload.learnerCount !== undefined ? { learnerCount: payload.learnerCount } : {}),
      ...(startingPrice !== undefined ? { startingPrice } : {}),
      ...(payload.tags !== undefined ? { tags: payload.tags } : {}),
    },
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
  updateCategory,
  getAllCategories,
  deleteCategory,
};
