# Day 7 — Dashboard Shell (React + Vite + Router + Tailwind)

---

## What We Built

Today we created the frontend dashboard workspace and built the first navigation shell that will host the learning experience UI.

### 1) Dashboard workspace scaffold
Created `apps/dashboard` using Vite React TypeScript template.

Key result:
- independent frontend app workspace with scripts: `dev`, `build`, `preview`
- React 19 + TypeScript baseline

### 2) Routing bootstrap in `main.tsx`
Configured app root with:
- `ReactDOM.createRoot(...)`
- `BrowserRouter` wrapping `<App />`

This enables client-side route navigation without full page reload.

### 3) App shell with page routes in `App.tsx`
Built a shell layout with:
- persistent header/nav
- main content container
- route table:
  - `/` -> `ProjectStartPage`
  - `/tree` -> `TreePage`
  - `/submodule/:id` -> `SubmodulePage`
  - `*` -> redirect to `/`

Added placeholders for Day 8+ content and verified dynamic `:id` handling via `useParams`.

### 4) Tailwind baseline setup
Installed and configured:
- `tailwindcss`
- `@tailwindcss/vite`

Updated:
- `apps/dashboard/vite.config.ts` plugin chain
- `apps/dashboard/src/index.css` with `@import "tailwindcss"` and global reset

Replaced inline style objects in `App.tsx` with Tailwind utility classes.

---

## Verification

Checked dashboard behavior via dev server:
- `/` shows Project Start placeholder
- `/tree` shows Tree placeholder
- `/submodule/2.2-crud-create-list` shows id-aware submodule page
- unknown path redirects to `/`

UI shell behavior verified:
- header persists across routes
- route content swaps in `<main>`
- Tailwind styles applied (spacing, borders, typography, hover states)

---

## Key Concepts Learned

1. App shell vs feature pages
2. BrowserRouter and client-side route matching
3. Route params (`:id`) and `useParams`
4. Fallback routing with wildcard redirect
5. Why nav links point to global routes first (`/`, `/tree`)
6. Why dynamic routes should usually be generated from data (not hardcoded nav)
7. Utility-first CSS model
8. Design tokens (spacing/color/size scales)
9. Why Tailwind scales better than growing inline style objects
10. Responsive/state variants in Tailwind (`md:`, `hover:`) as ergonomic primitives

---

## Day 7 Outcome

The frontend shell is now in place and ready for Day 8 integration with engine data (`GET /api/tree`) and real skill-tree rendering.
