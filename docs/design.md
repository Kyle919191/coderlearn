# LearnMode MVP Design Doc + Build Checklist

---

## 0. What We're Building (Purpose)

LearnMode is a learning-first coding experience built on top of existing IDE workflows. It guides programming learners through building real production-style software (full stack: frontend + backend + DB + deployment + observability), while ensuring they don't "skip the learning" via AI-generated full solutions.

**Core idea:**
- AI can generate boilerplate (imports, wiring, config, skeleton files)
- The learner must implement core logic inside TODO regions
- The system enforces progress using deterministic verification (tests, TODO completion, optional typecheck/lint)
- Learners receive dynamic hints based on their current wrong code + failing tests
- Side quests are triggered during coding when certain tradeoffs or patterns appear
- Every submodule ends with a guided reflection

---

## 1. Target Users / Clients

**Primary users:**
- Programming learners who want to genuinely learn but rely too much on AI IDEs
- CS students / bootcamp students needing structured progression + proof of learning
- Teachers/TAs who want "AI allowed but learning outcomes enforced"
- Teams onboarding interns/juniors (optional later): guided skill-building inside real repos

This is **not** "a better AI IDE." It is a learning layer that coexists with IDEs and AI coding assistants.

---

## 2. Product UX Overview

1. User enters a project request: *"Build a production-ready todo app with auth, db, deployment."*
2. **Course-level AI generates a course plan:**
   - module tree + submodules
   - for each submodule: lecture / coding / sidequest / reflection instruction files
   - does NOT generate full real code now — it generates instruction specs
3. User sees a Duolingo-like skill tree (web UI, later in IDE extension too)
4. For each submodule, the learner progresses through stages: **Lecture → Coding → Side Quest (optional) → Reflection**
5. **"Advance" is only possible when:**
   - quiz passed (if enabled)
   - TODO regions implemented
   - tests pass

---

## 3. Architecture (Engine + CLI + Web + IDE Shell)

### Components

**A) Local Engine (Node.js, TypeScript) — the brain**
- Owns course state, unlock rules, TODO parsing, test running, hint calls, sidequest triggers
- Exposes localhost HTTP API for all clients
- Stores state in `.learnmode/state.json` (MVP)
- Applies patches safely (never edits TODO regions)

**B) CLI (`learnmode`) — universal adapter**
- `init` repo/template, start engine, open dashboard
- `check` / `hint` / `bench` from terminal (works with any IDE)
- Manages daemon lifecycle

**C) Web Dashboard (React) — Duolingo UI**
- Skill tree with locked/unlocked/green nodes
- Lecture view, quiz, build tab, check results, hints drawer
- Compare tab for sidequests (metrics)

**D) VS Code Extension (optional after MVP)**
- Tree panel + diagnostics + CodeLens on TODO blocks
- Uses same engine API
- Cursor compatibility because Cursor is VS Code-based

### Why this design
- You don't build an IDE — users keep Cursor/Claude Code/VS Code/JetBrains
- Your system enforces learning using tests + TODO gating
- Logic lives in one place (the engine); ship web UI fast, build IDE delight later

---

## 4. Tech Stack (MVP)

### Template project ("Todo Pro")
- **Frontend:** React + Vite + TypeScript
- **Backend:** Node + Express + TypeScript
- **DB:** Postgres
- **ORM:** Prisma (side quest: raw SQL alternative)
- **Auth:** JWT (basic)
- **Deployment:** Docker Compose (local "production-ish")
- **Observability:** structured logging + request IDs + health endpoint

### LearnMode system itself
- **Engine:** Node.js + TypeScript + Express
- **Web:** React + Vite + TypeScript
- **Storage:** file-based `.learnmode/` (MVP); SQLite later if needed
- **LLM:** Google Gemini API (key in `apps/engine/.env` as `GEMINI_API_KEY`, never committed)

---

## 5. AI Usage (Two-Level Ideology)

### 5.1 Course-level AI (Planner) — generates course specs, not code

Runs once per course start and outputs:
- modules/submodules + dependencies
- for each submodule: lecture / coding / sidequest / reflection folders and instruction files
- coding stage includes: boilerplate plan (actions), TODO region specs, verify spec (how to generate tests)

This output is **frozen** (hash) so the course doesn't mutate mid-run.

### 5.2 Submodule-level AI (Single agent per submodule)

For each submodule, one agent handles all stages guided by the spec files:

