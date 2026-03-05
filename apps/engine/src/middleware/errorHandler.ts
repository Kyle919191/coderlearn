import { Request, Response, NextFunction } from "express";
import { AppError, isAppError } from "../errors/AppError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.headers["x-request-id"];

  if (isAppError(err)) {
    console.error(`[${requestId}] AppError ${err.statusCode} ${err.code}: ${err.message}`, {
      details: err.details,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
      },
    });
    return;
  }

  const fallbackMessage = err instanceof Error ? err.message : "Internal server error";

  console.error(`[${requestId}] Unhandled error: ${fallbackMessage}`, {
    rawError: err,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      requestId,
    },
  });
}