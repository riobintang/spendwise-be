import { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";
import { registerSchema, loginSchema } from "./user.validation";
import { successResponse } from "../utils/ResponseBody";

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
