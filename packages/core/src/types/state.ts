import type { SubmoduleStatus } from "./specs";

export interface SubmoduleProgress {
  submoduleId: string;
  status: SubmoduleStatus; // locked | available | in_progress | completed
  quizPassed: boolean;
  checksPassed: boolean;
  hintUsageCount: number;
  prepGenerated: boolean;
  testsGenerated: boolean;
  reflectionSubmitted: boolean;
  updatedAt: string; // ISO timestamp
}

export interface LearnModeState {
  version: 1;
  projectId: string;
  templateId: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  submodules: Record<string, SubmoduleProgress>;
}