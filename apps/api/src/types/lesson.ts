export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Language = "typescript" | "python" | "java" | "go";

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}

export interface LearningTrack {
    id: string;
    language: Language;
    title: string;
    totalDays: number;
}

export interface Lesson {
    id: string;
    trackId: string;
    day: number;
    title: string;
    difficulty: Difficulty;
    concepts: string[];
    isCompleted: boolean;
    completedAt?: Date; //? means that it is optional
}

export interface LessonResult {
    lessonId: string;
    userId: string;
    score: number;
    feedback: string;
    submittedAt: Date;
}