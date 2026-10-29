## One Node API

Use this for Hono, Express, or Fastify when that API is the only JavaScript app, at the repo root.

```
src/index.ts              listen only
src/app.ts                framework app, no listen
src/routes/
src/services/
src/services/agent/       only when an AI framework is selected
src/models/
src/types/
src/lib/
src/middleware/
```

The same interior applies under `apps/api` or `packages/api`.
