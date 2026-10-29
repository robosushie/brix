# Brix

Brix is a skills-first stack builder. You pick the shape of an app, copy one command, and an agent builds the repo from a pinned skill set. It does not generate a template for every combination. The same skills apply to every valid stack, and illegal pairs are rejected before anything is written.

There is no account. The CLI does not phone home.

## What you do

1. Open `/stack` on the site, or write the flags yourself.
2. Pick an app type, then answer only the questions you care about. A partial stack is valid.
3. Copy the command. None and unanswered questions stay off it.
4. Run it in an empty directory. Review the skill list, or pass `--yes` to skip the prompt.
5. Paste `Read PROMPT.md and build the project` into Claude Code, Codex, or Cursor.

```bash
npx usebrix@latest init --app-type frontend-backend --frontend nextjs --backend fastapi --agent cursor --code-index codegraph
```

`npx usebrix` installs the same release as `npx usebrix@latest`. After `npm install -g usebrix` the command is `brix`. Node.js 20 or newer is required.

## What the command writes

| File | Role |
|---|---|
| `stack.json` | The choices, agents, notes, and registry version |
| `AGENTS.md` | Build instructions for the agent |
| `CLAUDE.md` | Pointer at `AGENTS.md` |
| `PROMPT.md` | The short prompt you paste into the agent |
| `.agents/skills/` | Skills for Cursor and Codex |
| `.claude/skills/` | Skills for Claude Code |

With no `--agent` flag, no agent folder is written. Repeat `--agent` once per agent to install for more than one.

Each skill runs three phases from the registry: `preinstall` (a tool binary, when one is required), `install` (a local `SKILL.md`, an upstream skill via `npx skills add --copy`, or project wiring), and `postinstall` (for example `codegraph init`). A failed step is recorded and the next skill still runs. The command exits non-zero if any required step failed. If `uv` is missing, Graphify is skipped.

These skills are always installed: `architect`, `security`, `verify`, `solid`, `api-design`, and the upstream security audit. `architect` tells the agent to scaffold with official CLIs, ship a thin slice, and stop only after `verify` passes. `solid` splits routes, services, and data access. `api-design` covers REST, problem+json errors, pagination, and stateless auth.

## Commands

```bash
brix init [--yes] [--app-type <id>] [--frontend <id>] [--agent <id>] ...
brix init --config stack.json
brix add
brix doctor
```

`init` reads the flags, or `--config <stack.json>`. With neither, it reads `./stack.json` in the current directory if that file exists. Do not pass section flags and `--config` together. `--yes` skips the confirm prompt.

`add` and `doctor` are reserved. They print that they are not implemented yet. To change a stack, run `init` again.

## Questions and options

Flag names are the section ids in kebab case. `--agent` is the one exception, and it can be repeated. A missing answer and `none` both omit the flag. An unknown id, or a pair the rules reject, exits before any file is written.

App type sits above the other groups. Core has no None. Every other question does.

### App type

| Flag | Values |
|---|---|
| `--app-type` | `frontend-backend`, `backend-only`, `frontend-only` |

Frontend + Backend is a browser app and a separate API. Backend Only turns off the frontend and UI. Frontend Only turns off the backend, database, cache, storage, and email.

### Core

| Flag | Values |
|---|---|
| `--frontend` | `nextjs`, `vite-react`, `sveltekit`, `react` |
| `--ui` | `tailwind-shadcn`, `tailwind`, `mui`, `mantine`, `plain` |
| `--backend` | `hono`, `express`, `fastify`, `fastapi`, `flask`, `django` |
| `--package` | `bun-turbo`, `pnpm-turbo`, `npm`, `uv` |
| `--runtime` | `node`, `bun`, `python` |
| `--database` | `postgres`, `mysql`, `sqlite`, `mongo` |
| `--db-provider` | `neon`, `supabase`, `railway`, `render`, `rds`, `postgres-docker` |
| `--orm` | `drizzle`, `prisma`, `sqlalchemy`, `django`, `mongoose` |
| `--agent` | `claude-code`, `codex`, `cursor` |

DB provider and ORM apply after a real database is chosen. A Frontend + Backend app can keep a JavaScript package manager beside a Python API.

