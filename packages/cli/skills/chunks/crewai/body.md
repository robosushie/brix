# CrewAI

CrewAI is a Python agent framework. Put it in `src/app/services/agent/` (or the Django app package):

```
crew.py
agents.py
tasks.py
config/agents.yaml
config/tasks.yaml
```

Resolve YAML paths from the module file, not the process working directory. The model name comes from the env schema and is listed in `.env.example`. Routes call one crew entrypoint. Do not add a second agent framework.
