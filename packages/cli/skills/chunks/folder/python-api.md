## Python API

FastAPI or Flask. At the repo root when the app is backend-only. Under `backend/` when a JavaScript frontend exists (`frontend/` uses the Vite or Next section). Django does not use this tree.

```
src/app/api/routes/
src/app/api/deps.py
src/app/core/
src/app/services/
src/app/services/agent/    only when an AI framework is selected
src/app/schemas/
src/app/models/
src/app/lib/
src/app/constants/
src/app/enums/
alembic/                   only when the ORM is SQLAlchemy
tests/
docs/
scripts/bootstrap/
```

The Python project is not an npm workspace package.
