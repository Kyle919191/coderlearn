# Day 2 — What We Built and Key Concepts

---

## What We Did Today

Extended the API with a real module structure reflecting actual product domain:

1. Created `apps/api/src/types/lesson.ts` — core domain type definitions
2. Created `apps/api/src/utils/validate.ts` — typed validation and type guard functions
3. Created `apps/api/src/utils/format.ts` — generic utility functions
4. Rewrote `apps/api/src/index.ts` to import from modules, use sample data, and run async
5. Added `isValidName` as the practical exercise
6. Created GitHub repo `coderlearn` at https://github.com/Kyle919191/coderlearn and pushed

**Files created/modified:**
```
apps/api/src/
  types/
    lesson.ts       ← User, LearningTrack, Lesson, LessonResult, Difficulty, Language
  utils/
    validate.ts     ← isValidEmail, isValidScore, parseScore, isUser, isValidName
    format.ts       ← first<T>, last<T>, formatLesson, difficultyRank
  index.ts          ← rewrote: imports modules, async main(), sample data
```

---

## Key Concept: `type` vs `interface`

Both describe object shapes. Use `interface` for objects, `type` for unions/aliases/tuples.

```typescript
interface User { id: string; name: string; }           // object → interface
type Difficulty = "beginner" | "intermediate";          // union → type
type ID = string;                                       // alias → type
```

`interface` can be extended: `interface Admin extends User { permissions: string[] }`.
`type` is more flexible: can represent anything, but cannot be merged or extended the same way.

---

## Key Concept: Optional Properties (`?`) vs `| undefined`

```typescript
interface A { completedAt?: Date }            // key may not exist at all
interface B { completedAt: Date | undefined } // key must exist, value may be undefined

const a: A = {};                              // valid
const b: B = {};                              // ERROR — key required
const b2: B = { completedAt: undefined };     // valid
```

Use `?` almost always. The distinction matters when checking property existence or iterating keys.

---

## Key Concept: Literal Union Types

```typescript
type Language = "typescript" | "python" | "java" | "go";
```

A value of type `Language` must be exactly one of those 4 strings. Any other string (including typos) is a compile-time error. This is one of TypeScript's most powerful production safety tools — invalid values are caught before running a single line.

---

## Key Concept: `unknown` vs `any`

| | `any` | `unknown` |
|---|---|---|
| Type checking | Disabled entirely | Must narrow before use |
| Safety | None — compiles but may crash at runtime | Safe — compiler forces you to check |
| When to use | Never in production | When receiving data of unknown shape (API requests, JSON) |

```typescript
let y: unknown = "hello";
y.toUpperCase();               // ERROR — must narrow first
if (typeof y === "string") {
  y.toUpperCase();             // OK — narrowed to string
}
```

---

## Key Concept: Type Narrowing

TypeScript reduces ("narrows") a broad type to a specific type inside a conditional block:

```typescript
function process(input: unknown) {
  if (typeof input === "string") {
    // input is string here
    input.toUpperCase();
  }
  if (typeof input === "number") {
    // input is number here
    input.toFixed(2);
  }
}
```

Narrowing tools: `typeof`, `instanceof`, `in`, custom type guard functions (`value is T`).

---

## Key Concept: Type Guard Functions (`value is T`)

```typescript
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value && "name" in value;
}

if (isUser(data)) {
  // data is narrowed from unknown → User inside this block
  console.log(data.name);
}
```

The `value is User` return type is a **type predicate** — a compile-time instruction telling TypeScript "if this returns true, treat the argument as type User." The function still returns a plain boolean at runtime.

**Limitation:** TypeScript uses structural typing — any object with the matching fields passes the guard, even if it has extra fields. For untrusted external data (HTTP requests), use `zod` for strict runtime validation (Day 5).

---

## Key Concept: Generics `<T>`

```typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

`<T>` is a type parameter — a placeholder filled in at the call site. Allows one function to work correctly for any type. TypeScript infers `T` automatically from the argument:

```typescript
first(["a", "b"]);  // T = string → returns string | undefined
first([1, 2, 3]);   // T = number → returns number | undefined
```

---

## Key Concept: `Record<K, V>`

A built-in generic for a fully typed object (dictionary):

```typescript
const order: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};
```

Enforces at compile time:
- All keys of type K must be present (exhaustiveness)
- All values must be type V
- No extra keys allowed

---

## Key Concept: Modules (`import` / `export`)

```typescript
// in types/lesson.ts
export interface User { ... }

// in index.ts
import { User } from "./types/lesson";   // relative path, no .ts extension
import express from "express";           // package name (installed via npm)
```

Always use named exports (`export function foo`), never default exports (`export default`). Named exports are easier to search for and refactor across the codebase.

---

## Key Concept: `async` / `await`

```typescript
async function fetchUser(id: string): Promise<User | null> {
  await someAsyncOperation();   // pauses this function, hands control to event loop
  return user;
}

async function main() {
  const user = await fetchUser("user_001");  // unwraps Promise<User | null> → User | null
}
```

- `async` forces return type to `Promise<T>`
- `await` unwraps the promise — gives you `T`, not `Promise<T>`
- Node.js is single-threaded but non-blocking: while awaiting, other requests are served
- Today's `setTimeout(resolve, 50)` simulates a DB call → replaced with real `pg` query on Day 6

**Production startup pattern:**
```typescript
async function main(): Promise<void> { ... }
main().catch((err) => { console.error(err); process.exit(1); });
```

---

## Design Concept: Why Three Separate Interfaces?

`User`, `LearningTrack`, and `Lesson` are separate because they represent genuinely different things with different lifecycles.

**Normalization:** each fact is stored in exactly one place. A `Lesson` references its track via `trackId: string` — not by embedding the full track object. If the track is renamed, you update one record, not 30.

Embedding full objects leads to:
- Data duplication (30 lessons each carry a full copy of the track)
- Sync problems (which copy is the truth when they diverge?)
- Update anomalies (changing track name requires updating every lesson row)

The `trackId` is a **foreign key** — a reference to another record. This maps directly to how the PostgreSQL database will be structured on Day 6.

---

## Key Concept: Software Design — Structural Typing

TypeScript uses **structural typing**: a value is compatible with a type if it has at least the required fields, regardless of its declared type or any extra fields. This is different from Java/C# **nominal typing** where types must be explicitly declared.

```typescript
interface Point { x: number; y: number; }
const p = { x: 1, y: 2, z: 3 };  // has extra field z
const point: Point = p;            // valid — has all required fields
```

This is mostly a feature: flexible, less boilerplate. Tradeoff: type guards based on field presence can pass for unrelated objects with the same fields.

---

## Commands Reference

```bash
npm run dev:api                   # run API in dev mode (ts-node, from root)
cd apps/api && npm run build      # compile TypeScript → dist/
node apps/api/dist/index.js       # run compiled output
cd ../..                          # return to project root
git add . && git commit -m "msg"  # commit changes
git push                          # push to GitHub (Kyle919191/coderlearn)
```

---

## Bugs / Lessons Learned

- Top-level `await` without `async function` wrapper causes a TypeScript error: `'await' expressions are only allowed within async functions`.
