## UI apps, API at root

`choices.layout` is `apps-src`. JavaScript UIs live under `apps/`. The API stays at the repo root. Do not create an npm package for the API.

```
apps/web/                      frontend interior
apps/admin/                    only when there is a second UI
src/                           the API, except Django
infra/                         only when Docker, Helm, or Postgres Docker is selected
```

The frontend interior goes in `apps/web` (and `apps/admin` for a second UI).

<!-- interior:nextjs -->
Next.js:

```
src/app/                         pages. The only App Router tree. Do not also keep a root app/ directory
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

Do not add `src/app/api` in this layout. The separate API owns `/health` and `/v1`.
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
Hono, Express, or Fastify, at the repo root:

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

<!-- interior:python -->
FastAPI or Flask. `pyproject.toml` stays at the repo root. The Python project is not an npm workspace member.

```
src/api/routes/
src/agent/                     framework library, only when an AI framework is selected
src/services/                  runners that call src/agent/; no prompts, tools, or graphs
src/models/
src/schemas/
src/lib/
src/constants/
src/enums/
alembic/                       only when the ORM is SQLAlchemy
tests/
docs/
scripts/bootstrap/
pyproject.toml
```
<!-- /interior -->

<!-- interior:django -->
Django keeps the official layout at the repo root, beside `apps/web`. Do not move Django into `src/`.

```
manage.py
<project>/          settings, urls, asgi, wsgi
<app>/              models, views, urls, migrations
tests/
docs/
scripts/bootstrap/
```

When an AI framework is selected, the Django library lives in `<app>/agent/`. `<app>/services/` is only the runner that views call.
<!-- /interior -->
