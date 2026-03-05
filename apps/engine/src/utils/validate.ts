import { ZodError, z } from "zod";
import {AppError } from "../errors/AppError";

export function validateOrThrow<TSchema extends z.ZodTypeAny>(
    schema: TSchema,
    input: unknown,
    errorMessage: string
): z.infer<TSchema> {
    try {
        return schema.parse(input) as z.infer<TSchema>;
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            throw new AppError(400, "VALIDATION_ERROR", errorMessage, error.issues)
        }
        throw error;
    }
}