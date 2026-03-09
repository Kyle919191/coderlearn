export type SubmoduleStatus = "locked" | "available" | "in_progress" | "completed";

export interface TreeSubmodule {
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

export interface TreeModule {
  id: string;
  order: number;
  title: string;
  description: string;
  submodules: TreeSubmodule[];
}

export interface CourseTreeResponse {
  projectId: string;
  projectRequest: string;
  templateId: string;
  createdAt: string;
  modules: TreeModule[];
}

export interface LectureQuestion {
  type: string;
  prompt: string;
}

export interface LectureBlock {
  type: "concept" | "example" | "common_mistakes" | "check_understanding";
  id: string;
  title?: string;
  bullets?: string[];
  items?: string[];
  questions?: LectureQuestion[];
  constraints?: Record<string, unknown>;
}

export interface LectureResponse {
  submoduleId: string;
  objectives: string[];
  blocks: LectureBlock[];
  quizSpec: {
    enabled: boolean;
    count: number;
    types: string[];
    passThreshold: number;
  };
}

// Engine is the local backend service created in apps/engine (see app.ts route mounts).
const ENGINE_BASE_URL = "http://localhost:3002";

export async function fetchCourseTree(includeLocked = true): Promise<CourseTreeResponse> {
  // Calls engine GET /api/tree.
  // `includeLocked` is sent as a query string because HTTP query params are strings.
  // Engine route tree.ts validates this via validateOrThrow(treeQuerySchema, req.query, ...).
  const response = await fetch(
    `${ENGINE_BASE_URL}/api/tree?includeLocked=${includeLocked ? "true" : "false"}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch tree: ${response.status}`);
  }

  // Response shape is expected to match engine CourseTree contract.
  return (await response.json()) as CourseTreeResponse;
}

export async function fetchSubmoduleLecture(submoduleId: string): Promise<LectureResponse> {
  const response = await fetch(`${ENGINE_BASE_URL}/api/submodule/${submoduleId}/lecture`);
  if (!response.ok) {
    throw new Error(`Failed to fetch lecture: ${response.status}`);
  }

  return (await response.json()) as LectureResponse;
}