# usebrix

Install the Brix skill set for a stack. The command writes the skills into an empty folder. It does not generate the app.

[![npm](https://img.shields.io/npm/v/usebrix?logo=npm&logoColor=white&label=npm)](https://www.npmjs.com/package/usebrix)
[![downloads](https://img.shields.io/npm/dm/usebrix?logo=npm&logoColor=white)](https://www.npmjs.com/package/usebrix)
[![node](https://img.shields.io/node/v/usebrix?logo=node.js&logoColor=white)](https://nodejs.org)
[![license](https://img.shields.io/github/license/robosushie/brix)](https://github.com/robosushie/brix/blob/main/LICENSE)

Node.js 20 or newer is required. `npx usebrix` installs the same release as `npx usebrix@latest`.

```bash
npx usebrix@latest init --frontend nextjs --agent cursor
```

A global install exposes the `brix` command:

```bash
npm install -g usebrix
brix init --help
```

Run `brix init` in an empty directory. It writes `stack.json`, `AGENTS.md`, `CLAUDE.md`, and `PROMPT.md`, then installs skills for the flags you pass. Repeat `--agent` once per coding agent (`cursor`, `claude-code`, `codex`). `--yes` skips the confirm prompt.

```bash
brix init --yes --app-type frontend-backend --frontend nextjs --backend fastapi --agent cursor
brix init --config stack.json
```

Flags, rejected combinations, and how to contribute: [github.com/robosushie/brix](https://github.com/robosushie/brix#readme).

Issues: [github.com/robosushie/brix/issues](https://github.com/robosushie/brix/issues).
