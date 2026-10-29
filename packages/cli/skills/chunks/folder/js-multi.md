## More than one JavaScript deployable

Frontend plus Hono, Express, or Fastify:

```
apps/web/                 the frontend section
apps/api/                 the Node API section
packages/shared/          only when a type or UI package is shared
```

Three or more deployable services use role names, not product names:

```
packages/web/
packages/admin/
packages/api/
packages/worker/
packages/shared/
```

The package that owns the database holds `prisma/` or `drizzle/`. Apps are not dependencies of other apps.
