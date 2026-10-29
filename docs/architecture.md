# Brix architecture

Skills-first stack builder. No auth. No sidebar.

**Visual source of truth:** [design.md](./design.md).  
**Product source of truth:** [prd.md](./prd.md).

## Routes

| Path | Role |
|------|------|
| `/` | Marketing landing |
| `/stack` | Stack builder (main product) |
| `/api/health` | `{ ok: true }` |

`/stack` stores the selection in the URL hash so a link restores the same choices.

## Tree

| Path | Role |
|------|------|
| `app/` | Next.js App Router |
| `components/site` | Top header and footer |
| `components/landing` | Landing sections |
| `components/stack` | Section picker and sticky summary |
| `components/ui` | Cards, pills, buttons |
| `packages/core` | Registry types, rules, hash codec, skill resolution |
| `packages/cli` | `brix` command. Generates skill files into the user's project |
| `registry/` | `registry.json` |
| `styles/theme.css` | Color and type tokens |
| `docs/` | Product and design notes (lowercase filenames) |

## Flow

1. User picks options on `/stack`.
2. `packages/core` applies requires/excludes and resolves the skill list.
3. The summary shows `npx usebrix@latest init` plus one `--flag value` for each selection. None is omitted.
4. The CLI generates those skills into the user's directory and writes `stack.json`, `AGENTS.md`, `CLAUDE.md`, and `PROMPT.md`.

## vs pilot-dashboard

`pilot-dashboard` is a mentoring product with Clerk, Supabase, and domain routes. Brix does not copy that product surface.
## Flow

1. User picks options on `/stack`.
2. `packages/core` applies requires/excludes and resolves the skill list.
3. The summary shows `npx usebrix@latest init` plus one `--flag value` for each selection. None is omitted.
4. The CLI installs those skills and writes `stack.json`, `AGENTS.md`, `CLAUDE.md`, and `PROMPT.md`.

## vs pilot-dashboard

`pilot-dashboard` is a mentoring product with Clerk, Supabase, and domain routes. Brix does not copy that product surface.
## Flow

1. User picks options on `/stack`.
2. `packages/core` applies requires/excludes and resolves the skill list.
3. The summary shows `npx usebrix@latest init` plus one `--flag value` for each selection. None is omitted.
4. The CLI installs those skills and writes `stack.json`, `AGENTS.md`, `CLAUDE.md`, and `PROMPT.md`.

## vs pilot-dashboard

`pilot-dashboard` is a mentoring product with Clerk, Supabase, and domain routes. Brix does not copy that product surface.
