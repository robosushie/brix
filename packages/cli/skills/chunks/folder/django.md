## Django

Keep the official layout. Do not move it into `src/app`.

```
manage.py
<project>/          settings, urls, asgi, wsgi
<app>/              models, views, urls, migrations
tests/
docs/
scripts/bootstrap/
```

Agent code, when an AI framework is selected, lives in the app package under `services/agent/`, not in a new top-level product folder.
