import { MulterError } from "multer";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: error.flatten()
    });
    return;
  }

  if (error instanceof MulterError) {
    const isFileSizeError = error.code === "LIMIT_FILE_SIZE";

    res.status(400).json({
      message: isFileSizeError ? "The PDF is too large for upload." : error.message,
      code: isFileSizeError ? "FILE_TOO_LARGE" : "UPLOAD_ERROR"
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code ?? "APP_ERROR",
      details: error.details
    });
    return;
  }

  logger.error(error);
  res.status(500).json({ message: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
};
