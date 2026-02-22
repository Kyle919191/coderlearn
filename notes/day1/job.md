# Day 1 — What We Built and Key Concepts

---

## What We Did Today

Set up the entire project skeleton from scratch:

1. Created a **monorepo** at `codingpractice/` using npm workspaces
2. Wrote a shared `tsconfig.base.json` for TypeScript compiler configuration
3. Created `apps/api/` as the first workspace (the backend app)
4. Wrote the first TypeScript source file `apps/api/src/index.ts`
5. Ran the code with `npm run dev:api` (ts-node path)
6. Compiled the code with `npm run build` (tsc path) and ran the output with `node dist/index.js`
7. Debugged a real workspace error caused by a typo (`apps?*` instead of `apps/*`)

**Files created:**
```
codingpractice/
  apps/
    api/
      src/index.ts        ← TypeScript entry point
      dist/               ← compiled output (auto-generated)
      package.json        ← api workspace config
      tsconfig.json       ← api compiler wiring
  package.json            ← monorepo root + workspaces
  tsconfig.base.json      ← shared compiler rules
  .gitignore
  README.md
```

---

## Key Concept: `tsconfig.base.json` vs `apps/api/tsconfig.json`

These two files work as a pair:

**`tsconfig.base.json` (root) — compiler personality (the HOW)**
- Defines what the TypeScript compiler does and how it behaves
- Rules like: `strict: true`, `target: ES2022`, `module: commonjs`
- Has no idea where your files are — purely behavioral
- Shared by every app in the monorepo via `"extends"`

**`apps/api/tsconfig.json` — compiler wiring (the WHERE)**
- Defines what files the compiler acts on and where output goes
- `rootDir: src` → look for `.ts` files in the `src/` folder
- `outDir: dist` → write compiled `.js` files to `dist/`
- `include: ["src/**/*"]` → only compile files inside `src/`
- Does `"extends": "../../tsconfig.base.json"` to inherit all the rules

Mental model: the base config is the **rules of the compiler**, the app config is the **inputs and outputs of the compiler**. Every app can have different folders while sharing the same rules.

---

## Key Concept: Root `package.json` vs `apps/api/package.json`

These two files serve different purposes in a monorepo:

**Root `package.json` — monorepo orchestration**
```json
{
  "name": "ai-coding-learner",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:api": "npm run dev --workspace=apps/api"
  }
}
```
- `"private": true` → prevents accidental publish to npm
- `"workspaces"` → tells npm to treat every folder in `apps/` and `packages/` as a sub-package and share one `node_modules/`
- Scripts here are **cross-workspace convenience commands** (run from the root)

**`apps/api/package.json` — individual app config**
```json
{
  "name": "@aicl/api",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "devDependencies": { ... }
}
```
- `"name": "@aicl/api"` → scoped name under the `@aicl` org namespace (production convention)
- Scripts here are specific to the API app
- `devDependencies` → packages only needed for development (TypeScript compiler, ts-node, type definitions)

---

## Key Concept: `dependencies` vs `devDependencies`

| | `dependencies` | `devDependencies` |
|---|---|---|
| When installed | Always (dev + prod) | Dev only |
| Examples | `express`, `pg` (postgres driver) | `typescript`, `ts-node`, `eslint` |
| Why it matters | Production server needs these to run | Production server runs compiled JS — doesn't need the compiler |

In production deployments (`npm install --omit=dev`), only `dependencies` are installed. This makes production images smaller and faster.

---

## Key Concept: The Two Ways to Run TypeScript

```
DEV PATH:   index.ts  →  ts-node  →  runs in memory (no files written)
PROD PATH:  index.ts  →  tsc  →  dist/index.js  →  node dist/index.js
```

- **`ts-node`**: compiles on the fly, no disk output. Great for rapid development. Too slow for production (compiles every startup).
- **`tsc` + `node`**: compile once, run the output forever. What production servers actually do.

---

## Key Concept: npm Workspaces and the `--workspace` Flag

Running `npm run dev --workspace=apps/api` from the **root** tells npm: "go into the `apps/api` workspace and run its `dev` script." This is how monorepos let you operate on individual apps without `cd`-ing into them.

Important: workspace scripts (`dev:api`) only exist in the root `package.json`. If you `cd apps/api` and try to run `npm run dev:api`, it fails — that script doesn't exist there.

---

## Real Bug We Hit Today

**Error:** `npm error No workspaces found: --workspace=apps/api`

**Cause:** Typo in root `package.json`:
```json
"apps?*"    ← wrong (? is not a path separator)
"apps/*"    ← correct (* glob matches all folders inside apps/)
```

**Fix:** Corrected the typo, re-ran `npm install` to re-register workspaces, then `npm run dev:api` worked.

**Lesson:** npm uses glob patterns for workspaces. A single wrong character can make the entire workspace invisible to npm. Always re-run `npm install` after changing `package.json`.

---

## Commands Reference

```bash
npm install                          # install all workspace dependencies
npm run dev:api                      # run api in dev mode (from root)
cd apps/api && npm run build         # compile TypeScript to dist/
node apps/api/dist/index.js          # run compiled output
mkdir -p apps/api/src                # create nested directories in one command
```
