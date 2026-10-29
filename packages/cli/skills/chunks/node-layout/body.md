# Node layout

Follow this when the stack has a JavaScript frontend or a Hono, Express, or Fastify API. Matches Turborepo's `apps/` + `packages/` workspace layout and Next.js / Vite `src/` conventions.

A Python API beside that frontend lives in `backend/` and is described by `python-layout`. Do not put the Python project on the npm, pnpm, or bun workspace list.

## One JavaScript app

Frontend only, or a Node or Bun API with no frontend. Keep the official scaffolder at the repo root.

```
src/
public/                 static assets (Next.js: stays at repo root)
package.json
tsconfig.json
.env.example
```

- Next.js: App Router under `src/app` (`create-next-app --src-dir`). Keep `public/`, `next.config.*`, `package.json`, and `.env*` at the project root. If both root `app/` and `src/app` exist, Next ignores `src/app` — keep only one.
- Vite / React: application code under `src/`.
- SvelteKit: keep the `src/routes` tree the CLI emits.

A Node or Bun API at the repo root:

```
src/index.ts            process listen / serve only
src/app.ts              framework app, no listen (tests import this)
src/routes/             one file (or folder) per resource
src/services/           use cases
src/db/                 client and queries, only when a database is selected
src/middleware/         optional shared HTTP middleware
```

## Two JavaScript packages

Frontend plus Hono, Express, or Fastify, with npm workspaces, pnpm + Turborepo, or bun + Turborepo.

```
apps/web/               frontend, with its own src/
apps/api/src/           index.ts, app.ts, routes/, services/, db/
packages/               only when a type or UI package is shared
package.json
pnpm-workspace.yaml     or package.json workspaces
turbo.json              when the package manager is bun + Turborepo or pnpm + Turborepo
```

Workspace globs are `apps/*` and `packages/*`. Each package has its own `package.json`. Do not nest packages (`apps/web/packages`, or a `package.json` that sits above another package). Apps are not dependencies of other apps. Shared code moves to `packages/` with a clear `exports` map. Install dependencies in the package that imports them; root `package.json` holds only repo tooling (`turbo`, hooks).

## JavaScript frontend plus a Python API

The JavaScript app is `frontend/`, with the same `src/` rules as a single app. It is not `apps/web`. The Python service is `backend/` and is not a workspace package.
