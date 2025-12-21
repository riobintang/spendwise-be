import { NextFunction, Request, Response } from "express";
import { successResponse, failResponse, errorResponse } from "../utils/ResponseBody";
import * as walletService from "./wallet.service";
import {
  getWalletParamsSchema,
  walletCreateSchema,
  walletUpdateSchema,
} from "./wallet.validation";

export async function listWallets(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const wallets = await walletService.listWallets(userId);
    res.status(200).json(successResponse("Wallets fetched successfully", wallets));
  } catch (error) {
    next(error);
  }
}

export async function createWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = await walletCreateSchema.parseAsync(req.body);
    const userId = req.user.id;
    const wallet = await walletService.createWallet(parsed, userId);
    res.status(201).json(successResponse("Wallet created successfully", wallet));
  } catch (error) {
    next(error);
  }
}

export async function updateWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const parsedId = await getWalletParamsSchema.parseAsync(id);
    const parsed = await walletUpdateSchema.parseAsync(req.body);
    const updated = await walletService.updateWallet(
      parsedId.id,
      parsed,
      userId
    );
    res.status(200).json(successResponse("Wallet updated successfully", updated));
  } catch (error) {
    next(error);
  }
}

export async function deleteWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const parsedId = await getWalletParamsSchema.parseAsync(id);
    await walletService.deleteWallet(parsedId.id, userId);
    res.status(204).json(successResponse("Wallet deleted successfully", null));
  } catch (error) {
    next(error);
  }
}
