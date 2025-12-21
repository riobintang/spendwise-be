import { NextFunction, Request, Response } from "express";
import * as transactionService from "./transaction.service";
import {
  transactionCreateSchema,
  transactionIdParamSchema,
  transactionUpdateSchema,
} from "./transaction.validation";
import { Decimal } from "@prisma/client/runtime/library";
import {
  successResponse,
  failResponse,
  errorResponse,
} from "../utils/ResponseBody";

export async function listTransactions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { startDate, endDate, categoryId } = req.query;
    const user = req.user;
    const result = await transactionService.listTransactions({
      startDate: startDate as string,
      endDate: endDate as string,
      categoryId: categoryId as string,
    });
    res
      .status(200)
      .json(successResponse("Transactions fetched successfully", result));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch transactions"));
  }
}

export async function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = await transactionCreateSchema.parseAsync(req.body);
    const userId = req.user.id;
    const transaction = await transactionService.createTransaction({
      ...parsed,
      userId,
    });
    res
      .status(201)
      .json(successResponse("Transaction created successfully", transaction));
  } catch (error) {
    next(error);
  }
}

export async function updateTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const parsedId = await transactionIdParamSchema.parseAsync(id);
    const parsed = await transactionUpdateSchema.parseAsync(req.body);
    const updated = await transactionService.updateTransaction(
      parsedId.id,
      parsed
    );
    res
      .status(200)
      .json(successResponse("Transaction updated successfully", updated));
  } catch (error) {
    next(error);
  }
}

export async function deleteTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const parsedId = await transactionIdParamSchema.parseAsync(id);
    await transactionService.deleteTransaction(parsedId.id, userId);
    res
      .status(204)
      .json(successResponse("Transaction deleted successfully", null));
  } catch (error) {
    next(error);
  }
}
