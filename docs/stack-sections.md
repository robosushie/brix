# Stack sections

App type stays above the accordions. The other questions sit in four groups. Every question has None. None is stored in the form and left off the `npx brix init` command.

## App type

`frontend-backend`, `backend-only`, `frontend-only`, `none`.

Frontend Only turns off backend, database, cache, storage, and email, and disables frontend None. Backend Only turns off frontend and UI.

## Core

Frontend, UI, backend, package manager, runtime, database, DB provider, ORM, and coding agents.

Coding agents (`claude-code`, `codex`, `cursor`) are multi-select. None clears the list and adds no `--agent` flag. Repeat `--agent` once per agent.

DB provider and ORM apply after a real database is chosen. Database None turns both off.

## Services

Auth, payments, cache / queues, file storage, email, and testing.

Testing None stays available on a Python or JavaScript stack. The other testing pills still follow the language of the backend.

## Cloud

Monitoring, CI/CD, and cloud / deploy.

## Tools

Multi-select: `codegraph`, `graphify`, `security-audit`, `docker`, `none`.

CodeGraph, Graphify, and Security audit install only when selected. Docker is recorded on the selection for local database, cache, files, and email. None clears the list and adds no `--tool` flag.

## Command

```bash
npx brix init --app-type frontend-backend --frontend nextjs --backend fastapi --agent cursor --tool codegraph
```

Flag names are the section ids in kebab case (`appType` is `--app-type`, `dbProvider` is `--db-provider`). A missing answer and None both omit the flag.
