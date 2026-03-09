CURRENTLY UNDER DEVELOPMENT

Cuddy is a local coding buddy that helps you actually learn coding while building software in the age of AI.

While helping you build proudction-level software, Cuddy forces you to manually write important implementations with leveled hints, lectures you important software development concepts, and triggers “side quests” along the way to teach you tradeoffs behind software decisions. Building software will no longer be a job, but rather a journey that develops you into a real software engineer.

Cuddy is not just an IDE plugin, but your comrade that works with you through your entire coding journey. From a single command in the terminal, Cuddy can help you learn and replicate key implementations from other open-source software, implement your own software of choice and actually understand them, all while keeping a memory of your progress, strength, and weaknesses as a software engineer, and achievements along the way. It becomes your coding buddy for life that can give you recommendations, tests, suggestions based on your coding practices.

Each day follows this structure:

1. **teach all concepts before anything else** — engineering principles, production context, design reasoning behind every decision. There should be around 10 concepts taught, each explained in detail with examples and relevant to what's building today.
2. **then build one step at a time** — one chunk of code at a time, never all steps at once. provide detailed explanation for every single code block. There should be 5-10 steps, each step being a relatively large chunk of code or one file.
3. **Reflection** — what felt hard, what to revisit

**At the end of every day:** `notes/dayX/job.md` is created covering what we built, key concepts, design decisions, commands, and bugs learned.

**Target: enough content for ~4 hours of hands-on work per day.**

---

## Ground Rules

- User will manually type all code — don't generate code
- Every design decision gets explained, not just the implementation
- Incremental builds — no over-engineering upfront
- Explanations should be detailed, never just bullet points.

---

## Stack

- **Engine:** Node.js + TypeScript + Express
- **Dashboard:** React + Vite + Tailwind
- **DB:** Postgres + Prisma (user state/progress — Days 19+)
- **LLM:** Google Gemini API (key in `apps/engine/.env`, never committed)
- **Extension:** VS Code API (Cursor compatible)
- **Infra:** Docker Compose, Render/Fly.io

## Storage Architecture

- **MVP:** all course content and state live in local files (`.learnmode/`, `packages/course-templates/`)
- **Production:** course specs + content → object storage (S3/GCS); user state + progress → Postgres; both swappable by changing the loader/state service only

## 30-Day Roadmap

### Week 1 — Foundation + Engine Core
- Day 1: Monorepo setup, TypeScript config, npm workspaces ✓
- Day 2: TypeScript fundamentals — interfaces, generics, async/await ✓
- Day 3: Engine skeleton — Express app factory, middleware pipeline (requestId, errorHandler), course graph types, health + tree routes ✓
- Day 4: Submodule filesystem spec — `packages/core` shared types, spec file schemas (meta.json / lecture / coding / reflection), `contentLoader` service, `GET /api/submodule/:id/meta`
- Day 5: Zod validation — validate API inputs, `AppError` class, proper 400/404/500 responses, update all endpoints to use Zod
- Day 6: File-based state — `.learnmode/state.json` schema, state machine (locked → available → in_progress → completed), `stateService` read/write
- Day 7: Dashboard shell — React + Vite setup, routing (`/`, `/tree`, `/submodule/:id`), Tailwind, layout + navbar

### Week 2 — Core Learning Pipeline
- Day 8: Skill tree UI — node status colors, dependency edges, Duolingo-style layout, live data from `GET /api/tree`
- Day 9: Lecture serving — `GET /api/submodule/:id/lecture`, lecture spec → blocks, markdown rendering in dashboard
- Day 10: TODO region system — `// === LEARNMODE: TODO id=... ===` markers, file scanner, completion detector
- Day 11: Test runner — `child_process` exec, vitest output parser, structured `CheckReport`
- Day 12: Check endpoint — wire TODO checker + test runner into `POST /api/submodule/:id/check`, check results in dashboard
- Day 13: Hints system — `coding/todo.json` hint levels, level-gate policy (require failed check for L3+), `POST /api/submodule/:id/hint` (static stubs)
- Day 14: Dashboard Coding tab — Run Prep, TODO list, Run Check, results pane, hints drawer

