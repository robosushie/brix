# Stack sections

App type stays above the accordions. Layout sits between App type and Core. Core has no None. Every other question has None, and None stays off the `npx usebrix@latest init` command.

## App type

`frontend-backend`, `backend-only`, `frontend-only`, `none`.

Frontend Only turns off the backend, database, cache, storage, and email. Backend Only turns off the frontend and UI.

## Layout

Seven trees, with no None pill: UI apps, API at root (`apps-src`), Monorepo (`apps-packages`), Flat workspace (`packages`), Fullstack app (`next-app`), Split folders (`split`), Single app (`single-src`), and Feature modules (`feature-modules`). The Layout section collapses like Core. A card starts closed. Opening it shows that tree and stores `choices.layout`, which adds `--layout`. Opening a card shows the tree on the left and the description on the right as bullet points.

A Suggested mark follows the stack and does not write the choice:

- JavaScript UI plus a JavaScript API, with Turborepo: Monorepo
- JavaScript UI plus a JavaScript API: Flat workspace
- JavaScript UI plus FastAPI, Flask, or Django: UI apps, API at root
- Next.js with no separate API: Fullstack app
- Frontend only, or backend only: Single app

Fullstack app stays available until a backend is chosen, or until the frontend is not Next.js. Single app stays off when both a UI and an API are selected. Flat workspace and Monorepo stay off a Python API. UI apps, API at root stays off unless both a UI and an API are selected. Feature modules stay off a frontend-only app and off a Python API. Split folders stays available.

`brix init` without `--layout` still installs the suggested tree.

## Core

Frontend, UI, backend, package manager, Turborepo, database, DB provider, ORM, and coding agents. None of these questions has a None pill. Leaving one unset adds no flag. Runtime sits under Frontend and under Backend, with no separator: Node or Bun for the JavaScript side. A FastAPI, Flask, or Django backend disables the backend runtime pills. The package manager is npm workspaces, pnpm workspaces, bun workspaces, or uv. uv is only for a Python-only backend. Turborepo is Turborepo or Workspaces only. Turborepo adds `--turbo`. Workspaces only adds no flag. The Turborepo question is hidden when the package manager is uv.

Coding agents (`claude-code`, `codex`, `cursor`) are multi-select. Repeat `--agent` once per agent. Clicking the last agent clears it.

DB provider and ORM apply after a real database is chosen.

## Services

Auth, payments, cache / queues, file storage, email, workflows, AI, and testing. Each has None.

AI framework is Boundary ML, Mastra, LangChain, LangGraph, CrewAI, Vercel AI SDK, PydanticAI, or None. Mastra and the Vercel AI SDK stay off a Python-only stack. CrewAI and PydanticAI stay off a JavaScript stack. Boundary ML, LangChain, and LangGraph stay available on both.

Workflows is Temporal, Prefect, Trigger.dev, or None. Prefect stays off a JavaScript stack. Trigger.dev stays off a Python-only stack. Temporal, Prefect, and Trigger.dev install their official skills when selected.

Testing None stays available on a Python or JavaScript stack. The other testing pills still follow the language of the backend.

## Cloud

Monitoring, CI/CD, cloud / deploy, and containers.

Containers is Docker, Kubernetes + Helm, or None. Kubernetes + Helm is one choice. It is recorded on the selection and does not install a skill. Cache and monitoring stay valid flags and are hidden on the stack form.

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
