---
name: verify
description: Runs the Brix verification gate before the agent stops. Use after scaffolding a stack.
---

# Verify

Before stopping:

- Install dependencies with the package manager in `stack.json`.
- Typecheck or compile the projects that have a typecheck script.
- Run the selected test runner. Minimal testing still needs the health route to respond.
- Confirm `.env.example` keys match the validated schema.
- Write a short pass/fail checklist in `NEXT_STEPS.md`, including keys, DNS, and dashboards the human still has to fill in.

Fix failures that are inside the repo before handing back.
