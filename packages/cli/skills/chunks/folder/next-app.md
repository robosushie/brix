## Fullstack app

`choices.layout` is `next-app`. One Next.js app sits at the repo root. There is no second service folder.

```
src/app/                         pages
src/app/api/                     route handlers
src/components/ui/
src/components/layout/
src/components/shared/
src/hooks/
src/lib/
src/store/
src/styles/
src/types/
public/
docs/
scripts/bootstrap/
```

`src/app` is the only App Router tree. Do not also keep a root `app/` directory. `src/app/api/<resource>/` is allowed, because this layout has no separate API. `/health` and product routes live there.

Do not create `apps/`, `packages/`, or a sibling API folder.
