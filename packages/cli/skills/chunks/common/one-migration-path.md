## One migration path

One database, one migration path. The ORM skill owns migrations (Alembic, Drizzle, Prisma, or Django). Do not add a second system. Do not ship schema changes with `metadata.create_all` alone when a migration tool is selected.
