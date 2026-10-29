# Brix

Brix is a skills-first stack builder. Pick a stack, copy a command, and let an agent build the repo.

## Use it

```bash
npx usebrix@latest init --frontend nextjs --agent cursor
```

`npx usebrix` installs the same release. After a global install the command is `brix`.

Run it in an empty directory. It writes `stack.json`, `AGENTS.md`, `CLAUDE.md`, and `PROMPT.md`, then installs the skill set for the flags you pass. Paste `Read PROMPT.md and build the project` into Claude Code, Codex, or Cursor.

## Develop this repo

Requires Node.js 20 or newer and pnpm 10.12.1.

```bash
pnpm install
pnpm dev
pnpm brix init --help
```

`pnpm dev` starts the site at http://localhost:3000. Open `/stack` to build a command. `pnpm brix` builds the CLI and runs the local `brix` bin.

## Publish usebrix

`usebrix@0.1.0` is already on npm. The next publish has to be a new version, such as `0.1.1`. npm will not replace `0.1.0`.

1. Create a granular npm access token that can publish `usebrix`.
2. In this GitHub repo, add it as the Actions secret `NPM_TOKEN`.
3. Open Actions → Publish usebrix → Run workflow.
4. Choose the branch and enter the version.

That run sets `packages/cli/package.json` to the version, commits `Release usebrix <version>` on that branch when the version changed, publishes with the `latest` tag, and pushes the git tag `v<version>`.

`npx usebrix` and `npx usebrix@latest` both follow `latest`. Run the button only for a commit you want the world to install. The selected branch must allow the Actions bot to push the version commit and the tag.