### Services

| Flag | Values |
|---|---|
| `--auth` | `better-auth`, `clerk`, `firebase`, `authjs` |
| `--payments` | `stripe`, `razorpay` |
| `--cache` | `redis-bullmq`, `upstash`, `pgboss` |
| `--storage` | `s3` (AWS S3), `r2` (Cloudflare R2), `supabase-storage` |
| `--email` | `resend`, `sendgrid` |
| `--workflows` | `temporal`, `prefect`, `trigger` |
| `--ai-framework` | `baml` (Boundary ML), `mastra`, `langchain`, `langgraph`, `crewai`, `ai-sdk` (Vercel AI SDK), `pydantic-ai` |
| `--testing` | `vitest-playwright`, `jest-cypress`, `pytest`, `minimal` |

`minimal` checks only the health route. `pgboss` needs Postgres. Supabase Storage needs `--db-provider supabase` and `--database postgres`. MUI and Mantine apply to React frontends. Mastra and the Vercel AI SDK stay off a Python-only stack. CrewAI and PydanticAI stay off a JavaScript stack. Boundary ML, LangChain, and LangGraph work on either side. The stack form hides cache and monitoring; the CLI still accepts both flags.

### Cloud

| Flag | Values |
|---|---|
| `--monitoring` | `sentry`, `sentry-posthog`, `otel` |
| `--cicd` | `github-actions`, `gitlab`, `jenkins` |
| `--deploy` | `railway`, `render`, `aws`, `azure`, `cloudflare` |
| `--containers` | `docker`, `kubernetes` |

Containers are recorded on the selection. They do not install a skill. `kubernetes` means Kubernetes plus Helm. Docker is for local database, cache, files, and email when those options are selected.

### Tools

| Flag | Values |
|---|---|
| `--code-index` | `codegraph`, `graphify`, `gitnexus` |
| `--reply-style` | `caveman` |
| `--implementation` | `ponytail` |
| `--memory` | `supermemory`, `mem0`, `mempalace` |
| `--skill-pack` | `mattpocock`, `superpowers` |

CodeGraph is a live code graph over MCP. Graphify indexes code plus docs and other project files. GitNexus is a deeper graph with a noncommercial license. Caveman shortens what the agent says. Ponytail shrinks what it builds. Mem0 is recorded only and does not install a skill. The other memory options and both skill packs install when selected.

## Combinations the checker rejects

- A Python-only API (`fastapi`, `flask`, or `django` with Backend Only) cannot take a JavaScript package manager, Node, Bun, Vitest, Jest, or Trigger.dev.
- A JavaScript stack cannot take pytest or Prefect.
- Frontend Only cannot take uv or Python.
- Clerk cannot be used on Backend Only.
- Better Auth and Auth.js cannot be used on Frontend Only, because they need a database.

## Develop this repo

Requires Node.js 20 or newer and pnpm 10.12.1.

```bash
pnpm install
pnpm dev
pnpm brix init --help
```

`pnpm dev` starts the site at http://localhost:3000. Open `/stack` to build a command. `pnpm brix` builds the CLI and runs the local `brix` bin.

Pull requests run typecheck, the CLI bundle, and the Next.js production build.

## Publish usebrix

`usebrix@0.1.0` is already on npm. The next publish has to be a new version, such as `0.1.1`. npm will not replace `0.1.0`.

1. Create a granular npm access token that can publish `usebrix`.
2. In this GitHub repo, add it as the Actions secret `NPM_TOKEN`.
3. Open Actions → Publish usebrix → Run workflow.
4. Choose the branch and enter the version.

That run sets `packages/cli/package.json` to the version, commits `Release usebrix <version>` on that branch when the version changed, publishes with the `latest` tag, and opens a GitHub Release `v<version>`. The release notes link to that version on npm and include `npx usebrix@<version> init`.

The run stops before that commit if the version is already on npm as `usebrix@<version>`, or if the git tag `v<version>` already exists. npm will not replace a published version. A failed npm lookup, other than “version not found”, also stops the run.

`npx usebrix` and `npx usebrix@latest` both follow `latest`. Run the button only for a commit you want the world to install. The selected branch must allow the Actions bot to push the version commit and the release.
