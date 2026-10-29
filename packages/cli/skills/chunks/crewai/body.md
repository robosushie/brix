# CrewAI

CrewAI is a Python agent framework. It runs on FastAPI, Flask, and Django. It does not run on a JavaScript API.

Put the library in `src/agent/` at the repo root. On Django, put it in `<app>/agent/`:

```
crew.py
agents.py
tasks.py
config/agents.yaml
config/tasks.yaml
```

`src/services/` (Django: `<app>/services/`) holds one runner that calls a single crew entrypoint. Routes and views call that runner. They do not import crew modules, and `services/` does not define agents or tasks.

Resolve YAML paths from the module file, not the process working directory. The model name comes from the env schema and is listed in `.env.example`. Do not add a second agent framework.
