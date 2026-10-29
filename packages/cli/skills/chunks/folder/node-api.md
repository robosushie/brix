## One Node API

Use this for Hono, Express, or Fastify when that API is the only app, at the repo root.

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

The same interior applies under `packages/api` when a JavaScript UI sits beside the API.
