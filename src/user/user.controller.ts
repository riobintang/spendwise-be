import { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";
import { registerSchema, loginSchema } from "./user.validation";
import { successResponse } from "../utils/ResponseBody";
import createHttpError from "http-errors";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = await registerSchema.parseAsync(req.body);
    const user = await userService.register(parsed);
    res.status(201).json(successResponse("User registered successfully", user));
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = await loginSchema.parseAsync(req.body);
    const data = await userService.login(parsed);
    res.status(200).json(successResponse("User logged in successfully", data));
  } catch (error) {
    next(error);
  }
}

export async function updateProfilePhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw createHttpError(400, "No file uploaded");
    }
    const userId = req.user!.id;
    const result = await userService.updateProfilePhoto(userId, req.file);
    res.status(200).json(successResponse("Profile photo updated successfully", result));
  } catch (error) {
    next(error);
  }
}

export async function deleteProfilePhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    await userService.deleteProfilePhoto(userId);
    res.status(200).json(successResponse("Profile photo deleted successfully", null));
  } catch (error) {
    next(error);
  }
}
