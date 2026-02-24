# AI Coding Learner Tool - 30 Day Build Plan

This project is your hands-on path to learning production software engineering by building a real product:

**An AI-based coding learner app** that teaches people how to build production software across languages, databases, deployment, and agent-style AI workflows.

Tech stack target:
- TypeScript
- React
- Node.js (Express/Fastify)
- PostgreSQL (Supabase)
- Docker
- Cloud deployment
- Kubernetes
- AI APIs + agent patterns

---

## How We Will Work (Daily)

Every day, when you ask for "today's plan", I will do 3 things:

1. **Teach concepts first**
   - Explain today's engineering principles, tradeoffs, and production practices.
2. **Code step-by-step**
   - Generate code in small chunks so you can manually re-type and understand each piece.
3. **Quiz + test + summarize**
   - Short quiz, practical checks, and summary to confirm understanding.

You are learning like LEGO:
- First understand each piece
- Then connect it to the existing system
- Repeat daily until you can build and reason about full production systems

**Target workload: approximately 3-4 hours of hands-on work per day.**
Each day should include enough concepts + code that you are meaningfully stretching — not just skimming. Code should be at least in the hundreds of unique and meaningful lines that are not just repetitive code.

---

## Product Vision (MVP -> Production)

Core product outcomes:
- User can sign in
- User can pick a learning track (Python, TypeScript, Java, etc.)
- App creates daily lessons and coding tasks with AI
- User submits answers/code
- AI reviews correctness and gives feedback
- Progress dashboard tracks concepts mastered
- Admin/analytics view tracks usage and outcomes

Production goals:
- Clean architecture
- Testing strategy
- Observability (logs/metrics/errors)
- Secure auth and data access
- CI/CD
- Containerization + orchestration

---

## Month Roadmap (High Level)

### Week 1 - Foundation + Local Product Skeleton
- Day 1: Product scope, architecture basics, monorepo setup
- Day 2: TypeScript fundamentals for backend/frontend
- Day 3: React app shell + routing + UI system
- Day 4: Node API skeleton + layered structure
- Day 5: REST API design, validation, error handling
- Day 6: PostgreSQL/Supabase schema design basics
- Day 7: Full stack "hello flow" (frontend -> backend -> DB)

### Week 2 - Core Features + Data
- Day 8: Auth fundamentals (sessions/JWT, RBAC intro)
- Day 9: User/profile/learning-track models
- Day 10: Lesson generation endpoint with AI provider abstraction
- Day 11: Submission + feedback pipeline
- Day 12: Prompt engineering + guardrails basics
- Day 13: Background jobs/queues intro
- Day 14: Integration tests for core flow

### Week 3 - Production Quality
- Day 15: Caching, rate limiting, idempotency
- Day 16: Logging, tracing, monitoring
- Day 17: Security hardening (OWASP basics)
- Day 18: Dockerize frontend + backend + DB dependencies
- Day 19: CI pipeline (lint/test/build)
- Day 20: Deployment strategy (staging vs prod)
- Day 21: Performance profiling + optimization loop

### Week 4 - Cloud + Kubernetes + Agent Patterns
- Day 22: Kubernetes core objects (Pod/Deploy/Service)
- Day 23: Config + secrets + health probes
- Day 24: Supabase in cloud workflow + migrations
- Day 25: Agentic workflows (tool use, memory, planning loops)
- Day 26: Multi-step tutor agent orchestration
- Day 27: Evaluation for AI outputs + reliability gates
- Day 28: Cost control + latency optimization
- Day 29: Final polish + docs + demo prep
- Day 30: Capstone review + retrospective + next 60-day plan

---

## Daily Session Template (What You Will Receive)

For each day I will give:

1. **Learning objectives** (what you should know by end of day)
2. **Concept lesson** (beginner-friendly explanations + production context)
3. **Build steps** (small code chunks, each explained)
4. **Manual typing checklist** (what you must type and run)
5. **Verification** (commands + expected behavior)
6. **Quiz** (concept + code comprehension)
7. **Reflection** (what felt hard + what to revise tomorrow)

**At the end of every day, create two files in `notes/dayX/`:**
- `QA.md` — every quiz question with its full answer and code examples
- `job.md` — what we built that day, explanations of all key concepts introduced, commands reference, and any bugs/lessons learned

Update the Progress Log below with a one-line summary and link to the notes folder.

---

## Ground Rules for Learning

- You manually type code (important for memory and fluency).
- You ask "why" whenever something is unclear.
- We keep architecture decisions documented.
- We incrementally refactor instead of over-designing upfront.
- **Every day includes software design reasoning** — not just "how to code it" but "why it's designed this way." This covers data modeling, interface design, tradeoffs between approaches, and production consequences of each choice.

---

## Suggested Repository Shape (We Will Build Toward This)

```txt
codingpractice/
  apps/
    web/                 # React frontend
    api/                 # Node backend
  packages/
    ui/                  # shared UI components
    config/              # eslint/tsconfig/shared configs
    types/               # shared TypeScript types
  infra/
    docker/
    k8s/
  docs/
    architecture/
  README.md
```

---

## How To Start Day 1

When ready, ask:

**"Teach me Day 1."**

Then I will provide:
- Day 1 concepts (system design basics + architecture + toolchain)
- Step-by-step code/project setup with detailed explanations
- End-of-day quiz and practical test

---

## Progress Log (We Will Fill This Daily)

- Day 1: [x] Monorepo setup, TypeScript basics, 3-tier architecture, npm workspaces, tsconfig structure. Notes: `notes/day1/`
- Day 2: [x] TypeScript fundamentals: interfaces, type aliases, literal unions, generics, unknown/any, type guards, modules, async/await, normalization. Notes: `notes/day2/`
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

