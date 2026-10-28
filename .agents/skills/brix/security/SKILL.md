---
name: security
description: Applies the always-on Brix security baseline. Use on every project created with brix init.
---

# Security

Always on. Do not offer to skip this skill.

- Add `.env.example` and validate env at startup. Never commit secrets.
- Add a `/health` endpoint that does not leak config.
- Ignore `.env` in git. Run a secret scan before the first commit.
- Depend on pinned versions from the installed skills. Do not add a package that is not required by the stack.
- Docker is for local dependencies (database, redis) when those options are selected.
