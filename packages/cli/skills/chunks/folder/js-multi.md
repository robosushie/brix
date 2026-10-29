## JavaScript UI plus a JavaScript API

Use this for a React, Next, or Vite app plus Hono, Express, or Fastify, including when there are exactly two deployables.

```
packages/web/                  the frontend interior
packages/api/                  the Node API interior
packages/admin/                only when there is a second UI
packages/worker/               only when there is a worker
packages/shared/
```

The package that owns the database holds `prisma/` or `drizzle/`. Apps are not dependencies of other apps.
