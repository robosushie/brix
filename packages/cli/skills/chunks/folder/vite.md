## Vite, React, or SvelteKit

Interior for a Vite, plain React, or SvelteKit app:

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

Where that interior lives:

- One app, no API: the repo root.
- A Python API: `apps/web`. `apps/admin` only when there is a second UI.
- A Hono, Express, or Fastify API: `packages/web`. `packages/admin` only when there is a second UI.

SvelteKit keeps the `src/routes` tree its CLI emits. Do not add a parallel `pages/` tree.
