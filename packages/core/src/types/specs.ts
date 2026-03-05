export type StageOrder = "lecture" | "coding" | "sidequest" | "reflection";
export type SubmoduleStatus = "locked" | "available" | "in_progress" | "completed";

// ─── meta.json ────────────────────────────────────────────────────────────────

export interface FreezePolicy {
  freezeOnFirstRun: boolean;
  regenerationAllowed: boolean;
}

export interface SubmoduleMeta {
  submoduleId: string;
  title: string;
  moduleId: string;
  summary: string;
  dependsOn: string[];
  stageOrder: StageOrder[];
  recommendedSidequests: string[];
  conceptTags: string[];
  difficulty: number;
  estimatedMinutes: number;
  entryPoints: {
    lecture: string;
    coding: string;
    reflection: string;
    sidequestsIndex: string;
  };
  freezePolicy: FreezePolicy;
}

// ─── lecture/spec.json ────────────────────────────────────────────────────────

export type LectureBlockType =
  | "concept"
  | "example"
  | "common_mistakes"
  | "check_understanding";

export interface LectureBlock {
  type: LectureBlockType;
  id: string;
  title?: string;
  bullets?: string[];
  items?: string[];
  questions?: Array<{ type: string; prompt: string }>;
  constraints?: Record<string, unknown>;
}

export interface QuizSpec {
  enabled: boolean;
  count: number;
  types: string[];
  passThreshold: number;
}

export interface LectureSpec {
  version: number;
  objectives: string[];
  blocks: LectureBlock[];
  quizSpec: QuizSpec;
}

// ─── coding/prep.json ─────────────────────────────────────────────────────────

export type PrepActionType =
  | "ensure_dependency"
  | "create_file"
  | "insert_snippet";

export interface PrepAction {
  type: PrepActionType;
  pkgManager?: string;
  name?: string;
  where?: string;
  path?: string;
  templateId?: string;
  anchor?: string;
  snippetId?: string;
  strategy?: string;
}

export interface BoilerplatePlan {
  allowedFiles: string[];
  forbiddenEdits: Array<{ rule: string }>;
  actions: PrepAction[];
  patchOutput: {
    format: string;
    mustBeIdempotent: boolean;
    maxChangedLines: number;
  };
}

export interface CodingPrepJson {
  version: number;
  submoduleId: string;
  boilerplatePlan: BoilerplatePlan;
  testPreparation: {
    generateTestsNow: boolean;
    whereToWrite: {
      public: string;
      hidden: string;
    };
  };
}

// ─── coding/todo.json ─────────────────────────────────────────────────────────

export type HintStyle =
  | "concept_reminder"
  | "pseudocode"
  | "skeleton_with_blanks"
  | "one_function_outline";

export interface HintLevelSpec {
  style: HintStyle;
  maxTokens: number;
}

export interface HintingSpec {
  hintLevels: {
    L1: HintLevelSpec;
    L2: HintLevelSpec;
    L3: HintLevelSpec;
    L4: HintLevelSpec;
  };
  hintInputs: string[];
  antiLeakRules: string[];
}

export interface TriggerDetect {
  type: "ast" | "test_fingerprint";
  scopeFile?: string;
  patternId?: string;
  confidenceThreshold?: number;
  fingerprints?: string[];
}

export interface TriggerHook {
  hookId: string;
  when: "on_check" | "on_failed_test";
  detect: TriggerDetect;
  offerSideQuestId: string;
  message: string;
}

export interface TodoRegionSpec {
  todoId: string;
  filePath: string;
  regionType: string;
  purpose: string;
  signature: string;
  requirements: string[];
  constraints: string[];
  edgeCases: string[];
  hinting: HintingSpec;
  triggerHooks: TriggerHook[];
  tags: string[];
}

export interface CodingTodoJson {
  version: number;
  submoduleId: string;
  todoRegions: TodoRegionSpec[];
}

// ─── coding/verify.json ───────────────────────────────────────────────────────

export interface CheckCommand {
  id: string;
  label: string;
  cmd: string;
  mustPass: boolean;
  timeoutSeconds: number;
}

export interface TestGenSpec {
  framework: string;
  language: string;
  publicTests: { filePath: string; mustCover: string[] };
  hiddenTests: { filePath: string; mustCover: string[] };
  safetyRules: Record<string, unknown>;
  freezePolicy: { freezeAfterFirstGeneration: boolean; regenerationAllowed: boolean };
}

export interface CodingVerifyJson {
  version: number;
  submoduleId: string;
  checkCommands: CheckCommand[];
  todoCompletionRules: Array<{ rule: string; todoIds: string[] }>;
  testGenerationSpec: TestGenSpec;
  resultParsing: { testFramework: string; extractFailureFileAndLine: boolean };
}

// ─── reflection/spec.json ─────────────────────────────────────────────────────

export interface ReflectionSpec {
  version: number;
  submoduleId: string;
  prompts: string[];
  rubric: {
    requiredMentions: string[];
    maxWords: number;
    gradingStyle: string;
  };
  personalizationInputs: string[];
}
