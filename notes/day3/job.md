# Day 3 — Engine Skeleton: Node/Express, Course Graph Types, Middleware, Routes

---

## What We Built

The LearnMode engine — a Node.js + Express HTTP server that is the backbone all other components (dashboard, VS Code extension, CLI) talk to.

**Files created:**
```
apps/engine/
  src/
    types/
      course.ts           Core domain types: CourseTree, Module, Submodule, CheckReport, etc.
    middleware/
      requestId.ts        Stamps every request with a unique UUID
      errorHandler.ts     Catches all thrown errors, returns clean JSON responses
    routes/
      health.ts           GET /health — server status, uptime, timestamp
      tree.ts             GET /api/tree — returns full mock course tree
    app.ts                Wires middleware + routes into Express app (no port binding)
    index.ts              Loads .env, creates app, starts server on PORT
  package.json            @learnmode/engine workspace config
  tsconfig.json           Extends base, outputs to dist/
```

**Verified working:**
- `GET /health` → `{ status: "ok", service: "learnmode-engine", timestamp, uptime }`
- `GET /api/tree` → full course tree with 3 modules, 10 submodules, dependency chains

---

## Key Concept: What is Express?

Node.js can handle HTTP natively but requires manually parsing URLs, methods, headers, and bodies. Express wraps Node's raw HTTP with three things:

1. **Routing** — `router.get("/path", handler)` instead of `if (req.url === "/path")`
2. **Middleware pipeline** — register functions once, they run on every request automatically
3. **Extended req/res** — adds `res.json()`, `req.body`, `req.params`, etc. to raw Node objects

Express is deliberately minimal — it doesn't decide your database, auth, or folder structure. You provide those through TypeScript types and architecture.

---

## Key Concept: Middleware

A function that runs on every request before the route handler:

```typescript
function myMiddleware(req: Request, res: Response, next: NextFunction): void {
  // do cross-cutting work
  next(); // pass to next middleware or route
}
```

**Pipeline — order is the architecture:**
```
request → [cors] → [express.json] → [requestId] → [route handler] → response
                                                        ↓ (if error)
                                                   [errorHandler]
```

**Middle-of-pipeline:** does work, calls `next()`, never sends response
**End-of-pipeline:** calls `res.json()` / `res.send()`, never calls `next()`

Calling both `res.json()` AND `next()` causes "Cannot set headers after they are sent" crash.

---

## Key Concept: Routes vs Middleware

| | Middleware | Route |
|---|---|---|
| When it runs | Every request | Only when method + path match |
| Registered with | `app.use(fn)` | `router.get("/path", fn)` |
| Calls `next()` | Yes (middle) or No (end) | No — sends response |
| Purpose | Cross-cutting (CORS, parsing, auth, IDs) | Specific business logic |

Both have identical signatures: `(req, res, next) => void`

---

## Key Concept: `app.ts` vs `index.ts` Separation

- **`app.ts`** — creates and configures the Express app (middleware, routes). Does NOT bind to a port.
- **`index.ts`** — loads `.env`, creates the app, calls `app.listen(PORT)`.

Why: tests import `createApp()` from `app.ts` without starting a real server on a port. If you mixed them, every test file would bind to port 3000.

---

## Key Concept: Route Mounting with `app.use()`

```typescript
app.use("/health",    healthRouter);    // all routes in health.ts get /health prefix
app.use("/api/tree",  treeRouter);      // all routes in tree.ts get /api/tree prefix
```

The router file defines paths relative to its mount point. `router.get("/")` in `health.ts` becomes `GET /health` because it's mounted at `/health`.

**Order matters:** Express matches routes top-to-bottom. Specific paths go before general ones. A catch-all `app.use("/api", ...)` placed before `app.use("/api/tree", ...)` would shadow the tree router.

---

## Key Concept: `/health` vs `/api/*` separation

- `/health` — infrastructure endpoint. Consumed by Docker healthchecks, Kubernetes probes, uptime monitors. Must stay public (no auth required).
- `/api/*` — product API. Consumed by dashboard, VS Code extension, CLI. Will require auth on Day 26.

Keeping them at different prefixes lets you apply different middleware rules to each group without touching individual routes.

---

## Key Concept: `dotenv` Load Order

```typescript
import "dotenv/config";   // MUST be first — before any other import that reads process.env
import { createApp } from "./app";
```

`process.env` values are populated by `dotenv` as a side effect of this import. Any import above it that reads `process.env` will see `undefined`. This is the most common `dotenv` bug.

---

## Key Concept: Error Handler Signature

```typescript
// 4 parameters = Express treats this as error handler, not regular middleware
function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction): void
```

Express identifies error handlers purely by parameter count. 3 params = regular middleware. 4 params = error handler. The `next` parameter must be declared even if never called — without it, errors are never routed here.

---

## Key Concept: Course Graph Types

The TypeScript types in `course.ts` model the entire skill tree:

```
CourseTree
  └── Module[]
        └── Submodule[]
              ├── status: "locked" | "available" | "in_progress" | "completed"
              └── dependsOn: string[]   ← IDs of submodules that must be completed first
```

`dependsOn` enforces the Duolingo-style learning order. A submodule becomes `available` only when all its dependencies are `completed`. The engine enforces this on Day 6 (state machine). The types enforce it at compile time right now — any object that doesn't match the shape is rejected by TypeScript.

`CheckReport`, `TodoRegionResult`, `TestResult`, `HintRequest`, `HintResponse` are also defined here — ahead of the features that use them. This is intentional: defining types before implementation means routes and handlers can be written with correct signatures from day one.

---

## Bugs / Lessons Learned

- Mounted health router at `/api/health` instead of `/health` — visited the wrong URL. Fix: check `app.ts` mount points when a route 404s. The route file is almost never wrong; the mount point usually is.
- `cors()` is a factory (call it: `app.use(cors())`). `requestId` is already a function (pass it: `app.use(requestId)`). Calling a function instead of passing it, or passing instead of calling, is a common early Express mistake.

---

## Commands Reference

```bash
npm install                      # install all workspace deps from root
npm run dev:engine               # start engine with hot reload (ts-node-dev)
# then visit:
# http://localhost:3000/health
# http://localhost:3000/api/tree
```
