# LearnMode — Full Design Document

---

## 0. Summary

Build a "Learning Mode" system that takes a user's project request (e.g., "todo web app"), generates a module/submodule skill tree, and guides the user through:

- Mini-lectures + quizzes
- Implementation gates where AI can only generate boilerplate, while the user must write core logic
- Hints ladder (small → big)
- Side quests that compare approaches (tradeoffs, design styles, performance, observability)

The product works:
- Inside IDEs (VS Code first; compatible with Cursor/Claude Code via VS Code extension + CLI)
- With a web dashboard (nice UI, IDE-agnostic)

MVP focuses on one project journey (template): Node/Express API + Postgres + React deployed with a standard production baseline.

---

## 1. LLM Role (Gemini)

Gemini is the backbone of the entire product. It is responsible for:

| Feature | LLM Task |
|---|---|
| Planner | Convert user project request → module/submodule skill tree |
| Lecture generation | Write mini-lecture content for each submodule |
| Boilerplate generation | Generate scaffold code with TODO regions (allowed zones only) |
| Hint generation | Produce level-constrained hints (never full solution) |
| User code verification | Review user's TODO region code against spec + failing tests |
| Side quest explanations | Explain the tradeoff, guide the comparison |
| Side quest coding | Assist with implementing the alternative approach |
| Quiz generation | (Optional MVP+) Generate MCQ questions from lecture content |

**Guardrails (important):**
- Hints prompt is strictly constrained by level: L1 = concept reminder only, L4 = one function outline maximum
- Boilerplate generation prompt forbids generating inside TODO regions
- Verification prompt produces structured feedback only — no full solution reveal
- All prompts include a system instruction: "Do not output complete solutions to TODO regions"

**LLM tech:**
- Provider: Google Gemini API
- Key stored in: `apps/engine/.env` as `GEMINI_API_KEY`
- Never committed to Git

---

## 2. Goals and Non-Goals

**Goals (MVP):**
- Convert user request → progressable skill tree (modules/submodules)
- For each submodule: lecture → quiz → gated implementation
- AI boilerplate allowed, core logic required from user
- Check mechanism: tests passing + required TODO regions filled
- Hints ladder that never reveals the whole solution
- At least one side quest with measurable tradeoff (e.g., ORM vs raw SQL)
- Web dashboard UI
- IDE integration via CLI engine and VS Code extension

**Non-goals (MVP):**
- Building a full IDE
- Perfect "cheat detection"
- Supporting many templates at once
- Running untrusted code in the cloud (local execution only)

---

## 3. User Experience Flow

### Main Journey

1. **User request** — "Build a production-ready todo app with auth, db, deployment."
2. **Planner generates a tree** — Modules (Backend, Frontend, Database, Deployment, Security, Observability), each with submodules
3. **Progress UI** — Node states: Locked (gray) / Available (blue) / In-progress (yellow) / Completed (green). Dependencies enforce order.
4. **For each submodule:**
   - Mini-lecture (2–6 min, AI-generated)
   - Quiz (5–8 items, must pass ≥ 80%)
   - Implementation gate: AI generates boilerplate, user writes core logic in TODO regions
   - Check results: red highlights for failing tests/regions + file/line links
   - Hints: L1 concept reminder → L2 pseudocode → L3 skeleton with blanks → L4 one function outline
5. **Side quests** — one for each submodule: implement alternative approach/compare tradeoffs/explore relevant system design principles/visualize efficiency with scripts

---

## 4. Product Shape: Engine + Shells

### Components

**A) Core Engine (Node.js)**
- Owns: course graph, state, validation, tests, hint policy, LLM calls
- Exposes a local HTTP API consumed by all UI shells

**B) Web Dashboard (React)**
- Renders skill tree + lesson + quiz + check output + hints + side quests
- Talks to engine via HTTP on localhost

**C) IDE Shell (VS Code Extension)**
- Shows skill tree panel + lesson webview
- Adds inline diagnostics (red squiggles, code lenses)
- Calls the same engine API on localhost
- Works in Cursor (VS Code-based)

**D) CLI**
- `learnmode init`, `learnmode check`, `learnmode hint`
- Calls engine, or engine spawns as daemon automatically

### Why this architecture
- Logic lives in one place (the engine)
- Ship web UI fast, build IDE delight later
- Compatible with any editor via CLI + dashboard

---

## 5. MVP Scope: "Todo Pro" Template

### Stack
- Frontend: React + Vite
- Backend: Node + Express
- DB: Postgres + Prisma
- Auth: JWT
- Deployment: Docker Compose (local), optional Render/Fly.io guide
- Observability: structured logging + request IDs + basic metrics endpoint

### Example Module Tree

**Module 1: Setup**
- 1.1 Repo scaffold (monorepo folders)
- 1.2 Run dev servers
- 1.3 Environment variables

**Module 2: Backend Basics**
- 2.1 Express routes + controllers
- 2.2 Validation (Zod) + error handling
- 2.3 Service layer pattern
- 2.4 Tests for API endpoints (Vitest + supertest)

**Module 3: Database**
- 3.1 Schema design + migrations (Prisma)
- 3.2 CRUD persistence functions
- 3.3 Side quest: ORM vs raw SQL (measure query count/latency)

**Module 4: Frontend**
- 4.1 API client + typed DTOs
- 4.2 State management (hooks)
- 4.3 UI forms + validation
- 4.4 Frontend tests (minimal)

**Module 5: Security Baseline**
- 5.1 JWT auth + password hashing
- 5.2 Authorization checks (owner-only)
- 5.3 Side quest: session-based auth tradeoff (conceptual + optional)

