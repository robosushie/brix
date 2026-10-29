# Vercel AI SDK

Use the AI SDK from the TypeScript React app (Next.js or Vite). Put the model call in `src/agent/` of that app (the repo root, `apps/web`, or `packages/web`). One function in `src/services/` calls `streamText`. One streaming route or server action calls that runner. Do not put the prompt in a component, a route, or `src/lib/`.

If a separate backend is selected, that API owns the model call in its `src/agent/` and a runner in its `src/services/`. The React app only streams from that API. Do not call the model from both sides.

The provider key stays in `.env.example`. Do not add a second agent framework.
