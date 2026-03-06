# Day 6 — File-Based State Persistence + State Update Endpoint

---

## What We Built

Today we implemented the first real state persistence layer for LearnMode and added a mutation endpoint that updates submodule progress.

### 1) Shared state contract in core package
Added state model in:
- `packages/core/src/types/state.ts`
- exported from `packages/core/src/index.ts`

New core interfaces:
- `SubmoduleProgress`
- `LearnModeState`

This defines the canonical shape of persisted runtime progress.

### 2) Runtime schema validation for state files
Added:
- `apps/engine/src/schemas/stateSchemas.ts`

New schemas:
- `submoduleStatusSchema`
- `submoduleProgressSchema`
- `learnModeStateSchema`
- `updateSubmoduleStatusBodySchema`

Purpose:
- validate `.learnmode/state.json` at read/write time
- validate POST body for status updates

### 3) State service for read/init/write/update
Added:
- `apps/engine/src/services/stateService.ts`

Capabilities:
- `ensureInitialized(projectId, templateId)` bootstrap-on-first-run
- `readState()` with JSON parse + schema validation
- `writeState(state)` with directory creation + validated write
- `updateState(updater)` read-modify-write helper

Important path decision:
- state is stored at repo root: `.learnmode/state.json`
- not under `apps/engine/.learnmode`

### 4) State route endpoints
Added/updated:
- `apps/engine/src/routes/state.ts`
- mounted in `apps/engine/src/app.ts` as `/api/state`

Endpoints now:
- `GET /api/state` — initialize/read current state
- `POST /api/state/submodule/:id/status` — update one submodule status

---

## Verification Results

Executed live checks:

1. `GET /api/state`
   - returns initialized state JSON
   - confirmed file exists at `codingpractice/.learnmode/state.json`

2. `POST /api/state/submodule/2.2-crud-create-list/status` with
   `{"status":"in_progress"}`
   - returns updated submodule progress row

3. `GET /api/state` again
   - confirms status persisted as `in_progress`

---

## Key Concepts Learned

1. **State vs content split**
   - content/spec files (`packages/course-templates`) are static
   - state file (`.learnmode/state.json`) is dynamic runtime progress

2. **Compile-time type vs runtime schema**
   - `LearnModeState` type is for TS annotations
   - `learnModeStateSchema` enforces runtime safety

3. **State machine persistence**
   - statuses are constrained to legal values
   - state survives process restarts

4. **Callback updater pattern**
   - `updateState((current) => next)` receives current snapshot from service
   - returns next immutable state object

5. **API design: resource id in params, update payload in body**
   - `:id` identifies which submodule
   - body (`status`) describes what to change

---

## Bugs/Issues Caught and Fixed

1. State path initially resolved under app workspace due to `process.cwd()` behavior
   - fixed by switching to `__dirname`-based repo-root path

2. Verified state file location and persistence with real endpoint calls

---

## Day 6 Outcome

LearnMode now has persistent runtime progress with validated file storage and its first mutation endpoint. This unblocks next stages where checks/hints/reflections must update learner state deterministically.
