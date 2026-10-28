---
name: architect
description: Reads stack.json and scaffolds the chosen stack with official CLIs. Use when building a Brix project from PROMPT.md.
---

# Architect

1. Read `stack.json`, `AGENTS.md`, and `PROMPT.md`.
2. Scaffold with the official CLI for each chosen framework. Do not hand-roll boilerplate the CLI already emits. When the stack has a JavaScript frontend and a Python backend, put each in its own folder: uv for the Python service, and the JavaScript package manager for the frontend.
3. Apply the other installed skills for frontend, backend, data, auth, and payments.
4. Ship a thin vertical slice: one health route, one table when a database is selected, one protected route when auth is selected.
5. Stop only after the `brix/verify` skill passes or you record a concrete blocker.
