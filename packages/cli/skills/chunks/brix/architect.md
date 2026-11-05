# Architect

1. Read `stack.json`, `AGENTS.md`, and `PROMPT.md`. Treat `stack.json` as the only source of truth for which frameworks, providers, and agents were chosen.
2. Read `stack.json` `choices.layout`. Follow the installed `folder-structure` skill for where each app goes. That skill wins if a framework sample tree disagrees.
   - `node-layout` still applies to a JavaScript frontend or a JavaScript API. It does not choose a second tree.
   - `python-layout` still applies to FastAPI, Flask, or Django. It does not choose a second tree.
   - A Python project is not an npm workspace member.

3. Scaffold with the official CLI for each chosen framework. Prefer `create-next-app`, `create-hono`, `uv init`, `django-admin startproject`, and the package manager's workspace tools. Do not hand-roll boilerplate those CLIs already emit. Move the CLI output into the folders the layout skill names when the CLI created a nested folder. When `stack.json` `turbo` is `turborepo`, add Turborepo at the repo root for a JavaScript workspace layout (`apps-packages` or `packages`). Skip it when `turbo` is `workspaces` or unset, and skip it when the layout is not a JavaScript workspace. A Python-only repo does not get Turborepo.
4. Create `infra/` only when `stack.json` selects Docker, Kubernetes + Helm, or Postgres Docker. The layout skill says what goes inside it. Do not put a Dockerfile, compose file, or Helm chart inside `src/`.
5. Apply the other installed skills in order: layout, framework, ORM / database, auth, payments, then `brix/security` and `api-design` when those skills installed.
6. Ship a thin vertical slice: one `GET /health` that does not leak config, one table when a database is selected, one protected route when auth is selected, one checkout or webhook stub when Stripe is selected.
7. Stop only after the `brix/verify` skill passes or you record a concrete blocker in `NEXT_STEPS.md`.
