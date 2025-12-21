import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/ResponseBody";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createHttpError(401, "Authorization header missing or malformed");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as {
      id: number;
      email: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
    next();
  } catch (err) {
    return res.status(401).json(errorResponse("Invalid or expired token"));
  }
}
