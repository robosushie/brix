# usebrix

Install the Brix skill set for a stack.

```bash
npx usebrix@latest init --frontend nextjs --agent cursor
```

`npx usebrix` installs the same release. Node.js 20 or newer is required.

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

Source and issues: https://github.com/robosushie/brix