### Week 3 — LLM Integration + Agent Workflows
- Day 15: Gemini API — `@google/generative-ai` client, structured JSON output mode, prompt scaffolding, test a basic call
- Day 16: Course planner agent — `POST /api/course/init`: user request → LLM generates full submodule spec files → write to disk → freeze with hash
- Day 17: Boilerplate prep agent — read `coding/prep.json` → LLM generates unified diff patch → apply patch safely (reject writes inside TODO regions)
- Day 18: LLM hint generation — level-constrained prompts, anti-leak rules, dynamic hints using todo.json + user code + failing test output
- Day 19: Sidequest system — `triggerHooks` (test fingerprint + AST pattern detection), `POST /api/submodule/:id/sidequest/trigger`, mini-submodule flow
- Day 20: Reflection system — `reflection/spec.json` reading, `POST /api/submodule/:id/reflection/submit`, LLM-graded personalized feedback
- Day 21: Freeze policy + memory system — hash artifacts on first generation, `memory/user_profile.md` + `decisions.md` update pipeline

### Week 4 — Deployment + Polish + Ship
- Day 22: Docker Compose — Dockerfile for engine, Dockerfile for dashboard, `docker-compose.yml` with Postgres
- Day 23: Observability — structured JSON logging (pino), `.learnmode/telemetry.jsonl`, request tracing per submodule event
- Day 24: VS Code extension shell — tree panel sidebar, CodeLens above TODO blocks, `learnmode check` command palette
- Day 25: CLI — `learnmode init`, `learnmode check`, `learnmode hint`, `learnmode doctor`
- Day 26: End-to-end integration — full flow: init → lecture → coding → check → hint → reflection, one complete submodule
- Day 27: Sidequest polish + benchmark harness — seed DB, run 50x, measure latency/query count, Compare UI
- Day 28: Security hardening — rate limiting, input sanitization, patch boundary enforcement audit
- Day 29: Final polish — error messages, loading states, responsive layout, README for public
- Day 30: Capstone retrospective + next 60-day plan

---

## Progress Log

- Day 1: [x] Monorepo, TypeScript config, npm workspaces — carries over
- Day 2: [x] TypeScript fundamentals: interfaces, generics, modules, async/await — carries over
- Day 3: [x] Engine skeleton — Express, middleware pipeline, course graph types, health + tree routes. Notes: `notes/day3/`
- Day 4: [x] Submodule filesystem spec + core types package + content loader + `/api/submodule/:id/meta`. Notes: `notes/day4/`
- Day 5: [x] Zod runtime validation + AppError pipeline + reusable validation helper + standardized 400/404/500 responses. Notes: `notes/day5/`
- Day 6: [x] File-based state persistence (`.learnmode/state.json`), state schemas, `StateService`, and status mutation endpoint (`POST /api/state/submodule/:id/status`). Notes: `notes/day6/`
- Day 7: [x] Dashboard workspace scaffolded (`apps/dashboard`) with React Router shell routes and Tailwind baseline styling. Notes: `notes/day7/`
- Day 8: [x] Skill Tree page connected to live engine data (`GET /api/tree`), with loading/error/success states, status badges, and submodule navigation links. Notes: `notes/day8/`
- Day 9: [x] Lecture serving wired end-to-end: engine `/api/submodule/:id/lecture` endpoint + dashboard `SubmodulePage` fetch lifecycle and block rendering. Notes: `notes/day9/`
- Day 10: [ ]
- Day 11: [ ]
- Day 12: [ ]
- Day 13: [ ]
- Day 14: [ ]
- Day 15: [ ]
- Day 16: [ ]
- Day 17: [ ]
- Day 18: [ ]
- Day 19: [ ]
- Day 20: [ ]
- Day 21: [ ]
- Day 22: [ ]
- Day 23: [ ]
- Day 24: [ ]
- Day 25: [ ]
- Day 26: [ ]
- Day 27: [ ]
- Day 28: [ ]
- Day 29: [ ]
- Day 30: [ ]
