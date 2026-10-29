# LangChain

Put model and tool calls in the agent folder, not in a route.

- TypeScript API: `src/services/agent/`. Depend on the current `@langchain/*` packages.
- Python API: `src/app/services/agent/` (or the Django app package). Depend on `langchain` from `uv`.

One module owns the model. Another owns tools. Routes call a single function. Keys such as the provider API key belong in `.env.example`. Do not add LangGraph, CrewAI, or a second agent stack unless that option is also selected.
