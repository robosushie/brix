# Prisma

Run Prisma in the API package against the database in `stack.json`. Prefer current Prisma ORM docs for the installed major (v7 uses `prisma.config.ts` and driver adapters).

## Files

```
prisma/schema.prisma      generator + datasource models
prisma/migrations/        sibling of schema.prisma (required)
prisma.config.ts          when the major uses it: schema, migrations.path, datasource.url
src/db/client.ts          one PrismaClient (+ adapter when required)
```

`schema.prisma` and `migrations` stay in the same directory. Multi-file schemas keep `schema.prisma` (with the generator block) beside `migrations/`, with extra `.prisma` files in that folder or a `models/` subfolder as docs allow.

## Client

- Generate with `prisma generate`. Import `PrismaClient` from the generated output path the schema declares (not a guessed legacy path).
- Prisma 7+: pass the correct driver adapter (for example `@prisma/adapter-pg` with `PrismaPg`) — `new PrismaClient()` without an adapter errors.
- One client per process. In dev (Next / hot reload), store the client on `globalThis` so reloads do not open a new pool.

## Workflow

Change the schema → `prisma migrate dev` (or `migrate deploy` in CI/prod) → `prisma generate`. Routes do not construct a client; they call services that use `src/db/client.ts`.
