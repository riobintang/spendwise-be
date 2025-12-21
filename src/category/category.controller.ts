import { NextFunction, Request, Response } from "express";
import {
  successResponse,
  failResponse,
  errorResponse,
} from "../utils/ResponseBody";
import * as categoryService from "./category.service";
import {
  categoryCreateSchema,
  getAllCategoryQuerySchema,
  getCategoryParamsSchema,
} from "./category.validation";

export async function listCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;
    const parsed = await getAllCategoryQuerySchema.parseAsync(req.query);
    const categories = await categoryService.listCategories(
      userId,
      parsed.type
    );
    res
      .status(200)
      .json(successResponse("Categories fetched successfully", categories));
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = await categoryCreateSchema.parseAsync(req.body);
    const userId = req.user.id;
    const category = await categoryService.createCategory(parsed, userId);
    res
      .status(201)
      .json(successResponse("Category created successfully", category));
  } catch (error) {
    next(error);
  }
}

export async function getByIdCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const parsedId = await getCategoryParamsSchema.parseAsync(id);
    const category = await categoryService.getByIdCategory(parsedId.id, userId);
    res
      .status(200)
      .json(successResponse("Category fetched successfully", category));
  } catch (error) {
    next(error);
  }
}
