# LearnMode — AI-Guided IDE Learning System

A production-quality learning tool that takes a user's project request, generates a skill tree, and guides them through it with mini-lectures, gated implementation, a hints ladder, and side quests — all accessible from a web dashboard and VS Code/Cursor extension.

---

## Product Vision

**What it does:**
1. User submits a project request (e.g. "build a production todo app")
2. AI planner generates a skill tree: modules → submodules
3. For each submodule: mini-lecture → quiz → gated implementation
4. AI generates boilerplate only. User must write all core logic in marked TODO regions
5. `learnmode check` runs tests + validates TODO regions + returns a structured report
6. Hints ladder: from concept reminder → pseudocode → partial skeleton (never full solution)
7. Side quests: implement an alternative approach and compare measurable tradeoffs
8. Progress is tracked. Dependencies enforce order (Duolingo-style)

**Where it runs:**
- Web dashboard (React, localhost)
- VS Code / Cursor extension (sidebar panel + inline diagnostics)
- CLI (`learnmode init`, `learnmode check`, `learnmode hint`)

**MVP template: "Todo Pro"**
- Frontend: React + Vite
- Backend: Node + Express
- DB: Postgres + Prisma
- Auth: JWT
- Deployment: Docker Compose
- Observability: structured logging + request IDs + health endpoint

---

## Architecture: Engine + Shells

```
Dashboard (React)  /  VS Code Extension  /  CLI
         ↓                   ↓               ↓
              Engine API  (Node + Express)
                      ↓
          .learnmode/  ←  course templates
          state.json       lecture.md
                           quiz.json
                           tasks.json
                           hints.json
                           tests/
```

- **Engine** (`apps/engine`): owns course graph, state, validation, test running, LLM calls. Exposes a local HTTP API.
- **Dashboard** (`apps/dashboard`): React UI — skill tree, lesson, quiz, check results, hints, side quests.
- **VS Code Extension** (`apps/vscode-extension`): sidebar tree, webview for lessons, inline diagnostics, CodeLens.
- **Core** (`packages/core`): shared TypeScript types, validators, parsers used by all packages.
- **Course Templates** (`packages/course-templates/todo-pro`): the actual learning content.

---

## Repo Structure

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
  infra/
    docker/
  docs/
    architecture/
  README.md
```

---

## How We Work (Daily)

Each day follows this structure:

1. **Concepts first** — engineering principles, production context, design reasoning
2. **Build step by step** — one chunk at a time, explained in detail before typing
3. **Reflection** — what felt hard, what to revisit

Steps are given **one at a time**. Do not move to the next step until you've typed and understood the current one.

**Target: ~2 hours of hands-on work per day.**

**At the end of every day, I will create `notes/dayX/job.md`** covering:
- What we built
- Key concepts explained
- Design decisions and why
- Commands reference
- Bugs and lessons learned

---

## Ground Rules

- Manually type all code (no copy-paste — typing builds fluency)
- Ask "why" whenever something is unclear
- We prefer simple, correct, and testable over clever
- Every design decision gets explained, not just the implementation
- We incrementally build — no over-engineering upfront

---

## 30-Day Roadmap

### Week 1 — Foundation + Engine Skeleton

- Day 1: Monorepo setup, project structure, TypeScript config ✓ (carries over)
- Day 2: TypeScript fundamentals ✓ (carries over)
- Day 3: Engine skeleton — Node/Express server, course graph types, basic routes
- Day 4: Course template format — YAML/JSON schema, file parsing, content model
- Day 5: REST API — Zod validation, error handling, serve tree + content endpoints
- Day 6: File-based state persistence — `.learnmode/state.json`, state machine rules
- Day 7: Dashboard shell — React + routing + skill tree placeholder UI

### Week 2 — Core Learning Features

- Day 8: Lecture content serving + markdown rendering in dashboard
- Day 9: Quiz system — grading logic, gating, state updates
- Day 10: TODO region system — markers, detection, completion checking
- Day 11: Test runner integration — run tests, parse output, structured report
- Day 12: Hints ladder — 4 levels, policy enforcement, LLM-powered hints
- Day 13: Dashboard skill tree UI — node states, dependency visualization
- Day 14: Dashboard submodule page — Learn / Quiz / Build tabs

### Week 3 — Advanced Features + Production Quality

- Day 15: Side quest system + benchmark harness (ORM vs raw SQL, measure latency + query count)
- Day 16: LLM integration — planner (request → tree), hint generation with guardrails
- Day 17: VS Code extension shell — sidebar panel, webview, command palette
- Day 18: Extension inline features — diagnostics, CodeLens above TODO regions
- Day 19: Docker + Docker Compose for the engine + dashboard + Postgres
- Day 20: Engine observability — request IDs, structured logs, health endpoint, telemetry file
- Day 21: CI pipeline — lint, typecheck, test on push

### Week 4 — Course Content + Polish + Ship

- Day 22: Todo Pro template — Module 1 (Setup) + Module 2 (Backend Basics) content
- Day 23: Todo Pro template — Module 3 (Database) + Module 4 (Frontend) content
- Day 24: Todo Pro template — Module 5 (Security) + Module 6 (Deployment) content
- Day 25: Performance optimization + caching in engine
- Day 26: Security hardening — auth for engine, input sanitization
- Day 27: Deployment — Render or Fly.io guide + production config
- Day 28: VS Code extension polish + packaging
- Day 29: Final polish + end-to-end demo
- Day 30: Capstone retrospective + next 60-day plan

---

## Engine API (MVP)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/project/init` | Generate skill tree from user request |
| GET | `/api/tree` | Return modules + statuses + dependencies |
| GET | `/api/submodule/:id/content` | Lecture blocks + quiz |
| POST | `/api/submodule/:id/quiz/submit` | Grade quiz + update eligibility |
| POST | `/api/submodule/:id/check` | Run tests + TODO checks → structured report |
| POST | `/api/submodule/:id/hint` | Return hint at requested level |
| POST | `/api/submodule/:id/sidequest/run` | Run benchmark + return comparison |

---

## Submodule State Machine

```
locked → available → in_progress → completed
```

A submodule becomes **completed** only when:
- Quiz passed (≥ 80%)
- All TODO regions filled
- All tests pass (public + hidden)

---

## TODO Region Format (Core Differentiator)

```typescript
// === LEARNMODE: TODO id=service_createTodo ===
// Implement createTodo(userId, input):
// - validate input
// - persist todo
// - return created todo DTO
// === END ===
```

AI may generate imports, boilerplate, route wiring, and interfaces.
AI may NOT generate code inside TODO regions.
`learnmode check` validates completion and runs tests.

---

## Progress Log

- Day 1: [x] Monorepo setup, TypeScript config, npm workspaces — carries over
- Day 2: [x] TypeScript fundamentals: interfaces, generics, modules, async/await — carries over
- Day 3: [ ]
- Day 4: [ ]
- Day 5: [ ]
- Day 6: [ ]
- Day 7: [ ]
- Day 8: [ ]
- Day 9: [ ]
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
