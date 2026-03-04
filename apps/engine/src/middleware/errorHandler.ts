import {Request, Response, NextFunction} from "express";

export interface AppError extends Error {
    statusCode?: number;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction): void {
    const statusCode = err.statusCode ?? 500;
    const requestId = req.headers["x-request-id"] as string;

    console.error(`[${requestId}] Error ${statusCode}: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
      });

    res.status(statusCode).json({
        error: {
            message: err.message ?? "Internal server error",
            requestId,
        },
    });
}