| Stage | What the agent does |
|---|---|
| Lecture | Generate content/blocks based on `lecture/spec.md` + `lecture/spec.json` |
| Coding Prep | Read `coding/prep.json`, output a unified diff patch to apply boilerplate |
| Tests | Generate tests per `coding/verify.json` (public + hidden), freeze on first generation |
| Hints | Dynamic generation based on `coding/todo.json` + user's TODO code + failing tests |
| Sidequest | Triggered by `triggerHooks` in `coding/todo.json`, uses `sidequests/` mini-submodule specs |
| Reflection | Generate prompt guidance using `reflection/spec.json` |

### Guardrails
- AI never outputs complete solutions for TODO blocks
- AI can only propose patches outside TODO regions
- Engine rejects any patch that violates allowed zones
- Tests are generated once per submodule and then frozen

---

## 6. Determinism & Freeze Points (Critical)

To prevent "moving goalposts":
- Freeze `course_spec` after course-level AI generates it
- For each submodule:
  - freeze boilerplate patch after first generation
  - freeze public/hidden tests after first generation
  - sidequests: freeze quest specs once triggered

---

## 7. Submodule Filesystem Spec (Canonical)

The course-level AI must output the following structure per submodule:

```
submodules/<submoduleId>/
  meta.json

  lecture/
    spec.md
    spec.json

  coding/
    prep.json
    todo.json
    verify.json

  sidequests/
    index.json
    quests/
      <questId>/
        meta.json
        lecture/
          spec.md
          spec.json
        coding/
          prep.json
          todo.json
          verify.json
        reflection/
          spec.json

  reflection/
    spec.json
```

The engine reads these files, runs the corresponding stage workflows, applies patches, runs checks, and stores progress state.

---

## 8. Exact File Contents (Examples)

### 8.1 `submodules/<id>/meta.json`
```json
{
  "submoduleId": "2.2-crud-create-list",
  "title": "CRUD: Create + List",
  "moduleId": "2-backend-basics",
  "summary": "Implement create/list todo service functions with validation and API wiring.",
  "dependsOn": ["2.1-routes-and-controllers"],
  "stageOrder": ["lecture", "coding", "reflection"],
  "recommendedSidequests": ["service-layer-pattern", "input-validation"],
  "conceptTags": ["validation", "dto", "service-layer", "db"],
  "difficulty": 2,
  "estimatedMinutes": 35,
  "entryPoints": {
    "lecture": "lecture/spec.md",
    "coding": "coding/prep.json",
    "reflection": "reflection/spec.json",
    "sidequestsIndex": "sidequests/index.json"
  },
  "freezePolicy": {
    "freezeOnFirstRun": true,
    "regenerationAllowed": false
  }
}
```

### 8.2 `lecture/spec.md`
```markdown
# Lecture Spec — 2.2 CRUD: Create + List

## Learning objectives
- Explain why we validate at the boundary of the system.
- Implement Create + List in a service layer (not in the controller).
- Describe DTO vs DB model and why separation helps.

## Concepts to teach
- Validation boundaries: never trust input
- DTO vs persistence model
- Service layer responsibilities
- Error handling contract (AppError)

## Example (must be DIFFERENT from assignment)
Use a different domain object than "todo" (e.g., "notes").

## Common pitfalls
- DB calls inside controllers
- Returning raw DB rows directly
- Not scoping list results to userId

## Check-for-understanding questions
1. Where should validation happen and why?
2. Why avoid DB logic inside controllers?
3. Difference between DTO and DB model?
```

### 8.3 `lecture/spec.json`
```json
{
  "version": 1,
  "objectives": [
    "Explain why we validate at the boundary of the system",
    "Implement Create + List in a service layer",
    "Distinguish DTO from DB model"
  ],
  "blocks": [
    {
      "type": "concept",
      "id": "validation-boundaries",
      "title": "Validate at the boundary",
      "bullets": [
        "Never trust req.body or external inputs",
        "Reject invalid input early to simplify downstream logic"
      ]
    },
    {
      "type": "concept",
      "id": "dto-vs-model",
      "title": "DTO vs DB model",
      "bullets": [
        "DTO is your API contract",
        "DB model is internal persistence representation"
      ]
    },
    {
      "type": "example",
      "id": "example-notes",
      "title": "Example: Notes service",
      "constraints": {
        "mustUseDifferentDomainObject": "notes",
        "mustNotMirrorTodoExactFunctions": true
      }
    },
    {
      "type": "common_mistakes",
      "id": "pitfalls",
      "items": [
        "DB calls inside controllers",
        "Returning raw DB row with sensitive fields",
        "Not scoping list results by userId"
      ]
    },
    {
      "type": "check_understanding",
      "id": "cu",
      "questions": [
        { "type": "short", "prompt": "Where should validation happen and why?" },
        { "type": "short", "prompt": "Why avoid DB logic inside controllers?" }
      ]
    }
  ],
  "quizSpec": {
    "enabled": true,
    "count": 6,
    "types": ["mcq", "tradeoff"],
    "passThreshold": 0.8
  }
}
```

