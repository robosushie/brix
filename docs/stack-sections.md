# Stack sections

Twenty sections. Single-select except **AI tools**. Advanced is free text (`notes`), not a pill.

Status in the UI: proven or experimental. This pass marks shipped stubs experimental unless noted.

## 1. App type — `appType`

| Option | Id |
|--------|----|
| Web app + API | `web-api` |
| Full-stack single app | `fullstack` |
| API only | `api-only` |
| Web + mobile | `web-mobile` |

`fullstack` excludes a separate backend (`backend.hono`, `express`, `fastify`, `fastapi`). `api-only` excludes a frontend.

## 2. Package manager — `package`

`bun-turbo`, `pnpm-turbo`, `npm`, `uv`.

`uv` is required by FastAPI. JS package managers exclude `uv`.

## 3. Frontend — `frontend`

`nextjs`, `vite-react`, `sveltekit`, `nuxt`, `none`.

## 4. UI — `ui`

`tailwind-shadcn`, `tailwind`, `mui`, `plain`.

Hidden in spirit when frontend is `none` (options stay disabled).

## 5. Backend — `backend`

`hono`, `express`, `fastify`, `fastapi`, `next-handlers`, `none`.

## 6. Runtime — `runtime`

`node`, `bun`, `python`, `workers`.

FastAPI requires `python`. Cloudflare Workers excludes Express, Fastify, BullMQ, and Prisma.

## 7. Database — `database`

`postgres`, `mysql`, `sqlite`, `mongo`, `none`.

## 8. DB provider — `dbProvider`

`neon`, `supabase`, `railway`, `rds`, `local-docker`.

SQLite disables Neon and RDS. `none` database disables every provider.

## 9. ORM — `orm`

`drizzle`, `prisma`, `sqlalchemy`, `mongoose`.

Mongo requires Mongoose. FastAPI requires SQLAlchemy. Workers exclude Prisma.

## 10. Auth — `auth`

`better-auth`, `clerk`, `firebase`, `authjs`, `none`.

Better Auth and Auth.js require a database. Clerk requires a JS frontend.

## 11. Payments — `payments`

`stripe`, `razorpay`, `lemon`, `none`.

Any paid option requires a database. Razorpay notes INR in the skill.

## 12. Cache / queues — `cache`

`redis-bullmq`, `upstash`, `pgboss`, `none`.

BullMQ requires Redis-class cache plus Node or Bun, and excludes Workers.

## 13. File storage — `storage`

`s3`, `r2`, `supabase-storage`, `none`.

Supabase Storage requires the Supabase DB provider and Postgres.

## 14. Email — `email`

`resend`, `ses`, `postmark`, `none`.

## 15. Monitoring — `monitoring`

`sentry`, `sentry-posthog`, `otel`, `none`.

## 16. Testing — `testing`

`vitest-playwright`, `jest-cypress`, `pytest`, `minimal`.

FastAPI requires pytest.

## 17. CI/CD — `cicd`

`github-actions`, `gitlab`, `none`.

## 18. Cloud / deploy — `deploy`

`railway`, `render`, `aws`, `azure`, `cloudflare`, `vercel`.

Vercel as frontend-only conflicts with a separate non-Next backend unless the backend is `next-handlers` or `none`.

## 19. AI tools — `agents` (multi)

`claude-code`, `codex`, `cursor`.

## 20. Advanced

Free text, max 2000 characters, stored as `notes`. Not a registry option.

## Conflict highlights

| Rule | Behavior |
|------|----------|
| R1 FastAPI | Requires Python, SQLAlchemy, uv, pytest |
| R2 JS backends | FastAPI disabled while a TS backend is selected, and the reverse |
| R3 Workers | Disables Express, Fastify, BullMQ, Prisma |
| R4 Mongo | Requires Mongoose; other ORMs disabled |
| R5 SQLite | Disables Neon and RDS |
| R6 Supabase storage | Requires Supabase provider + Postgres |
| R7 Auth.js / Better Auth | Require a database |
| R8 Payments | Require a database |
| R9 Clerk | Requires a JS frontend |
| R10 Full-stack | Disables a separate backend process |
| R11 API only | Disables frontend and UI kits |
| R12 Vercel | Disables a separate backend that is not Next handlers |
| R13 Razorpay | Skill carries the INR note |
| R14 BullMQ | Requires Node or Bun |

Disabled pills show the reason. Required partners are selected with the parent so the summary stays valid.
