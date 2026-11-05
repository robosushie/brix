# Next.js

Use `create-next-app@latest` for the current major. Prefer non-interactive flags so the agent does not hang on prompts.

Required choices for Brix:

- TypeScript (`--ts`)
- App Router (`--app`)
- Source directory (`--src-dir`) so routes live in `src/app`
- UI kit from `stack.json`: Tailwind when `tailwind` or `tailwind-shadcn`; skip Tailwind when `mui`, `mantine`, or `plain`
- Package manager from `stack.json` `package`: `npm` uses `--use-npm`, `pnpm` uses `--use-pnpm`, `bun` uses `--use-bun`

Example:

```
npx create-next-app@latest . --ts --app --src-dir --eslint --use-pnpm
```

Run the CLI in the UI root named by the `folder-structure` skill for `choices.layout`.

## Layout rules (official)

- Keep `public/`, `package.json`, `next.config.*`, `tsconfig.json`, and `.env*` at that frontend root.
- Application code under `src/` (`src/app`, `src/components`, `src/lib`). Update `@/*` paths in `tsconfig.json` to include `src/`.
- Do not leave both root `app/` and `src/app` — Next ignores `src/app` if root `app` exists.
- Do not invent a second app directory.

## Backend boundary

Do not add a Node API inside `src/app/api` unless `choices.layout` is `next-app` or `single-src` with no separate backend. A selected Hono, Express, Fastify, or Python backend owns `/health` and `/v1`. The Next app calls that API over HTTP (or a Hono RPC client when both sides are Hono and types are shared through the shared package the layout skill names).
