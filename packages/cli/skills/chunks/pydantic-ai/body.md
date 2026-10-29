# PydanticAI

Define one `Agent` in `src/agent/agent.py` (Django: `<app>/agent/agent.py`). Result models live in `src/schemas/`, not on the agent file as unstructured dicts. Tools are functions on that agent.

`src/services/` holds one runner that calls `agent.run` and returns the result. Routes call the runner. They do not construct the agent.

The model id comes from the env schema (`AGENT_MODEL` or the provider key) and is listed in `.env.example`. Do not add a second agent framework.
