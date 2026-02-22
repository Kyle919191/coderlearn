import { User } from "../types/lesson"; //going back two levels to src/types/lesson.ts, import matches export from export inerface User

export function isValidEmail(email: string): boolean {
    return email.includes("@") && email.includes(".");
}

export function isValidScore(score: number): boolean {
    return score >= 0 && score <= 100;
}

export function parseScore(input: unknown): number | null {
    if (typeof input == "number" && isValidScore(input)) { // unknown is usually paired with typeof to check at runtime
        return input;
    }
return null;
}

export function isUser(value: unknown): value is User { //return type is "value is User" instead of boolean because it implicitly assigns value the type User if the condition is true, making susbequent calls to value easier
    return (
        typeof value === "object" &&
        value != null &&
        "id" in value &&
        "name" in value
    );
}