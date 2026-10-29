# SQLAlchemy

Use SQLAlchemy 2.x style only.

## Files

```
src/lib/db.py           create_engine / create_async_engine + sessionmaker / async_sessionmaker, and Base(DeclarativeBase)
src/models/            Mapped[...] + mapped_column; import all models so metadata sees them
src/api/deps.py        yield a session per request, then close / context-manage it
alembic.ini                at the Python project root
alembic/env.py
alembic/versions/
```

## Models and sessions (official 2.0)

- Models use `Mapped` and `mapped_column` on `DeclarativeBase`. Do not use the legacy declarative `Column` style on a declarative base.
- Sync: `sessionmaker(bind=engine)`. Async: `async_sessionmaker(engine, expire_on_commit=False)` and `create_async_engine` with an async driver (`asyncpg`, etc.).
- Set `expire_on_commit=False` for asyncio so committed attributes stay readable without implicit IO (avoids `MissingGreenlet`). Prefer `selectinload` / eager options over lazy IO in async code.
- One engine per process. Routes never call `create_engine` or open ad hoc sessions — only `Depends` / Flask teardown.

## Alembic

Alembic is the migration tool for this ORM. From the Python project root: `alembic init` (async template when the engine is async). `env.py` sets `target_metadata = Base.metadata` and imports model modules so autogenerate sees them. Script location stays `alembic/` next to `alembic.ini`, not inside `src/`. Apply with `alembic upgrade head`.
