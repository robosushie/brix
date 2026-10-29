# Brix product

You pick the stack and copy one command. The command installs the skills. You add a prompt with your app details. Your agent uses those skills to build the repo.

## Who it is for

Solo builders and small teams who already work in Claude Code, Codex, or Cursor and want a pinned, reviewable skill set instead of a combinatorial template repo.

## Journey

1. Land on `/` and read how the command works.
2. Open `/stack`. The form starts empty. Nothing is selected, so the command is `npx usebrix@latest init`.
3. Pick App type, then open Core, Services, Cloud, or Tools. Illegal choices stay disabled. None adds no flag.
4. Copy the flag command, for example `npx usebrix@latest init --frontend nextjs --backend fastapi --agent cursor`.
5. Run it in an empty directory. Review the skill list (skip the prompt with `--yes`).
6. Add a prompt with your app details. The agent reads the installed skills and builds the repo.

## What the user gets

| File | Role |
|------|------|
| `stack.json` | Chosen options, agents, notes, registry version |
| `AGENTS.md` | Canonical build instructions |
| `CLAUDE.md` | Pointer at `AGENTS.md` |
| `PROMPT.md` | Starter for the agent. Your own prompt carries the app details. |
| `.agents/skills/` or `.claude/skills/` | Installed skill folders |

## Choices

There is no preset. App type is Frontend + Backend, Backend Only, Frontend Only, or None. Frontend Only turns off the backend, database, cache, storage, and email, and it requires a frontend. Backend Only turns off the frontend and UI. A Backend Only Python service leaves uv, Python, and pytest, and None stays available on those questions. A Frontend + Backend app can keep a JavaScript package manager beside a Python API.

## Principles

- Skills add. They do not multiply into a template per combination.
- Security and the verification gate are always installed.
- Electric Blue is decoration. Actions are carbon.
- The site has no accounts and no sidebar.
