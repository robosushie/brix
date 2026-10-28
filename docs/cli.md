# Brix CLI

Package: `@brix/cli`  
Bin: `brix`  
Published form (when released): `npx brix …`

Inside this repo, `npx brix` uses the local bin from `@brix/cli`. From an empty folder, `npx brix` works only after the package is published.

Local (from the `brix` folder):

```bash
pnpm brix init --yes --frontend nextjs --agent cursor
pnpm --filter @brix/cli exec brix init --help
```

## `brix init`

```bash
brix init [--yes] [--app-type <id>] [--frontend <id>] [--agent <id>] [--code-index <id>] ...
brix init --config <stack.json>
```

1. Read the section flags. Each selected value is `--<section> <id>`. `--agent` repeats once per coding agent. None and unanswered questions add no flag. `--config` reads a `stack.json` file. With no flags, read `./stack.json` if it exists.
2. Evaluate the selection with `packages/core` (same rules as the site). A partial selection is valid. Exit if a flag conflicts with another flag.
3. Print the skill list and licenses.
4. Ask for consent unless `--yes`.
5. Write `stack.json`, `AGENTS.md`, `CLAUDE.md`, and `PROMPT.md` in the current directory.
6. For each matching skill, run its three phases from `registry/registry.json`:
   - `preinstall` installs a tool binary when the skill needs one.
   - `install` writes a local `SKILL.md`, or copies an upstream skill with `npx skills add --copy`, or wires a tool into the project.
   - `postinstall` runs in the project after those files exist. Codegraph runs `codegraph init` here.
   Local Brix skills are written to `brix/<name>/SKILL.md` (`architect`, `security`, `verify`) under `.claude/skills` when `claude-code` is selected and under `.agents/skills` when `codex` or `cursor` is selected. Other local skills use `<name>/SKILL.md` in the same directories.
7. A failed step is recorded and the next skill still runs. If `uv` is missing, Graphify is skipped. The command exits non-zero when any required step failed.

`--agent` chooses where skills are installed: Claude Code, Codex, or Cursor. Repeat it for more than one. With no agent flag, no agent folder is targeted.

## `brix add`

Reserved. Prints that adding an option to an existing repo is not implemented yet.

## `brix doctor`

Reserved. Prints that drift checks against the verification gate are not implemented yet.

## Outputs

`PROMPT.md` tells the agent to read `stack.json`, scaffold with official CLIs, apply the installed skills, ship a thin vertical slice, and run the verification gate before stopping.

Telemetry is off. The CLI does not phone home.
