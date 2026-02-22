# Day 1 — Quiz Q&A

---

## Q1: What are the 3 tiers of a web application and what does each one do?

**A:**
- **Frontend** (React): The UI running in the user's browser. Lets the user interact, triggers HTTP requests, and renders responses. Does NOT touch the database directly.
- **Backend** (Node.js): An HTTP server. Receives requests from the frontend, applies business logic and security rules, then talks to the database.
- **Database** (PostgreSQL): Persistent storage. Data lives here even if the backend crashes or restarts. Only the backend connects to it — never the frontend.

---

## Q2: Why does the frontend NOT directly access the database?

**A:** Three reasons:
1. **Credentials would be exposed.** Database passwords in the browser = anyone can connect and read/delete all data.
2. **No way to enforce business rules.** "A user can only see their own lessons" is logic that lives in the backend. The database has no concept of users or permissions at that level.
3. **No protection against abuse.** The backend is the security checkpoint. The database is the vault. Customers never get direct vault access.

Rule: **the database is never exposed to the internet.** It only accepts connections from backend servers on the same private network.

---

## Q3: What is the difference between `dependencies` and `devDependencies`?

**A:**
- `dependencies`: packages the app **needs to run** in production. Example: `express` (the HTTP server).
- `devDependencies`: packages only needed **during development**. Example: `typescript` (the compiler). In production, the server runs compiled `.js` files — TypeScript is no longer needed.

Analogy: a carpenter needs a saw (TypeScript, dev tool) to build a chair (Express app, the thing that ships). You ship the chair, not the saw.

---

## Q4: What does `strict: true` do in tsconfig and why does it matter in production?

**A:** It enables 8 strict compiler checks at once. The two most critical:
- **`strictNullChecks`**: You cannot use a value that might be `null` or `undefined` without checking it first. Without this, your app silently compiles and crashes at runtime when a real user hits that code path.
- **`noImplicitAny`**: Every variable must have a known type — no accidental `any` that disables type checking.

In production, `strict: true` is non-negotiable. Catching bugs at compile time (at your desk) is always better than catching them at runtime (2am, real users affected).

---

## Q5: What is the `??` operator? How is it different from `||`?

**A:** The **nullish coalescing operator**. Returns the right side only if the left side is `null` or `undefined`.

```typescript
process.env.PORT ?? "3000"   // uses "3000" only if PORT is undefined
```

Different from `||` (logical OR):
```typescript
0 || "3000"    // gives "3000" — WRONG if 0 is a valid value (it's falsy)
0 ?? "3000"    // gives 0     — correct, 0 is not null/undefined
```

Use `??` when you want a default only for truly absent values, not for falsy ones like `0`, `false`, or `""`.

---

## Q6: If you wrote `const appName: string = 42`, what happens and when?

**A:** TypeScript compiler error at **compile time** — before any code runs.
```
Type 'number' is not assignable to type 'string'
```
This is the core value of TypeScript: bugs caught at your desk, not in production.

---

## Q7: What is the difference between `npm run dev` (ts-node) and `npm run start` (node)?

**A:**
- **`ts-node src/index.ts`** (dev): compiles and runs TypeScript in memory in one step. No files written to disk. Slower startup but fast iteration loop. Use during development.
- **`tsc` then `node dist/index.js`** (prod): `tsc` compiles `.ts` → `.js` files in `dist/`. Then `node` runs plain JavaScript — fast, no compilation overhead. Use in production.

`node` itself never compiles anything. It only runs already-compiled `.js` files.

---

## Q8: Why do we have two tsconfig files?

**A:**
- `tsconfig.base.json` (root): defines **compiler behavior** — rules like `strict`, `target`, `module`. The compiler's personality. Shared by all apps.
- `tsconfig.json` (inside `apps/api`): defines **input/output wiring** — where to find source (`rootDir: src`), where to put output (`outDir: dist`), which files to include. Extends the base via `"extends"`.

Every app has different wiring, but all apps share the same compiler personality.

---

## Q9: Practical — Add `port: number = 3000` and log it

**A (correct implementation):**
```typescript
const port: number = 3000;
console.log(`Listening on port ${port}`);
```

Also: use `console.log("Loaded config:", config)` with a comma (not template literal) when printing objects. Template literals convert objects to the useless `[object Object]` string. The comma syntax lets `console.log` use its built-in object inspector to show the full structure.
