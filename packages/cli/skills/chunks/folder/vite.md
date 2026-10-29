## Vite, React, or SvelteKit

Use this for a Vite, plain React, or SvelteKit frontend. It is the `frontend/` tree when the API is Python, and `apps/web` when the API is JavaScript.

```
src/components/ui/
src/components/layout/
src/components/shared/
src/hooks/
src/lib/
src/pages/                or src/routes/ when the router uses routes
src/styles/
src/types/
src/assets/
public/
```

SvelteKit keeps the `src/routes` tree its CLI emits. Do not add a parallel `pages/` tree.
