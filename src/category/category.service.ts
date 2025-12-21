import createHttpError, { HttpError } from "http-errors";
import { CategoryType } from "../../generated/prisma/enums";
import prisma from "../prisma/prisma";
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "./category.type.js";

export async function listCategories(
  userId: number,
  type?: CategoryType
): Promise<Category[]> {
  return await prisma.category.findMany({
    where: { userId, ...(type ? { type } : {}) },
  });
}

export async function createCategory(
  data: CategoryCreateInput,
  userId: number
): Promise<Category> {
  // TODO: Replace with Prisma create
  return await prisma.category.create({
    data: {
      name: data.name,
      type: data.type,
      color: data.color,
      icon: data.icon,
      userId,
    },
  });
}

export async function getByIdCategory(
  id: number,
  userId: number
): Promise<Category> {
  const category = await prisma.category.findFirst({
    where: { id, userId },
  });
  if (!category) {
    throw createHttpError(404, "Category not found");
  }
  return category;
}

export async function updateCategory(
  id: number,
  data: CategoryUpdateInput,
  userId: number
): Promise<Category> {
  const getCategory = await prisma.category.findFirst({
    where: { id, userId },
  });
  if (!getCategory) {
    throw createHttpError(404, "Category not found");
  }

  return await prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(
  id: number,
  userId: number
): Promise<void> {
  const category = await prisma.category.findFirst({
    where: { id, userId },
    select: {
      id: true,
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  if (!category) {
    throw createHttpError(404, "Category not found");
  }

  if (category._count.transactions > 0) {
    throw createHttpError(
      400,
      "Cannot delete category with associated transactions"
    );
  }

  await prisma.category.delete({
    where: { id },
  });
}
