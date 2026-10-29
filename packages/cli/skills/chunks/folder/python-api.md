## Python API

FastAPI or Flask. `pyproject.toml` stays at the repo root. The Python project is not an npm workspace member. Django does not use this tree.

Backend only: this `src/` tree is the whole repo.

A JavaScript UI beside this API lives in `apps/web`. Add `apps/admin` only when there is a second UI. Do not wrap the Python code in another folder.

```
apps/web/                      the Vite, React, or Next interior
apps/admin/                    only when there is a second UI
src/api/routes/
src/agent/                     framework library, only when an AI framework is selected
src/services/                  runners that call src/agent/; no prompts, tools, or graphs
src/models/
src/schemas/
src/lib/
src/constants/
src/enums/
alembic/                       only when the ORM is SQLAlchemy
tests/
docs/
scripts/bootstrap/
pyproject.toml
```
