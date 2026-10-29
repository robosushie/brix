# FastAPI

Use `uv` in the Python root from `python-layout` (repo root, or `backend/` beside `frontend/`). Prefer `uv init` with the default `src` layout, then `uv add fastapi uvicorn[standard]` (and the ORM / driver packages from the other skills).

## App shape (official bigger-applications + lifespan)

```
src/app/main.py                 FastAPI(lifespan=...), include_router(...)
src/app/api/deps.py             Depends() providers (session, current user)
src/app/api/routes/health.py    APIRouter, GET /health
src/app/api/routes/<resource>.py
src/app/core/config.py          Settings from env
src/app/schemas/                Pydantic v2 models
src/app/services/
src/app/db/                     when an ORM is selected
```

- Create shared resources (engine, pool) once in a lifespan context manager; store on `app.state` if needed. Prefer lifespan over deprecated `on_event("startup")`.
- Hand out per-request resources with `Depends` and `yield` (session closes after the request). Annotate with `Annotated[..., Depends(...)]`.
- Include routers: `app.include_router(health.router)` and `app.include_router(books.router, prefix="/v1")`.
- OpenAPI is automatic at `/docs` / `/openapi.json`; keep response models on the path operations.

Use the ORM named in `stack.json`. Pydantic schemas live in `schemas/`, not on SQLAlchemy models.
