# Stack sections

App type stays above the accordions. Core has no None. Every other question has None, and None stays off the `npx usebrix@latest init` command.

## App type

`frontend-backend`, `backend-only`, `frontend-only`, `none`.

Frontend Only turns off the backend, database, cache, storage, and email. Backend Only turns off the frontend and UI.

## Core

Frontend, UI, backend, package manager, runtime, database, DB provider, ORM, and coding agents. None of these questions has a None pill. Leaving one unset adds no flag.

Coding agents (`claude-code`, `codex`, `cursor`) are multi-select. Repeat `--agent` once per agent. Clicking the last agent clears it.

DB provider and ORM apply after a real database is chosen.

## Services

Auth, payments, cache / queues, file storage, email, workflows, and testing. Each has None.

Workflows is Temporal, Prefect, Trigger.dev, or None. Prefect stays off a JavaScript stack. Trigger.dev stays off a Python-only stack. Temporal, Prefect, and Trigger.dev install their official skills when selected.

Testing None stays available on a Python or JavaScript stack. The other testing pills still follow the language of the backend.

## Cloud

Monitoring, CI/CD, cloud / deploy, and containers.

Containers is Docker, Kubernetes, Helm, or None. It is recorded on the selection and does not install a skill.

## Tools

Single choice each, plus None:

- Code index: CodeGraph, Graphify, GitNexus
- Reply style: Caveman
- Implementation: Ponytail
- Memory: Supermemory, Mem0, MemPalace
- Skill pack: Matt Pocock skills, Superpowers

Security audit is always installed. Mem0 is recorded only. The others install when selected.

## Command

```bash
npx usebrix@latest init --app-type frontend-backend --frontend nextjs --backend fastapi --agent cursor --code-index codegraph --reply-style caveman
```

Flag names are the section ids in kebab case (`codeIndex` is `--code-index`, `skillPack` is `--skill-pack`). A missing answer and None both omit the flag.
