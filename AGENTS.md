# AGENTS.md

Built with Brix. This file is the source of truth for coding agents.

## Stack

- App type: Frontend + Backend
- Frontend: Vite + React
- UI: Tailwind only
- Backend: FastAPI
- Frontend runtime: Node
- Package manager: npm workspaces
- Database: Postgres
- DB provider: Postgres Docker
- ORM: SQLAlchemy
- Auth: Clerk
- Payments: None
- Cache / queues: None
- File storage: None
- Email: None
- Monitoring: None
- Testing: Minimal
- CI/CD: GitHub Actions
- Cloud / deploy: Railway
- AI tools: cursor

## Build

1. Read `stack.json` and `PROMPT.md`.
2. Scaffold with official CLIs. Apply every skill under the installed skills directory.
3. Always keep security, Docker for local deps, lint, `/health`, `.env.example`, and the verification gate.
4. Run the gate in `brix/verify` and fix failures before stopping.

## Git commits

Only commit when the user asks. A pull request title uses the same first line.

Line 1 is exactly: `<type>(optional-scope): <subject>`

Types: `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `style`

The subject is only the text after the colon.

- Start it with a lowercase letter. Write "add", not "Add".
- 72 characters or fewer.
- Do not end it with a period.
- Imperative verb.
- One logical change. Pass the message via HEREDOC.
- No `--no-verify`, and no amend of a pushed commit, unless the user asks.

If more detail is needed, leave one blank line, then a body that says why. Never put the body on line 1.

Good:

```text
feat(ci): add semantic commit check

The commit-msg hook rejects subjects that do not match this format.
```

Bad:

```text
feat: Add a husky hook so generated commit messages follow the repo format.
```

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
