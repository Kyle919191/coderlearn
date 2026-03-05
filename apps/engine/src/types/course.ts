import type { SubmoduleStatus } from "@learnmode/core";

export type TemplateId = "todo-pro";

export interface Submodule {
    id: string;
    moduleId: string;
    order: number;
    title: string;
    description: string;
    status: SubmoduleStatus;
    dependsOn: string[];
    hasQuiz: boolean;
    hasSideQuest: boolean;
}

export interface Module {
    id: string;
    order: number;
    title: string;
    description: string;
    submodules: Submodule[];
}

export interface CourseTree {
    projectId: string;
    projectRequest: string;
    templateId: TemplateId;
    createdAt: string;
    modules: Module[];
}

export interface CheckReport {
    submoduleId: string;
    passed: boolean;
    todoRegions: TodoRegionResult[];
    testResults: TestResult[];
    requestId: string;
}

export interface TodoRegionResult {
    id: string;
    filled: boolean;
    filePath: string;
    line: number;
}

export interface TestResult {
    name: string;
    passed: boolean;
    errorMessage?: string;
    filePath?: string;
    line?: number;
}

export interface HintRequest {
    submoduleId: string;
    todoId: string;
    level: 1 | 2 | 3 | 4;
}

export interface HintResponse {
    level: 1 | 2 | 3 | 4;
    content: string;
    nextLevelAvailable: boolean;
}