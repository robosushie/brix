# LangGraph

The graph lives in `src/agent/`. `src/services/` starts a run by calling the compiled graph. Routes call that runner. They do not define nodes.

Python, at the repo root (Django: the same files under `<app>/agent/`):

```
langgraph.json
src/agent/graph.py
src/agent/nodes.py
src/agent/tools.py
src/agent/state.py
```

`langgraph.json` points `graphs` at the compiled graph and `dependencies` at the project. Pin `langgraph` in `pyproject.toml`.

TypeScript API: the same split under `packages/api/src/agent/` (or `src/agent/` when the API is the only app), using `@langchain/langgraph`. No `langgraph.json` on a Node service.

Keys belong in `.env.example`. Do not add a second graph runtime.
