# Verify

Before stopping, run every check that applies to this `stack.json`. Fix failures that are inside the repo before handing back.

## Install

- JavaScript workspace: install from the repo root so `apps/*` and `packages/*` resolve (npm / pnpm / bun as selected).
- Python: `uv sync` in the directory that holds `pyproject.toml` (repo root, or `backend/` when a JavaScript frontend sits beside it).

## Typecheck and tests

- Typecheck or compile every package that has a typecheck / build script. A split JS + Python repo needs both the workspace check and `uv run` for the Python check (for example `uv run ruff` / `uv run pytest` when those tools are present).
- Run the selected test runner. Minimal testing still needs `GET /health` to respond with a non-error status. Prefer one failing twin for a protected route (401/403) when auth is selected.

## Env and infra

- Confirm `.env.example` keys match the validated schema, including keys used by `infra/compose` when that folder exists.
- If Postgres Docker is selected, confirm compose starts and the ORM can connect with the documented URL.

## Handoff

- Write a short pass/fail checklist in `NEXT_STEPS.md`: which checks passed, which keys / DNS / dashboards the human still has to fill in, and how to run the app locally (workspace root vs `uv run` in the Python root).
