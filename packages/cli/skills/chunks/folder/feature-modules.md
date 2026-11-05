## Feature modules

`choices.layout` is `feature-modules`. This is a JavaScript API in the Nest style. Group by feature, not by technical layer. Do not create top-level `controllers/`, `services/`, or `dtos/` folders.

```
src/main.ts
src/app.module.ts
src/<feature>/
  <feature>.module.ts
  <feature>.controller.ts
  <feature>.service.ts
  dto/
test/
```

`<feature>` is a domain name such as `users` or `orders`, not a product name for the repo. The controller reads the request and calls the service. The service owns the use case. DTOs stay in that feature's `dto/` folder.

When a frontend is selected, put that UI in `web/` beside `src/`. Do not place route files inside a feature module.

<!-- interior:nextjs -->
Next.js in `web/` uses `src/app` as the only App Router tree. Do not add `web/src/app/api`. The API in `src/` owns `/health` and `/v1`.

```
web/src/app/
web/src/components/ui/
web/src/components/layout/
web/src/components/shared/
web/src/hooks/
web/src/lib/
web/src/store/
web/src/styles/
web/src/types/
web/public/
```
<!-- /interior -->

<!-- interior:vite -->
Vite, React, or SvelteKit in `web/`:

```
web/src/components/ui/
web/src/components/layout/
web/src/components/shared/
web/src/hooks/
web/src/lib/
web/src/pages/            or web/src/routes/ when the router uses routes
web/src/styles/
web/src/types/
web/src/assets/
web/public/
```

SvelteKit keeps the `web/src/routes` tree its CLI emits. Do not add a parallel `pages/` tree.
<!-- /interior -->

`src/agent/` exists only when an AI framework is selected, and it stays a shared module rather than a prompt inside a controller. A feature service calls it and returns a result.
