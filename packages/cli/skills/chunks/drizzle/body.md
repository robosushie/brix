# Drizzle

Add Drizzle in the API package against the database in `stack.json`. Schema in TypeScript is the source of truth; SQL migrations are generated and committed.

## Files

```
drizzle.config.ts         dialect, schema path, out: ./drizzle, dbCredentials.url
src/db/schema.ts          tables; export every table Drizzle Kit must see
src/db/client.ts          drizzle(client, { schema }); URL from env schema
drizzle/                  generated SQL + snapshots (commit this folder)
```

When the API is `packages/api`, those paths sit inside that package next to its `package.json`.

## Workflow (official)

1. Define tables in `src/db/schema.ts` (`pgTable` / mysql / sqlite matching `stack.json`).
2. `drizzle-kit generate` — review the SQL under `drizzle/`.
3. `drizzle-kit migrate` — apply pending files. Kit records applied migrations in `drizzle.__drizzle_migrations` (configurable).
4. Use `drizzle-kit push` only for local prototyping. Do not use push as the only history for shared or production databases.

Routes do not import the client; services call `src/db` query helpers.
