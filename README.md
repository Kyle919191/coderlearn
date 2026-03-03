# LearnMode

AI-guided IDE learning system. Full design doc: [`docs/design.md`](docs/design.md)

---

## How We Work Together (Daily)

Each day follows this structure:

1. **Concepts first** — engineering principles, production context, design reasoning behind every decision
2. **Build one step at a time** — one chunk of code at a time, fully explained before typing. Never all steps at once.
3. **Reflection** — what felt hard, what to revisit

**At the end of every day:** `notes/dayX/job.md` is created covering what we built, key concepts, design decisions, commands, and bugs learned.

**Target: ~2 hours of hands-on work per day.**

---

## Ground Rules

- Manually type all code — no copy-paste
- Ask "why" whenever anything is unclear
- Every design decision gets explained, not just the implementation
- Simple, correct, and testable over clever
- Incremental builds — no over-engineering upfront

---

## Stack

- **Engine:** Node.js + TypeScript + Express
- **Dashboard:** React + Vite + Tailwind
- **DB:** Postgres + Prisma
- **LLM:** Google Gemini API (key in `apps/engine/.env`, never committed)
- **Extension:** VS Code API (Cursor compatible)
- **Infra:** Docker Compose, Render/Fly.io

---

## 30-Day Roadmap

### Week 1 — Foundation + Engine Skeleton
- Day 1: Monorepo setup, TypeScript config ✓ (carries over)
- Day 2: TypeScript fundamentals ✓ (carries over)
- Day 3: Engine skeleton — Node/Express, course graph types, basic routes
- Day 4: Course template format — YAML/JSON schema, file parsing, content model
- Day 5: REST API — Zod validation, error handling, serve tree + content endpoints
- Day 6: File-based state persistence — `.learnmode/state.json`, state machine
- Day 7: Dashboard shell — React + routing + skill tree placeholder UI

### Week 2 — Core Learning Features
- Day 8: Lecture content serving + markdown rendering
- Day 9: Quiz system — grading, gating, state updates
- Day 10: TODO region system — markers, detection, completion checking
- Day 11: Test runner integration — run tests, parse output, structured report
- Day 12: Hints ladder — 4 levels, policy, LLM-powered (Gemini)
- Day 13: Dashboard skill tree UI — node states, dependency visualization
- Day 14: Dashboard submodule page — Learn / Quiz / Build tabs

### Week 3 — Advanced Features + Production Quality
- Day 15: Side quest system + benchmark harness
- Day 16: LLM integration — planner + hint generation with guardrails
- Day 17: VS Code extension shell — sidebar, webview, command palette
- Day 18: Extension inline features — diagnostics, CodeLens above TODO regions
- Day 19: Docker + Docker Compose for engine + dashboard + Postgres
- Day 20: Engine observability — request IDs, structured logs, health endpoint
- Day 21: CI pipeline — lint, typecheck, test on push

### Week 4 — Course Content + Ship
- Day 22: Todo Pro — Module 1 (Setup) + Module 2 (Backend Basics) content
- Day 23: Todo Pro — Module 3 (Database) + Module 4 (Frontend) content
- Day 24: Todo Pro — Module 5 (Security) + Module 6 (Deployment) content
- Day 25: Performance optimization + caching in engine
- Day 26: Security hardening
- Day 27: Deployment — Render/Fly.io + production config
- Day 28: VS Code extension polish + packaging
- Day 29: Final polish + end-to-end demo
- Day 30: Capstone retrospective + next 60-day plan

---

## Progress Log

- Day 1: [x] Monorepo, TypeScript config, npm workspaces — carries over
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
