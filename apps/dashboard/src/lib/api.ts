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

// Engine is the local backend service created in apps/engine (see app.ts route mounts).
const ENGINE_BASE_URL = "http://localhost:3000";

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