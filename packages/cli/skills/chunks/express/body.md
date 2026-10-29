# Express

Create an Express server with TypeScript inside the API root from `folder-structure` (`packages/api`, or the repo root when there is no UI). Prefer Express 5 when the generator / docs for the chosen major recommend it (rejected promises reach the error middleware).

## Files

```
src/index.ts              app.listen; SIGTERM closes the server
src/app.ts                express(), middleware, routers; export app (no listen)
src/routes/health.ts      GET /health
src/routes/<resource>.ts  Router mounted at /v1/<resource>
src/services/
src/db/                   only when a database is selected
src/middleware/           errorHandler, validate (Zod), auth
```

## Patterns

- Separate `app.ts` from `index.ts` so tests can `import { app }` and use Supertest without opening a port.
- Thin routers: validate → call service → send status/body. Services never see `req` / `res`.
- One central error middleware last. Map domain errors to RFC 9457 problem+json. Do not `res.json` errors with 200.
- Validate bodies and query with Zod (or similar) at the edge.
- Read configuration from one env schema module at startup.

Do not add a second HTTP framework.
