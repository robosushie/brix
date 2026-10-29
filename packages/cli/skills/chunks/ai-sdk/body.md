# Vercel AI SDK

Use the AI SDK from the TypeScript React app (Next.js or Vite). Put the model call in `lib/agent.ts` (Next: `src/lib/agent.ts`). One streaming route or server action calls `streamText`. Do not put the prompt inline in a component.

If a separate backend is selected, that API owns the model call in `src/services/agent` and the React app only streams from it. Do not call the model from both sides.

The provider key stays in `.env.example`. Do not add a second agent framework.
