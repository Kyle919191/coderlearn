# Day 2 — Quiz Q&A

---

## Q1: What is the difference between `type` and `interface`? When should you use each?

**A:**
- `interface`: for describing the shape of objects. Can be extended (`interface Admin extends User`). Use for anything that represents a real-world thing (User, Lesson, Config).
- `type`: more flexible — used for unions, aliases, tuples, and anything that isn't a plain object shape.

```typescript
interface User { id: string; name: string; }          // object shape → interface
type Difficulty = "beginner" | "intermediate";         // union → type
type ID = string;                                      // alias → type
type Point = [number, number];                         // tuple → type
```

Rule: `interface` for objects, `type` for everything else. It's a convention, not a hard technical limit — `type` CAN describe objects too.

---

## Q2: What does `completedAt?: Date` mean, and how is it different from `completedAt: Date | undefined`?

**A:** They are NOT the same — subtle but important:

```typescript
interface A { completedAt?: Date }            // key can be ABSENT entirely
interface B { completedAt: Date | undefined } // key must EXIST, value can be undefined

const a: A = {};                              // valid — key not there at all
const b: B = {};                              // ERROR — key must be present
const b2: B = { completedAt: undefined };     // valid
```

- `?` means the key itself may not exist on the object at all.
- `| undefined` means the key must be present, but its value is allowed to be `undefined`.

Use `?` in almost all cases. The difference surfaces when iterating keys or checking property existence.

---

## Q3: Why is `unknown` safer than `any`? What must you do before using an `unknown` value?

**A:**
- `any`: TypeScript turns off ALL type checking for that value. You can call any method, access any property — it compiles, but may crash at runtime.
- `unknown`: you must prove the type before using the value. TypeScript refuses to let you do anything with it until you narrow it.

```typescript
let x: any = "hello";
x.toUpperCasse();   // typo — compiles fine, crashes at runtime

let y: unknown = "hello";
y.toUpperCase();    // ERROR — must narrow first

if (typeof y === "string") {
  y.toUpperCase();  // OK — TypeScript now knows y is string
}
```

`unknown` says "earn the right to use this value." `any` says "do whatever, good luck."
Never use `any` in production code.

---

## Q4: What does `<T>` mean in `function first<T>(items: T[]): T | undefined`?

**A:** `<T>` is a **type parameter** — a placeholder that TypeScript fills in at the call site based on what you pass in. The function works correctly for arrays of any type without writing separate versions.

```typescript
first(["a", "b"]);    // T inferred as string → returns string | undefined
first([1, 2, 3]);     // T inferred as number → returns number | undefined
first([{ id: "1" }]); // T inferred as { id: string } → returns that | undefined
```

TypeScript infers `T` automatically — you don't need to write `first<string>(arr)`.

---

## Q5: What is `Record<Difficulty, number>` and what does it enforce?

**A:** `Record<K, V>` is a built-in generic meaning "an object where every key is type K and every value is type V." It's a typed dictionary (like Python's `dict[K, V]`).

```typescript
const order: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};
```

It enforces completeness at **compile time**:
- Missing a key → compile error
- Extra key not in the union → compile error
- Wrong value type → compile error

If you add a new value to `Difficulty`, TypeScript immediately errors on every `Record<Difficulty, ...>` that's missing it — exhaustiveness enforced by the compiler.

---

## Q6: What does `async` do to a function's return type? What does `await foo()` give you?

**A:** `async` forces the return type to be `Promise<T>`. `await` UNWRAPS the promise and gives you `T` directly — not a Promise.

```typescript
async function foo(): Promise<string> {
  return "hello";
}

foo();         // → Promise<string>  (still wrapped)
await foo();   // → string           (unwrapped by await)
```

`await` is the unwrapper. After awaiting, the Promise is gone and you have the plain value.

`await` can only be used inside an `async` function.

---

## Q7: What happens if you change `language: "typescript"` to `language: "rust"` in sampleTrack?

**A:** **Compile error** — before any code runs.

```
Type '"rust"' is not assignable to type 'Language'.
```

`Language` is a literal union: `"typescript" | "python" | "java" | "go"`. `"rust"` is not in it. TypeScript rejects it at compile time — you cannot even run the code. This is exactly why literal union types exist: typos and invalid values are caught at your desk, not in production.

If `language` were typed as plain `string`, it would compile silently and only break at runtime.

---

## Q8: What is `fetchUserById` simulating and what will replace it?

**A:** It simulates a **database call** — a real async operation that takes unknown time (typically 10–200ms). The `await new Promise(resolve => setTimeout(resolve, 50))` fakes a 50ms delay.

The `await` is essential: instead of freezing the server for 50ms, Node.js hands control back to the event loop to serve other requests, then resumes this function when the timer resolves.

On Day 6, the `setTimeout` will be replaced with a real `pg` (PostgreSQL) query:
```typescript
const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
return result.rows[0] ?? null;
```

---

## Q9: Why does `main()` get called at the bottom? What happens without the async wrapper?

**A:** Two reasons for the `async function main()` pattern:

1. `await` cannot be used at the top level of a regular `.ts` file (without special config). TypeScript errors: `'await' expressions are only allowed within async functions`.
2. Wrapping startup logic in a named function gives us a clean error boundary.

`main()` at the bottom is the trigger that starts execution — the function is defined above, then called once here.

In production, always add a `.catch()`:
```typescript
main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
```

This ensures startup crashes are visible instead of silently disappearing.

---

## Q10 (Practical): `isValidName` implementation

```typescript
export function isValidName(name: string): boolean {
  return name.length > 1 && name.length <= 50;
}
```

`name.length > 1` is equivalent to `>= 2` (at least 2 characters). Correct.
