# Folder structure

This skill is installed on every stack. Read `stack.json` `choices.layout` and apply that layout. Ignore every other layout in this file.

When `choices.layout` is missing, use this suggestion:

- A JavaScript UI plus Hono, Express, or Fastify, and `turbo` is `turborepo`: `apps-packages`.
- A JavaScript UI plus Hono, Express, or Fastify: `packages`.
- A JavaScript UI plus FastAPI, Flask, or Django: `apps-src`.
- Next.js with no separate API: `next-app`.
- Frontend only, or backend only: `single-src`.

Use generic folder names: `src`, `app`, `components`, `hooks`, `lib`, `services`, `models`, `schemas`, `types`, `styles`, `routes`, `pages`, `docs`, `public`, `scripts`. Do not create a top-level folder named after a product feature or a sample app. Feature URLs live inside `app/`, `pages/`, or `routes/`.

Shared rules:

- `docs/` is for human notes. `scripts/bootstrap/` is for seed data and one-off setup.
- `public/` is static files for a web app. It stays at that app's root.
- `types/` (TypeScript) or `schemas/` (Python) holds shapes that cross a boundary. Database tables stay in `models/` or the ORM folder.
- `src/agent/` exists only when an AI framework is selected. It holds that framework's library: prompts, tools, graphs, crews, and generated clients.
- `services/` owns use cases. Each file is a runner: it calls `src/agent/` (or `src/mastra/`) and returns a result. It does not define tools, prompts, crews, or graphs.
- Tests sit beside the project root (`tests/` for Python, the test runner's folder for TypeScript), not inside route files' feature folders.
- A second UI folder exists only when there is a second UI. A worker folder exists only when there is a worker.
- Create the UI root only when a frontend is selected. Create the API root only when a backend is selected.