### 8.4 `coding/prep.json` (boilerplate plan)
```json
{
  "version": 1,
  "submoduleId": "2.2-crud-create-list",
  "boilerplatePlan": {
    "allowedFiles": [
      "backend/src/app.ts",
      "backend/src/routes/todos.ts",
      "backend/src/services/todos.ts",
      "backend/src/schemas/todos.ts"
    ],
    "forbiddenEdits": [
      { "rule": "do_not_edit_todo_regions" },
      { "rule": "do_not_overwrite_user_files_without_patch" }
    ],
    "actions": [
      { "type": "ensure_dependency", "pkgManager": "pnpm", "name": "zod", "where": "backend" },
      { "type": "create_file", "path": "backend/src/routes/todos.ts", "templateId": "express_router_base" },
      { "type": "create_file", "path": "backend/src/services/todos.ts", "templateId": "service_base" },
      { "type": "create_file", "path": "backend/src/schemas/todos.ts", "templateId": "zod_schema_base" },
      {
        "type": "insert_snippet",
        "path": "backend/src/app.ts",
        "anchor": "// ROUTES",
        "snippetId": "wire_todos_router",
        "strategy": "insert_after_anchor"
      }
    ],
    "patchOutput": {
      "format": "unified_diff",
      "mustBeIdempotent": true,
      "maxChangedLines": 300
    }
  },
  "testPreparation": {
    "generateTestsNow": true,
    "whereToWrite": {
      "public": "backend/src/services/todos.test.ts",
      "hidden": ".learnmode/tests_hidden/2.2/todos.hidden.test.ts"
    }
  }
}
```

### 8.5 `coding/todo.json` (TODO regions + hints + sidequest triggers)
```json
{
  "version": 1,
  "submoduleId": "2.2-crud-create-list",
  "todoRegions": [
    {
      "todoId": "service_createTodo",
      "filePath": "backend/src/services/todos.ts",
      "regionType": "LEARNMODE_BLOCK",
      "purpose": "Create a todo owned by the authenticated user",
      "signature": "createTodo(userId: string, input: CreateTodoInput): Promise<TodoDTO>",
      "requirements": [
        "validate title non-empty",
        "trim title",
        "persist ownerId=userId",
        "return DTO { id, title, completed, createdAt }"
      ],
      "constraints": [
        "must not access Express req/res",
        "must throw AppError('VALIDATION_ERROR', ...) on invalid input"
      ],
      "edgeCases": ["empty title", "title > 200 chars", "userId empty"],
      "hinting": {
        "hintLevels": {
          "L1": { "style": "concept_reminder", "maxTokens": 120 },
          "L2": { "style": "pseudocode", "maxTokens": 180 },
          "L3": { "style": "skeleton_with_blanks", "maxTokens": 220 },
          "L4": { "style": "one_function_outline", "maxTokens": 260 }
        },
        "hintInputs": ["todoSpec", "userTodoCode", "failingTestsSummary", "surroundingSignatures"],
        "antiLeakRules": ["do_not_output_complete_function_body", "do_not_output_full_solution"]
      },
      "triggerHooks": [
        {
          "hookId": "controller-db-logic",
          "when": "on_check",
          "detect": {
            "type": "ast",
            "scopeFile": "backend/src/routes/todos.ts",
            "patternId": "db_call_inside_route_handler",
            "confidenceThreshold": 0.7
          },
          "offerSideQuestId": "service-layer-pattern",
          "message": "You're doing DB work in the controller. Want a side quest on the Service Layer pattern?"
        },
        {
          "hookId": "missing-validation",
          "when": "on_failed_test",
          "detect": {
            "type": "test_fingerprint",
            "fingerprints": ["VALIDATION_EMPTY_TITLE_FAILS", "LONG_TITLE_ACCEPTED"]
          },
          "offerSideQuestId": "input-validation",
          "message": "Looks like validation is missing. Want a mini quest on validation boundaries?"
        }
      ],
      "tags": ["service-layer", "validation", "db", "dto"]
    }
  ]
}
```

