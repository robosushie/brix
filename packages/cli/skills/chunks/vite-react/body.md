# Vite + React

Use the official Vite scaffold with the React TypeScript template. Run it in the UI root named by the `folder-structure` skill for `choices.layout`.

Use the package manager selected in `stack.json`:

- npm: `npm create vite@latest . -- --template react-ts`
- pnpm: `pnpm create vite . --template react-ts`
- bun: `bun create vite . --template react-ts`

After scaffolding, install dependencies with the selected package manager:

- npm: `npm install`
- pnpm: `pnpm install`
- bun: `bun install`

Keep the Vite entrypoint in `src/main.tsx`, the application component in `src/App.tsx`, and static assets in `public/`. Use the selected backend's HTTP API for server-side work; do not add server routes to the Vite app.
