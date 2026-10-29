# Folder structure

This skill is installed on every stack. Read `stack.json` and apply only the section that matches. Ignore the other sections.

Use generic folder names: `src`, `app`, `components`, `hooks`, `lib`, `services`, `models`, `schemas`, `types`, `styles`, `routes`, `pages`, `docs`, `public`, `scripts`. Do not create a top-level folder named after a product feature or a sample app. Feature URLs live inside `app/`, `pages/`, or `routes/`.

Shared rules:

- `docs/` is for human notes. `scripts/bootstrap/` is for seed data and one-off setup.
- `public/` is static files for a web app. It stays at that app's root.
- `types/` (TypeScript) or `schemas/` (Python) holds shapes that cross a boundary. Database tables stay in `models/` or the ORM folder.
- `src/agent/` exists only when an AI framework is selected. It holds that framework's library: prompts, tools, graphs, crews, and generated clients.
- `services/` owns use cases. Each file is a runner: it calls `src/agent/` (or `src/mastra/`) and returns a result. It does not define tools, prompts, crews, or graphs.
- Tests sit beside the project root (`tests/` for Python, the test runner's folder for TypeScript), not inside route files' feature folders.
