# LangChain

Put the library in `src/agent/`, not in a route and not in `services/`.

- TypeScript API: `packages/api/src/agent/` (or `src/agent/` when the API is the only app). Depend on the current `@langchain/*` packages.
- Python API: `src/agent/` at the repo root. On Django, `<app>/agent/`. Depend on `langchain` from `uv`.

One module owns the model. Another owns tools. `src/services/` holds one runner that calls that library and returns a result. Routes call the runner. Keys such as the provider API key belong in `.env.example`. Do not add LangGraph, CrewAI, or a second agent stack unless that option is also selected.
