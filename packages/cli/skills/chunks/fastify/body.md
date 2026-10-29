# Fastify

Create a Fastify server with TypeScript inside the API root from `node-layout`. Prefer `fastify-cli` generate when starting empty, then reshape to this tree.

## Files

```
src/index.ts              build app, listen, close on SIGTERM
src/app.ts                Fastify instance + register plugins; export buildApp(); no listen
src/plugins/              shared infra (env, db, sensible) — use fastify-plugin when decorating for siblings
src/routes/health.ts      GET /health plugin
src/routes/<resource>.ts  encapsulated route plugins, prefix /v1
src/services/
src/db/                   only when a database is selected
```

## Encapsulation (official)

- Everything is a plugin. `fastify.register` creates a new encapsulation context: decorators and hooks are visible to descendants, not to ancestors.
- Put shared database / config plugins under `src/plugins/` and wrap with `fastify-plugin` (`fp`) when the decorator must be visible across sibling contexts.
- Put feature routes in encapsulated plugins under `src/routes/` so their hooks stay local.
- Validate body / query / params with Fastify JSON Schema on the route. Prefer TypeScript types generated or inferred from those schemas.
- Tests call `buildApp()`, `await app.ready()`, then `app.inject()`.

Do not add a second HTTP framework.
