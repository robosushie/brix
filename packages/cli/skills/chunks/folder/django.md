## Django

Keep the official layout at the repo root. When a JavaScript UI exists, `manage.py` sits beside `apps/web`. Do not move Django into `src/`.

```
manage.py
<project>/          settings, urls, asgi, wsgi
<app>/              models, views, urls, migrations
tests/
docs/
scripts/bootstrap/
```

When an AI framework is selected, the library lives in `<app>/agent/`. `<app>/services/` is only the runner that views call. Do not put prompts, tools, crews, or graphs in `services/`.
