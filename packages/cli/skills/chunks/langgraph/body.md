# LangGraph

The graph lives in the agent folder. Routes start a run. They do not define nodes.

Python, at the Python project root (`backend/` or the repo root):

```
langgraph.json
src/app/services/agent/graph.py
src/app/services/agent/nodes.py
src/app/services/agent/tools.py
src/app/services/agent/state.py
```

`langgraph.json` points `graphs` at the compiled graph and `dependencies` at the project. Pin `langgraph` in `pyproject.toml`.

TypeScript API: the same split under `src/services/agent/`, using `@langchain/langgraph`. No `langgraph.json` on a Node service.

Keys belong in `.env.example`. Do not add a second graph runtime.