**Module 6: Deployment & Ops**
- 6.1 Dockerize backend/frontend
- 6.2 Docker Compose with Postgres
- 6.3 Observability: logging + request IDs + healthcheck

---

## 6. Learning Content Model

Each submodule includes:
```
submodules/<id>/
  lecture.md        AI-generated mini-lecture
  quiz.json         MCQ questions + answers
  tasks.json        Gated implementation specs
  checks.json       Tests + constraints
  hints.json        Hint ladder content
  sidequests/       Optional alternative approach
```

---

## 7. Gated Implementation System (Core Differentiator)

### TODO Regions

```typescript
// === LEARNMODE: TODO id=service_createTodo ===
// Implement createTodo(userId, input):
// - validate input
// - persist todo
// - return created todo DTO
// === END ===
```

### What AI is allowed to generate
- **Allowed:** imports, boilerplate file setup, route wiring, DTO interfaces
- **Disallowed:** code inside TODO regions

### Validation (`learnmode check <submodule>`)
Runs:
1. Region completion check (TODO blocks replaced with code)
2. Linter/typecheck
3. Unit tests
4. Hidden tests (stored in `.learnmode/tests_hidden/`)

Returns structured report: failing tests, failing regions, stack traces, file/line mapping

---

## 8. Hints Ladder

| Level | Content |
|---|---|
| L1 | Concept reminder ("What layer should own this responsibility?") |
| L2 | Pseudocode steps |
| L3 | Skeleton with blanks |
| L4 | One function outline — key lines still missing |

**Policy:** Require at least one failed check before allowing L3/L4.

---

## 9. Side Quests System

### Types
- Alternative implementation (ORM vs raw SQL)
- Design style refactor (controller logic → service layer)
- Performance measurement (cache vs no cache)
- Observability (add request ID, structured logs)
- System design mini (pagination, rate limiting, background job concept)

### Benchmark harness (MVP)
- Seed DB with N records
- Run endpoint 50 times (10 warmup)
- Report: median latency, p95 latency, query count per request, response payload bytes
- Dashboard shows "Approach A vs B" table/chart

---

## 10. Engine Design

### Responsibilities
- Parse course template / generate plan from LLM
- Maintain progress state
- Serve content (lecture/quiz)
- Run checks/tests + parse results
- Provide hint text (LLM-powered)
- Provide benchmarking results

### Tech
- Node.js + TypeScript
- Express API server
- File-based persistence in `.learnmode/state.json` (MVP)
- LLM: Gemini API

### API

| Method | Route | Description |
|---|---|---|
| POST | `/api/project/init` | Generate skill tree from user request |
| GET | `/api/tree` | Return modules + statuses + dependencies |
| GET | `/api/submodule/:id/content` | Lecture blocks + quiz |
| POST | `/api/submodule/:id/quiz/submit` | Grade quiz + update eligibility |
| POST | `/api/submodule/:id/check` | Run tests + TODO checks → structured report |
| POST | `/api/submodule/:id/hint` | Return hint at requested level |
| POST | `/api/submodule/:id/sidequest/run` | Run benchmark + return comparison |

### State Machine
```
locked → available → in_progress → completed
```
Completed only when: quiz passed (≥80%) + TODO regions filled + all tests pass

---

## 11. Dashboard UI (React)

### Screens
1. **Project start** — user request input, choose template, generate plan
2. **Skill tree** — collapsible modules, node color states, Start/Resume per submodule
3. **Submodule page** — tabs: Learn / Quiz / Build / Compare
4. **Build tab** — TODO tasks list, Run Check button, results pane (failing tests, file/line links)
5. **Hints drawer** — level buttons, "show next hint" gating
6. **Compare tab** — run benchmark, show results + explanation

### UX priorities
- Always show "Next action" prominently ("Fix 2 failing tests", "Implement createTodo")
- Keep lectures short and interactive
- Make progress feel rewarding

---

## 12. VS Code Extension

### Features
- Sidebar panel: tree + submodule statuses
- Webview panel: lecture/quiz/build result UI
- Command palette: Start submodule, Run check, Get hint
- Inline diagnostics: mark TODO regions incomplete, test failure references
- CodeLens above TODO regions: "Get hint" / "Run check"

### Cursor / Claude Code compatibility
Not overriding their assistants. Winning by gating progress on checks and TODO completion.

---

## 13. Observability for the Product Itself

Engine logs:
- Request ID, route, duration
- Submodule events: quiz pass/fail, check pass/fail, hint usage

Local analytics file: `.learnmode/telemetry.jsonl` (opt-in)

---

## 14. Folder Structure

```
codingpractice/
  apps/
    engine/               Node.js + TypeScript API server
    dashboard/            React frontend
    vscode-extension/     VS Code / Cursor extension
  packages/
    core/                 Shared types + validators
    course-templates/
      todo-pro/           MVP course content + template code
        template/         Actual starter code (with TODO regions)
        course/
          course.yaml
          submodules/<id>/
            lecture.md
            quiz.json
            tasks.json
            hints.json
          tests_public/
          tests_hidden/
          benchmarks/
  infra/
    docker/
  docs/
    design.md             This file
  README.md               How we work together (daily guide)
```

---

## 15. MVP Milestones

1. Engine skeleton + template init (CLI: `learnmode init`, `/tree`, `/content`, file-based state)
2. Lecture + quiz (grading logic, gating)
3. Gated TODO regions + check runner (TODO detection, test runner, structured report)
4. Hints ladder (level policy, LLM-powered hints)
5. Dashboard UI (tree view + submodule page + check results)
6. One side quest with measurement (benchmark harness + compare UI)
7. VS Code extension shell (tree, run check, diagnostics)

