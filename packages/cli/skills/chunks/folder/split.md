## Split folders

`choices.layout` is `split`. One folder per role. Do not create `apps/` or a workspace package folder for the apps.

```
frontend/                      UI interior
backend/                       API interior
infra/                         only when Docker, Helm, or Postgres Docker is selected
```

The frontend interior goes in `frontend/`.

Next.js uses `src/app` as the only App Router tree. Do not also keep a root `app/` directory, and do not add `src/app/api`. The API in `backend/` owns `/health` and `/v1`. Also add `src/components/ui`, `src/components/layout`, `src/components/shared`, `src/hooks`, `src/lib`, `src/store`, `src/styles`, `src/types`, `public/`, `docs/`, and `scripts/bootstrap/`.

Vite, React, or SvelteKit uses `src/components/ui`, `src/components/layout`, `src/components/shared`, `src/hooks`, `src/lib`, `src/pages` or `src/routes`, `src/styles`, `src/types`, `src/assets`, and `public/`. SvelteKit keeps `src/routes` and does not add a parallel `pages/` tree.

Hono, Express, or Fastify go in `backend/`:

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

FastAPI or Flask keep `pyproject.toml` inside `backend/`. The Python project is not an npm workspace member.

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

Django keeps the official layout inside `backend/`. Do not move Django into `src/`.

```
manage.py
<project>/          settings, urls, asgi, wsgi
<app>/              models, views, urls, migrations
tests/
docs/
scripts/bootstrap/
```

When an AI framework is selected, the Django library lives in `<app>/agent/`. `<app>/services/` is only the runner that views call.

When both sides are JavaScript and a package manager is selected, the workspace members are `frontend` and `backend`. A Python API is not a workspace member.
