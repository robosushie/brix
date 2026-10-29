## Pooler and direct URLs

When the provider offers a pooler and a direct URL, use the pooler for runtime app traffic and the direct URL for migrations (Drizzle Kit, Prisma migrate, Alembic). Migrations need a session connection for DDL. Do not point the migration tool at a transaction pooler.
