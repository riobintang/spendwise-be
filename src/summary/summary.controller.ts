import { NextFunction, Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/ResponseBody";
import * as summaryService from "./summary.service";

export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;
    // Tidak ada validasi Zod di summary, jadi tidak perlu parseAsync
    const summary = await summaryService.getSummary(userId);
    res
      .status(200)
      .json(successResponse("Summary fetched successfully", summary));
  } catch (error) {
    next(error);
  }
}
