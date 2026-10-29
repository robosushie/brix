# Django

Use `uv` and the official project layout. Do not rewrite Django into `src/`.

```
uv init
uv add django
uv run django-admin startproject config .
uv run python manage.py startapp core
```

(or equivalent package names). Result:

```
manage.py
config/           settings.py, urls.py, asgi.py, wsgi.py
core/             models.py, views.py, urls.py, migrations/
```

## Rules

- Django ORM and Django migrations only — not SQLAlchemy, not Alembic, not a second ORM.
- Settings read the env schema (`DATABASE_URL` or Django's discrete DB settings derived from it). Never commit `SECRET_KEY`; load it from the environment.
- Expose a health view that returns small JSON and does not query the database. Wire it in `core/urls.py` and include from `config/urls.py`.
- Product JSON APIs go under `/v1/` via `include()`. Prefer Django REST Framework only when the stack already implies it; otherwise keep thin JSON views consistent with `api-design`.
- Apply migrations with `uv run python manage.py migrate`.
