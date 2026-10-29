## Next.js with no separate API

Use this when the frontend is Next.js and no Hono, Express, Fastify, FastAPI, Flask, or Django backend is selected.

```
src/app/                         pages
src/app/api/<resource>/          route handlers, one folder per resource
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

`src/app` is the only App Router tree. Do not also keep a root `app/` directory.
