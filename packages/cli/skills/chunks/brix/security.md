# Security

Always on. Do not offer to skip this skill.

## Secrets and env

- Add `.env.example` that lists every key the app or `infra/compose` reads, with empty or obvious placeholder values. Never commit real secrets, `.env`, or provider credential files.
- Validate env at process startup (Zod, Pydantic Settings, or an equivalent). Fail fast on missing required keys. Do not read `process.env` / `os.environ` ad hoc inside route handlers.
- Ignore `.env` in git. Run a secret scan (for example `gitleaks` or the agent's available scanner) before the first commit.

## HTTP surface

- Prefer HTTPS and secure cookie flags in production config when the stack sets cookies. Do not put secrets in query strings or URLs.
- Keep dependency versions pinned to what the installed skills require. Do not add a package that is not required by the stack.

## Auth and object access (when auth is selected)

- Authentication answers who the caller is (401). Authorization answers what they may do (403). Check ownership or tenancy on every object read or write (OWASP API1 Broken Object Level Authorization). A valid token for the wrong object is not proof of access; prefer 404 when hiding existence is the product rule.
- Do not trust client-supplied roles, tenant ids, or prices without server-side checks.

## Containers

- Docker is for local dependencies (database, redis) when those options are selected. Compose files and Dockerfiles live under `infra/`.
