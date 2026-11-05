## Single app

`choices.layout` is `single-src`. One deployable sits at the repo root. Do not create `apps/` or a second service folder.

```
src/
tests/
docs/
scripts/bootstrap/
infra/                         only when Docker, Helm, or Postgres Docker is selected
```

<!-- interior:nextjs -->
Next.js, when this app is the frontend, uses this interior at the repo root. `src/app` is the only App Router tree. Do not also keep a root `app/` directory. `src/app/api` is allowed, because this layout has no separate API.

```
src/app/
src/app/api/
src/components/ui/
src/components/layout/
src/components/shared/
src/hooks/
src/lib/
src/store/
src/styles/
src/types/
public/
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
Hono, Express, or Fastify:

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
FastAPI or Flask. `pyproject.toml` stays at the repo root.

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
Django keeps the official layout at the repo root. Do not move Django into `src/`.

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
