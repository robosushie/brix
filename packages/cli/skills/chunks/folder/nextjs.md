## Next.js

Interior for a Next.js app. `src/app` is the only App Router tree. Do not also keep a root `app/` directory.

```
src/app/                         pages
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

`src/app/api/<resource>/` exists only when no Hono, Express, Fastify, FastAPI, Flask, or Django API is selected.

Where that interior lives:

- No separate API: the repo root.
- A Python API: `apps/web`. `apps/admin` only when there is a second UI.
- A Hono, Express, or Fastify API: `packages/web`. `packages/admin` only when there is a second UI.
