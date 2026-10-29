# FastAPI

Use `uv` at the repo root from `python-layout`. Prefer `uv init`, then move the app modules to the `src/` tree in `folder-structure` and `uv add fastapi uvicorn[standard]` (and the ORM / driver packages from the other skills).

## App shape (official bigger-applications + lifespan)

```
src/main.py                 FastAPI(lifespan=...), include_router(...)
src/api/deps.py             Depends() providers (session, current user)
src/api/routes/health.py    APIRouter, GET /health
src/api/routes/<resource>.py
src/lib/config.py           Settings from env
src/schemas/                Pydantic v2 models
src/services/
src/models/                 when an ORM is selected
```

- Create shared resources (engine, pool) once in a lifespan context manager; store on `app.state` if needed. Prefer lifespan over deprecated `on_event("startup")`.
- Hand out per-request resources with `Depends` and `yield` (session closes after the request). Annotate with `Annotated[..., Depends(...)]`.
- Include routers: `app.include_router(health.router)` and `app.include_router(books.router, prefix="/v1")`.
- OpenAPI is automatic at `/docs` / `/openapi.json`; keep response models on the path operations.

Use the ORM named in `stack.json`. Pydantic schemas live in `schemas/`, not on SQLAlchemy models.
