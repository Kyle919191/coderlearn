# Day 4 — Submodule Filesystem Spec + Content Loader

---

## What We Built

Today we moved from only mock tree data to a real filesystem-based content model for submodules.

### 1) Shared core package for spec contracts
Created `packages/core` and defined canonical spec types in:
- `packages/core/src/types/specs.ts`
- `packages/core/src/index.ts`

Key additions:
- `SubmoduleMeta`, `LectureSpec`, `CodingTodoJson`, `CodingVerifyJson`, `ReflectionSpec`
- Added missing `CodingPrepJson` + `BoilerplatePlan` + prep action types
- Shared `SubmoduleStatus` is now sourced from `@learnmode/core`

### 2) Real submodule spec files for `2.2-crud-create-list`
Added concrete spec content under:
- `packages/course-templates/todo-pro/course/submodules/2.2-crud-create-list/`
  - `meta.json`
  - `lecture/spec.md`
  - `lecture/spec.json`
  - `coding/prep.json`
  - `coding/todo.json`
  - `coding/verify.json`
  - `reflection/spec.json`

This is the first real implementation of the design doc's canonical submodule filesystem format.

### 3) Engine content loading service
Added:
- `apps/engine/src/services/contentLoader.ts`

What it does:
- Reads spec files from disk using `fs/promises`
- Builds safe paths with `path.join`
- Parses JSON into typed objects
- Converts missing files (`ENOENT`) into a domain error: `ContentNotFoundError`

### 4) New API route for submodule meta
Added:
- `apps/engine/src/routes/submodule.ts`
- Mounted in `apps/engine/src/app.ts` as `/api/submodule`

Endpoint now available:
- `GET /api/submodule/:id/meta`

---

## Key Concepts Learned

### `spec` types vs API result types
- `packages/core/src/types/specs.ts` = file contracts on disk (source-of-truth content spec)
- `apps/engine/src/types/course.ts` = API/runtime result contracts (tree/check/hint response)

These are complementary, not duplicates.

### Why `ContentLoader` exists
Centralizing file reads in one service makes it easy to:
- swap storage later (object storage/database-backed adapters)
- keep route handlers thin
- standardize error behavior and path resolution

### Why catch `ENOENT`
`ENOENT` means the file/submodule is missing. We map that to a clean app-level error so routes can return a proper 404 instead of a raw Node error.

---

## Commands/Verification

- Installed and linked workspace package:
  - `npm install`
  - `npm install @learnmode/core --workspace=apps/engine`
- Ran engine dev server and validated route mounting
- Found and fixed typo in route mount path:
  - `/api/subomodule` -> `/api/submodule`

---

## Bugs Fixed During Build

1. Variable mismatch in `readJson` catch block (`err` vs `error`) -> corrected
2. Wrong loader path for todo spec (`coding/spec.json`) -> corrected to `coding/todo.json`
3. Missing `coding/prep.json` file for submodule -> created
4. Route mount typo (`subomodule`) -> corrected

---

## Day 4 Outcome

We now have the first real bridge from design spec to runtime engine behavior:
- canonical submodule content files exist,
- engine can load them via a dedicated service,
- and API surface has started exposing spec-backed endpoints.

Next immediate step is to expand the submodule API beyond `meta` (lecture and coding spec endpoints), then add input validation and consistent error mapping.