### 8.6 `coding/verify.json` (tests + commands + freeze)
```json
{
  "version": 1,
  "submoduleId": "2.2-crud-create-list",
  "checkCommands": [
    {
      "id": "backend-tests",
      "label": "Run backend test suite",
      "cmd": "pnpm -C backend test",
      "mustPass": true,
      "timeoutSeconds": 20
    },
    {
      "id": "backend-typecheck",
      "label": "Typecheck backend",
      "cmd": "pnpm -C backend typecheck",
      "mustPass": false,
      "timeoutSeconds": 20
    }
  ],
  "todoCompletionRules": [
    { "rule": "all_todo_regions_must_be_replaced", "todoIds": ["service_createTodo"] }
  ],
  "testGenerationSpec": {
    "framework": "vitest",
    "language": "ts",
    "publicTests": {
      "filePath": "backend/src/services/todos.test.ts",
      "mustCover": [
        "createTodo returns id and DTO shape",
        "createTodo rejects empty title"
      ]
    },
    "hiddenTests": {
      "filePath": ".learnmode/tests_hidden/2.2/todos.hidden.test.ts",
      "mustCover": ["reject long title", "does not leak across users"]
    },
    "safetyRules": {
      "noNetwork": true,
      "randomMustBeSeeded": true,
      "maxRuntimeSeconds": 10
    },
    "freezePolicy": {
      "freezeAfterFirstGeneration": true,
      "regenerationAllowed": false
    }
  },
  "resultParsing": { "testFramework": "vitest", "extractFailureFileAndLine": true }
}
```

### 8.7 `sidequests/index.json`
```json
{
  "version": 1,
  "submoduleId": "2.2-crud-create-list",
  "quests": [
    {
      "questId": "service-layer-pattern",
      "title": "Service Layer Pattern",
      "description": "Move business logic out of controllers into services for maintainability.",
      "entry": "quests/service-layer-pattern/meta.json",
      "recommendedWhen": ["controller-db-logic"]
    },
    {
      "questId": "input-validation",
      "title": "Validation Boundaries",
      "description": "Learn where to validate, how to structure errors, and why it matters.",
      "entry": "quests/input-validation/meta.json"
    }
  ]
}
```

Each quest is a mini-submodule with the same `lecture/coding/verify/reflection` structure.

### 8.8 `reflection/spec.json`
```json
{
  "version": 1,
  "submoduleId": "2.2-crud-create-list",
  "prompts": [
    "Where did you put validation and why?",
    "What tradeoff does a service layer introduce?",
    "What bug would you expect if you forgot to scope by userId?"
  ],
  "rubric": {
    "requiredMentions": ["validation boundary", "controller vs service responsibilities"],
    "maxWords": 180,
    "gradingStyle": "completion_and_relevance"
  },
  "personalizationInputs": [
    "userMistakesFromCheckReports",
    "hintUsage",
    "sidequestsCompleted"
  ]
}
```

---

## 9. Engine API (MVP Endpoints)

| Method | Route | Description |
|---|---|---|
| POST | `/api/course/init` | User request + template → create `.learnmode/` course spec + submodule folders/files |
| GET | `/api/tree` | Modules/submodules + status colors (locked/available/etc.) |
| GET | `/api/submodule/:id/lecture` | Read lecture files + return blocks to UI |
| POST | `/api/submodule/:id/coding/prep` | Run submodule agent in "prep mode": output patch, apply patch, generate tests, freeze |
| POST | `/api/submodule/:id/check` | Run TODO completion checks + test commands + parse failures |
| POST | `/api/submodule/:id/hint` | Input: todoId + hint level → dynamic hint |
| POST | `/api/submodule/:id/sidequest/trigger` | Run detectors, return optional quest offer |
| POST | `/api/sidequest/:questId/start` | Load quest specs, begin quest |
| POST | `/api/submodule/:id/reflection/submit` | Store reflection, return feedback |

---

## 10. State Storage (MVP)

In project root:

```
.learnmode/
  state.json                          submodule status, quiz status, patch/test freeze flags, hint usage, reflections
  generated/<submoduleId>/
    boilerplate.patch                 frozen unified diff
  tests_hidden/
    <submoduleId>/
      *.hidden.test.ts                hidden tests (frozen after first generation)
  memory/
    user_profile.md                   LLM-maintained summary of user patterns and preferences
    decisions.md                      key architecture decisions made during the course
  chat/
    <submoduleId>.json                conversation history per submodule (last N turns)
```

