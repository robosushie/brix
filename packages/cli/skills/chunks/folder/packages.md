## Flat workspace

`choices.layout` is `packages`. Every app and library is a workspace package. There is no `apps/` folder. This layout is for JavaScript. Do not put a Python project here.

```
packages/web/                  frontend interior
packages/admin/                only when there is a second UI
packages/api/                  Node API interior
packages/worker/               only when there is a worker
packages/shared/               types shared with the UI
infra/
```

The workspace glob is `packages/*`. Apps are not dependencies of other apps. The package that owns the database holds `prisma/` or `drizzle/`.

The frontend interior goes in `packages/web`.

Next.js uses `src/app` as the only App Router tree. Do not also keep a root `app/` directory, and do not add `src/app/api`. Also add `src/components/ui`, `src/components/layout`, `src/components/shared`, `src/hooks`, `src/lib`, `src/store`, `src/styles`, `src/types`, `public/`, `docs/`, and `scripts/bootstrap/`.

Vite, React, or SvelteKit uses `src/components/ui`, `src/components/layout`, `src/components/shared`, `src/hooks`, `src/lib`, `src/pages` or `src/routes`, `src/styles`, `src/types`, `src/assets`, and `public/`. SvelteKit keeps `src/routes` and does not add a parallel `pages/` tree.

The Node API interior goes in `packages/api`:

```
src/index.ts              listen only
src/app.ts                framework app, no listen
src/routes/
src/agent/                framework library, only when an AI framework is selected
src/services/             runners that call src/agent/; no prompts, tools, or graphs
src/models/
src/types/
src/lib/
src/middleware/
```
