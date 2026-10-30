# Architect

1. Read `stack.json`, `AGENTS.md`, and `PROMPT.md`. Treat `stack.json` as the only source of truth for which frameworks, providers, and agents were chosen.
2. Pick the repo root from the app type, then follow the layout skill that was installed:
   - Frontend only, or a Node or Bun API with no frontend: one app at the repo root. Follow `node-layout`.
   - Frontend plus Hono, Express, or Fastify: `packages/web` and `packages/api`. Follow `node-layout`.
   - Frontend plus FastAPI or Flask: `apps/web` for the JavaScript app and `src/` at the repo root for Python. Follow both layout skills. The Python project is not an npm workspace member.
   - Frontend plus Django: `apps/web` beside `manage.py` at the repo root. Follow both layout skills.
   - Backend only, Python: one uv project at the repo root. Follow `python-layout` (uv's default `src/` package layout).
   - Backend only, Node or Bun: one API at the repo root. Follow `node-layout`.
The `folder-structure` skill is installed on every stack and wins if a framework sample tree disagrees.

3. Scaffold with the official CLI for each chosen framework. Prefer `create-next-app`, `create-hono`, `uv init`, `django-admin startproject`, and the package manager's workspace tools. Do not hand-roll boilerplate those CLIs already emit. Move the CLI output into the tree above when the CLI created a nested folder. When `stack.json` `turbo` is `turborepo`, add Turborepo at the repo root for the JavaScript workspace. Skip it when `turbo` is `workspaces` or unset. A Python-only repo does not get Turborepo.
4. Create `infra/` only when `stack.json` selects Docker, Kubernetes + Helm, or Postgres Docker. The layout skill says what goes inside it. Do not put a Dockerfile, compose file, or Helm chart inside `src/`.
5. Apply the other installed skills in order: layout, framework, ORM / database, auth, payments, then `brix/security` and `api-design` when those skills installed.
6. Ship a thin vertical slice: one `GET /health` that does not leak config, one table when a database is selected, one protected route when auth is selected, one checkout or webhook stub when Stripe is selected.
7. Stop only after the `brix/verify` skill passes or you record a concrete blocker in `NEXT_STEPS.md`.
