# Day 5 — Zod Validation + AppError Pipeline + Consistent Error Contracts

---

## What We Built

Today we implemented runtime validation and standardized error handling for the engine API.

### 1) Runtime request schemas (Zod)
Added schema files:
- `apps/engine/src/schemas/submoduleSchemas.ts`
- `apps/engine/src/schemas/treeSchemas.ts`

What these validate:
- `submoduleId` path param for `/api/submodule/:id/meta`
- `includeLocked` query param for `/api/tree?includeLocked=true|false`

### 2) App-level error model
Added:
- `apps/engine/src/errors/AppError.ts`

Defines:
- canonical app error codes (`VALIDATION_ERROR`, `CONTENT_NOT_FOUND`, `INTERNAL_ERROR`)
- `AppError` class with status code, machine code, message, optional details
- type guard `isAppError(...)`

### 3) Centralized error normalization in middleware
Updated:
- `apps/engine/src/middleware/errorHandler.ts`

Now behavior is:
- Known `AppError` -> respond with exact `statusCode` + structured envelope
- Unknown error -> respond with `500` + `INTERNAL_ERROR`
- All responses include `requestId`

### 4) Reusable validation helper
Added:
- `apps/engine/src/utils/validate.ts`

`validateOrThrow(schema, input, message)`:
- parses/validates using Zod
- maps `ZodError` to `AppError(400, VALIDATION_ERROR, ...)`
- keeps route files clean and consistent

### 5) Route refactors to use helper + domain mapping
Updated routes:
- `apps/engine/src/routes/tree.ts`
- `apps/engine/src/routes/submodule.ts`

Pattern now:
1. validate input using `validateOrThrow(...)`
2. run route logic
3. map route-specific domain errors (e.g., `ContentNotFoundError` -> 404 `AppError`)
4. pass everything to centralized `errorHandler`

---

## Key Concepts Learned

1. TypeScript types are compile-time only; runtime input still needs validation
2. API boundaries are trust boundaries (`params`, `query`, `body` are untrusted)
3. Zod schemas are executable contracts (runtime + inferred TS types)
4. Error taxonomy matters (`400` vs `404` vs `500`)
5. Error mapping strategy: library/domain errors -> app-level `AppError`
6. Centralized error middleware keeps response shape consistent
7. Generic validation helper reduces duplicate route code
8. `next(error)` escalates to middleware pipeline rather than responding in-place
9. Deterministic contracts now support upcoming state/check systems
10. Consistent `requestId` threading makes debugging and logs production-ready

---

## Verification

Checked live endpoints:

- `GET /api/tree?includeLocked=true` -> `200 OK`
- `GET /api/tree?includeLocked=maybe` -> `400 VALIDATION_ERROR` with Zod issue details
- `GET /api/submodule/does-not-exist/meta` -> `404 CONTENT_NOT_FOUND`

All responses returned stable envelope with `error.code`, `message`, and `requestId` for failures.

---

## Bugs/Issues Fixed During Day 5

1. Generic return-type mismatch in `validateOrThrow` (`ReturnType<TSchema["parse"]>` incompatibility)
   - Fixed by using `z.output<TSchema>` return type
2. Removed duplicated inline Zod/AppError handling from routes
3. Preserved route-specific domain mapping while centralizing response formatting

---

## Day 5 Outcome

The engine now has production-style API boundary safety:
- validated request contracts,
- deterministic error classification,
- centralized structured error responses,
- and reusable validation utilities for future routes.

This is the foundation needed for Day 6 state persistence and all later check/hint/reflection endpoints.
