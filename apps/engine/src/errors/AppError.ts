export type AppErrorCode = "VALIDATION_ERROR" | "CONTENT_NOT_FOUND" | "INTERNAL_ERROR";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: AppErrorCode;
    public readonly details?: unknown;

    constructor(statusCode: number, code: AppErrorCode, message: string, details?: unknown) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}