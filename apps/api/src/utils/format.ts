import { Lesson, Difficulty } from "../types/lesson";

export function first<T>(items: T[]): T | undefined {
    return items[0];
}

export function last<T>(items: T[]): T | undefined {
    return items[items.length - 1];
  }
export function formatLesson(lesson: Lesson): string {
    const status = lesson.isCompleted ? "done" : "pending";
    return `[${status}] Day ${lesson.day}: ${lesson.title} (${lesson.difficulty})`;
}

export function difficultyRank(d: Difficulty): number {
    const order: Record<Difficulty, number> = { // like Map<K, V>, record is a key word
        beginner: 1,
        intermediate: 2,
        advanced: 3,
    }
    return order[d];
}

