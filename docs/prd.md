# Brix product requirements

Working name in the source PDF was StackSkills. The product and CLI name is **Brix**.

Source: `docs/external/PRD Skills-first Stack Builder (working name StackSkills).pdf` (Oct 25 2026).

## Positioning

Free, static stack picker. A person chooses a stack, copies one command, and an agent (Claude Code, Codex, or Cursor) builds a production-shaped repo from an empty folder.

Skills grow **additively**: each option maps to one or more Agent Skills. The site emits a config. The CLI installs the matching skills and writes instructions. The agent runs each framework’s official scaffolder. Brix does not host generated code and does not require accounts.

Audience: solo builders and small teams using AI agents, including stacks that TypeScript-only scaffolders skip (Python, FastAPI, Razorpay, cheaper hosts).

## Always on

These are not choices. Every generated project includes them:

- Security baseline
- Lint and format
- Health endpoint
- `.env.example` plus a validated env schema
- `AGENTS.md`
- Verification gate

Base skills: `brix/architect`, `brix/security`, `brix/verify`.

## User flow

1. Open `/` and go to `/stack`, or start from a preset.
2. Choose App type, then Core, Services, Cloud, and Tools. Incompatible options are disabled with a reason. Core has no None. Every other question has None, and None adds no flag.
3. Optional notes (Advanced).
4. The summary command updates as pills are selected: `npx usebrix@latest init --frontend nextjs --agent cursor`.
5. In an empty folder, run the CLI. It installs skills for the chosen agents and writes `stack.json`, `AGENTS.md`, `CLAUDE.md`, `PROMPT.md`.
6. Tell the agent: “Read PROMPT.md and build the project.”
7. The agent scaffolds with official CLIs, applies skills, runs the verification gate, and leaves a pass/fail checklist plus next steps.

The page keeps the selection in the URL hash so a reload restores it. The copied command is the flags, not that hash.

Coding agents are the only multi-select. Security audit installs on every stack. Code index, reply style, implementation, memory, and skill pack install only when chosen. Mem0 is recorded and does not install a skill. Docker and Kubernetes + Helm are the Containers question under Cloud. Cache and monitoring stay on the CLI and are hidden on the stack form.

## Data

`stack.json` is the source of truth inside the generated repo:

```json
{
  "registryVersion": "2026.10.1",
  "preset": "saas-starter",
  "agents": ["claude-code", "codex", "cursor"],
  "choices": {
    "frontend": "nextjs",
    "backend": "hono"
  },
  "notes": ""
}
```

`registry.json` maps each option to skill sources, requires, excludes, and status (`proven` or `experimental`). Options with no skill stay hidden from the skill list until a skill exists; this repo ships stubs so the builder can resolve a preset end to end.

The same rules run in the UI and the CLI (`packages/core`).

## Phases (from the PRD)

| Phase | Scope |
|-------|--------|
| 1 Foundations | Registry, rules, `stack.json`, presets, architect + verify skills |
| 2 CLI + skills | `init`, consent, skill install, instruction files |
| 3 Builder site | 20-section UI, conflicts, hash state, command box |
| 4 Security + CI | Scanners, weekly pass/fail matrix |
| 5 Breadth | `add` / `doctor`, more skills, docs, launch |

This repo implements the builder UI, registry, base skills, and `init`. Weekly CI, Graphify, license audits, and npm publish are later.

## Non-goals

- Hosted codegen, accounts, payments, or a user database
- A guarantee that every combination is proven
- Replacing vendor skills with hand-written templates
- Auth inside the Brix site
