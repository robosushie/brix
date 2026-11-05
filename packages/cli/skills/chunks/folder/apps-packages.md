## Monorepo

`choices.layout` is `apps-packages`. Deployable apps live in `apps/`. Shared libraries live in `packages/`. An app does not import another app. This layout is for JavaScript. Do not put a Python project here.

```
apps/web/                      frontend interior
apps/admin/                    only when there is a second UI
apps/api/                      Node API interior
apps/worker/                   only when there is a worker
packages/ui/
packages/shared/               types shared with the UI
infra/
```

Workspace globs are `apps/*` and `packages/*`. The package that owns the database holds `prisma/` or `drizzle/`, usually `apps/api`.

The frontend interior goes in `apps/web`.

<!-- interior:nextjs -->
Next.js uses `src/app` as the only App Router tree. Do not also keep a root `app/` directory, and do not add `src/app/api`. The API in `apps/api` owns `/health` and `/v1`.

```
src/app/
src/components/ui/
src/components/layout/
src/components/shared/
src/hooks/
src/lib/
src/store/
src/styles/
src/types/
public/
docs/
scripts/bootstrap/
```
<!-- /interior -->

<!-- interior:vite -->
Vite, React, or SvelteKit:

```
src/components/ui/
src/components/layout/
src/components/shared/
src/hooks/
src/lib/
src/pages/                or src/routes/ when the router uses routes
src/styles/
src/types/
src/assets/
public/
```

SvelteKit keeps the `src/routes` tree its CLI emits. Do not add a parallel `pages/` tree.
<!-- /interior -->

<!-- interior:node -->
The Node API interior goes in `apps/api`:

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
<!-- /interior -->
