# PydanticAI

Define one `Agent` in `src/app/services/agent/agent.py`. Result models live in `src/app/schemas/`, not on the agent file as unstructured dicts. Tools are functions on that agent.

The model id comes from the env schema (`AGENT_MODEL` or the provider key) and is listed in `.env.example`. Routes call `agent.run`. Do not add a second agent framework.
