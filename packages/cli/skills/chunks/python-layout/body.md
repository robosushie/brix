# Python layout

Follow this for FastAPI, Flask, or Django. Create the project with `uv init` in the Python root. That root is the repo root for a backend-only app, and `backend/` when a JavaScript frontend is selected. `frontend/` is not a Python package and is not listed in `pyproject.toml`.

uv's default application layout is `src/<package>/` with a build backend. Prefer that for FastAPI and Flask (package name `app` → `src/app`).

## FastAPI and Flask

```
pyproject.toml
alembic.ini                 only when the ORM is SQLAlchemy
alembic/                    only when the ORM is SQLAlchemy
  env.py
  versions/
src/app/
  __init__.py
  main.py                   FastAPI app + lifespan, or Flask create_app
  api/
    __init__.py
    deps.py                 request dependencies (session, current user)
    routes/
      __init__.py
      health.py
  core/
    __init__.py
    config.py               Pydantic Settings / env schema, read once
  services/
  schemas/                  request and response models (Pydantic), not tables
  db/
    __init__.py
    base.py                 DeclarativeBase, when SQLAlchemy is selected
    session.py              engine + session factory
    models/
tests/                      beside src/, not inside it
.env.example
```

Route modules are included from `main.py` (FastAPI `include_router`, Flask `register_blueprint`). A route does not open its own engine. Shared startup resources (pools) are created in FastAPI lifespan / Flask factory and handed out through `deps.py`.

## Django

Do not force `src/` onto Django. Use `django-admin startproject` and `startapp` (official tutorial layout).

```
manage.py
<project>/
  __init__.py
  settings.py
  urls.py
  asgi.py
  wsgi.py
<app>/
  __init__.py
  models.py
  views.py
  urls.py
  migrations/
tests/                      or the app's tests.py
.env.example
```

Settings read the env schema. Django ORM is the only ORM. Migrations come from `makemigrations` / `migrate`.
