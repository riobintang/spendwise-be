import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { ZodError } from "zod";

type ResBody = {
  status: string;
  message: string;
  data?: unknown;
};
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body: ResBody = {
    status: "fail",
    message: err.message,
  };

  if (err instanceof createHttpError.HttpError) {
    return res.status(err.status).json(body);
  }

  if (err instanceof ZodError) {
    const errors: {
      message: string;
      reason: string;
      path: PropertyKey[];
    }[] = [];
    err.issues.forEach((issue) => {
      errors.push({
        message: issue.message,
        reason: `${issue.path.join(".")} is ${issue.message}`,
        path: issue.path,
      });
    });
    return res.status(400).json({
      status: "fail",
      message: "Validation Error",
      data: errors,
    });
  }
  body.status = "error";
  body.message = "Internal Server Error";
  console.dir(err);
  return res.status(500).json(body);
}
