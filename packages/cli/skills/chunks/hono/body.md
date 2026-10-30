# Hono

Scaffold with the official starter when starting from empty: `npm create hono@latest` (or pnpm / bun) and choose the `nodejs` or `bun` template to match `stack.json` `backendRuntime`. Place the result in the API root from `folder-structure` (`packages/api` or the repo root).

## Files

```
src/index.ts            serve() from @hono/node-server, or Bun.serve; graceful SIGINT/SIGTERM on Node
src/app.ts              new Hono(), middleware, route mounts; export the app (and AppType for RPC)
src/routes/health.ts    GET /health → small JSON, no config
src/routes/<resource>.ts
src/services/
src/db/                 only when a database is selected
```

## Routing (official best practices)

- Build larger apps with `app.route('/path', subApp)`, not Rails-style controllers.
- Chain `.get().post()...` on each sub-app when the frontend will use Hono RPC (`hc<AppType>`), then `export type AppType = typeof app` from `app.ts`.
- Mount product routes under `/v1`. Keep `/health` unversioned.
- Validate with `@hono/zod-validator` (or Standard Schema) on the route. Handlers return `c.json(..., status)`.

`app.ts` does not call `listen` / `serve`. Share types with the UI only through `packages/shared` or exported `AppType`, not a deep import into `packages/web` source. Do not add a second HTTP framework. Node requires 18.14.1+ / 20+.