The `memory/` folder provides persistent LLM context across submodules (see Section 11). It is deleted when the course is complete; the course tree remains in the database.

---

## 11. LLM Context Strategy (Filesystem Memory)

The LLM does not have persistent memory between calls. Instead, the engine assembles relevant context per call from structured files:

**Per-call context injection:**
```
System: stage-specific guardrails + persona
Course context: relevant lecture section + todo spec
User state: current code in the TODO region + failing test output
Session memory: last N turns from chat/<submoduleId>.json
Long-term memory: memory/user_profile.md + memory/decisions.md
```

**`memory/user_profile.md`** — updated by LLM after each submodule:
- Learning style notes ("prefers analogies over formal definitions")
- Strong/weak concept areas
- Preferred hint level
- Vocabulary that worked

**`memory/decisions.md`** — updated when user makes architecture choices:
- Storage decisions, framework choices, skipped sections

This gives continuity across the entire course without provider-native memory (which is opaque, cross-user, and vendor-locked).

---

## 12. CLI Commands (MVP)

```
learnmode init              Create repo + start engine + generate course spec
learnmode ui                Open dashboard
learnmode check <id>        Run check for a submodule
learnmode hint <id> <todo> --level 2
learnmode doctor            Verify env (node, docker, pnpm)
```

---

## 13. Web UI (React) — Pages

| Route | Page |
|---|---|
| `/` | Project start: request text input, create course |
| `/tree` | Skill tree: colors, next action |
| `/submodule/:id` | Tabs: Lecture \| Coding \| Compare (optional) \| Reflection |

**Coding tab contains:**
- "Run Prep" (first time)
- TODO list
- "Run Check"
- Hints drawer
- Side quest popups when triggered

---

## 14. Folder Structure

```
codingpractice/
  apps/
    engine/               Node.js + TypeScript API server
    dashboard/            React frontend
    vscode-extension/     VS Code / Cursor extension (post-MVP)
  packages/
    core/                 Shared types + schema validators + file utils
    course-templates/
      todo-pro/
        template/         Starter code (with TODO regions)
        course/
          course.yaml
          submodules/<id>/
            meta.json
            lecture/
              spec.md
              spec.json
            coding/
              prep.json
              todo.json
              verify.json
            sidequests/
              index.json
              quests/<questId>/...
            reflection/
              spec.json
  infra/
    docker/
  docs/
    design.md             This file
  README.md               How we work together (daily guide)
```

---

## 15. Concrete Implementation Phases (Build Checklist)

### Phase 1: Repo skeleton
- [ ] Create monorepo: `apps/engine`, `apps/dashboard`, `packages/core`
- [ ] Define `CourseSpec` folder output format exactly as in Section 7

### Phase 2: Course-level AI generation
- [ ] Implement `course_init` pipeline: user request → generate module/submodule list + folders/files
- [ ] For MVP: hardcode 1–2 submodules to unblock system wiring, then swap in LLM

### Phase 3: Submodule agent workflows
- [ ] `submoduleAgent.run(stage, submoduleId)` for all stages:
  - lecture → read lecture specs → produce blocks for UI
  - coding_prep → read prep/todo/verify → output unified diff patch + generate tests
  - hint → read todo.json + code snippet + failing tests → return hint
  - sidequest → read trigger hooks → suggest quest
  - reflection → read reflection spec → guide response

### Phase 4: Patch application + TODO protection
- [ ] Parser to find TODO blocks by markers:
  ```
  // === LEARNMODE: TODO id=... ===
  // === END ===
  ```
- [ ] Patch application: reject modifications inside TODO regions, enforce `allowedFiles`
- [ ] Save patch to `.learnmode/generated/` and freeze

### Phase 5: Check runner
- [ ] TODO completion check
- [ ] Run test commands via child process
- [ ] Parse vitest output (file/line)
- [ ] Return structured report for UI

### Phase 6: Dashboard UI
- [ ] Tree view with statuses
- [ ] Submodule view: "Run Prep", "Run Check", show failures, hint ladder UI

### Phase 7: One side quest
- [ ] Simple trigger based on failing tests
- [ ] Mini-submodule with own coding/prep/todo/verify/reflection

---

## 16. Principles (Keep You From Ideology Drift)

1. **AI is a coach + scaffolder, not the solver**
2. **Deterministic checks decide correctness** — not LLM judgment
3. **Freeze generated artifacts** — course spec, patches, tests do not mutate mid-run
4. **Side quests are triggered by real learner behavior** — not randomly offered
5. **Progressive disclosure** — only show what's needed at the moment
