const skills: Record<string, string> = {
  "brix-architect": `---
name: architect
description: Reads stack.json and scaffolds the chosen stack with official CLIs. Use when building a Brix project from PROMPT.md.
---

# Architect

1. Read \`stack.json\`, \`AGENTS.md\`, and \`PROMPT.md\`.
2. Scaffold with the official CLI for each chosen framework. Do not hand-roll boilerplate the CLI already emits. When the stack has a JavaScript frontend and a Python backend, put each in its own folder: uv for the Python service, and the JavaScript package manager for the frontend.
3. Apply the other installed skills for frontend, backend, data, auth, and payments.
4. Ship a thin vertical slice: one health route, one table when a database is selected, one protected route when auth is selected.
5. Stop only after the \`brix/verify\` skill passes or you record a concrete blocker.
`,
  "brix-security": `---
name: security
description: Applies the always-on Brix security baseline. Use on every project created with brix init.
---

# Security

Always on. Do not offer to skip this skill.

- Add \`.env.example\` and validate env at startup. Never commit secrets.
- Add a \`/health\` endpoint that does not leak config.
- Ignore \`.env\` in git. Run a secret scan before the first commit.
- Depend on pinned versions from the installed skills. Do not add a package that is not required by the stack.
- Docker is for local dependencies (database, redis) when those options are selected.
`,
  "brix-verify": `---
name: verify
description: Runs the Brix verification gate before the agent stops. Use after scaffolding a stack.
---

# Verify

Before stopping:

- Install dependencies with the package manager in \`stack.json\`.
- Typecheck or compile the projects that have a typecheck script.
- Run the selected test runner. Minimal testing still needs the health route to respond.
- Confirm \`.env.example\` keys match the validated schema.
- Write a short pass/fail checklist in \`NEXT_STEPS.md\`, including keys, DNS, and dashboards the human still has to fill in.

Fix failures that are inside the repo before handing back.
`,
  solid: `---
name: solid
description: Applies SOLID to modules in a Brix project. Use while splitting routes, services, and data access.
---

# SOLID

Use these as design rules for the generated repo. Do not add a lecture to the README.

- Single responsibility: a module changes for one reason. Routes parse input and call a service. Services own the use case. Data modules own queries. Do not put SQL, HTTP, and email in the same file.
- Open/closed: add a behavior by adding a module (a new payment provider, a new mailer) instead of editing a long conditional in an existing one.
- Liskov: a stand-in must keep the contract. A test double or a second provider accepts the same inputs and returns the same shape. Do not make a subtype throw for a case the caller is allowed to pass.
- Interface segregation: keep the boundary small. A route depends on the one function it calls, not on a god service with unrelated methods.
- Dependency inversion: domain and use-case code do not import the framework, the ORM client, or \`process.env\`. Pass a narrow interface in from the composition root (the server entry or the framework adapter).

If a file needs a comment to explain which of these it violates, split the file.
`,
  "api-design": `---
name: api-design
description: Designs HTTP APIs with REST rules, problem+json errors, pagination, and stateless auth. Use when the stack exposes or consumes an HTTP API.
---

# API design

If this project has no HTTP API, do not invent one. Apply the contract rules only to an API the app already calls.

## Resources

- Nouns, plural, versioned: \`/v1/books\`, \`/v1/books/51\`. Nest one level when the child has no meaning alone (\`/v1/authors/7/books\`).
- The method is the verb. Do not put verbs in the path (\`/getAllBooks\`, \`/createBook\`, \`/books/42/delete\`).
- Path identifies the resource. Query parameters filter, sort, and page. A bad query value is 422.
- Breaking changes (remove or rename a field, change a type, change what a URL means) ship under \`/v2\`. Adding an optional field, endpoint, or query parameter stays on the current version.

## Methods

- GET is safe and idempotent. PUT replaces the whole resource and is idempotent. PATCH sends only changed fields. DELETE is idempotent and returns 204 with an empty body. POST creates and returns 201 plus a \`Location\` header. POST is not safe to retry blindly.
- Same four steps on every route: match method and path, validate input, run the use case, send the status and JSON body.

## Status codes

- 200 OK for a read or a successful update with a body. 201 Created for a new resource. 204 No Content for a delete.
- 400 when the JSON is broken or a cursor is garbage. 422 when the JSON parses but a field fails a rule (empty title, year out of range).
- 401 when the caller is unknown (missing, invalid, or expired credential). 403 when they are known but not allowed. 404 when the resource does not exist. 409 for a conflict such as a duplicate review. 429 when a limit is exceeded.
- Never answer 200 with an error body. The HTTP status and the body's \`status\` field match.

## Errors

- Use \`Content-Type: application/problem+json\` (RFC 9457): \`type\`, \`title\`, \`status\`, \`detail\`, and \`errors\` with \`pointer\` plus \`detail\` for field failures.
- Do not put stack traces, SQL, or file paths in the body. Unknown user and wrong password share one message.

## Pagination

- Cap \`limit\`: default 10, maximum 50. Above the max is 422. Sort on a stable key such as \`id\`.
- Offset or page numbers are for admin tables that jump to a page. Cursor pagination is for feeds and infinite scroll. Treat the cursor as opaque. A malformed cursor is 400. Stop when \`next_cursor\` is null.
- The body tells the client what is next: \`total\` and \`offset\`, or \`next_cursor\`.

## Auth

- Stateless. Every request carries its credential. Do not store a server session that another instance cannot see.
- Authentication answers who the caller is (401). Authorization answers what they may do (403). Check ownership on every object read or write. A valid token for the wrong object is not proof of access; respond 404 when hiding existence is the product rule.
- API keys identify an application. Send them in a header such as \`X-API-Key\`, never in the URL. Use 128 or more random bits, store only a hash, compare in constant time, and support rotate and revoke. One key per client.
- JWTs identify a user. Pin the algorithm (\`HS256\` or the chosen asymmetric alg). Do not trust the token's own \`alg\` header. Verify the signature before reading claims. Require \`exp\`, \`iss\`, and \`aud\`. Lifetime is 5 to 15 minutes. The payload is readable, so it holds no secrets. The signing secret is 32 or more random bytes from the environment.

## Limits and browsers

- Rate limit per client. Login is stricter (about 5 per minute). 429 includes \`Retry-After\`. Successful responses can send \`RateLimit\` headers.
- CORS is a browser rule, not access control. Allow-list origins. Never combine \`*\` with credentials. Do not reflect an arbitrary \`Origin\`. List \`Authorization\` and \`Content-Type\` on preflight. \`curl\` and server-to-server clients are not protected by CORS.

## Contract

- Describe the API once in OpenAPI. Reuse schemas with \`components\` and \`$ref\`. Mark public routes with \`security: []\`.
- Code-first (generated from types) must not drift from the routes. Design-first (a hand-written file) must be linted and kept in sync.
- Every success test has a failing twin: 401, 403, 404, 422, and 429 where those codes apply. Assert status, headers, body shape, and the problem+json error format.
`,
  nextjs: `---
name: nextjs
description: Scaffolds a Next.js app with the official create-next-app flow. Use when stack.json frontend is nextjs.
---

# Next.js

Use \`create-next-app\` (or the documented Next.js CLI for the current major). App Router, TypeScript, and the UI kit from \`stack.json\`. Do not invent a second app directory if the scaffolder already created one.
`,
  hono: `---
name: hono
description: Adds a Hono API beside the frontend. Use when stack.json backend is hono.
---

# Hono

Create a Hono server on Node (or the selected runtime). Expose \`/health\`. Share types with the frontend only through an explicit package, not deep imports into app routes.
`,
  fastapi: `---
name: fastapi
description: Scaffolds a FastAPI service with uv. Use when stack.json backend is fastapi.
---

# FastAPI

Use \`uv\` and the official FastAPI project layout. Expose \`/health\`. Use the ORM named in \`stack.json\`. Do not add a Node backend next to this service.
`,
  flask: `---
name: flask
description: Scaffolds a Flask API with uv. Use when stack.json backend is flask.
---

# Flask

Use \`uv\` and a small application factory. Expose \`/health\`. Use the ORM named in \`stack.json\` (SQLAlchemy when that option is selected). Do not add a Node backend next to this service.
`,
  django: `---
name: django
description: Scaffolds a Django project with uv. Use when stack.json backend is django.
---

# Django

Use \`uv\` and \`django-admin startproject\`. Use Django ORM and Django migrations, not a second ORM. Expose a health view. Do not add a Node backend next to this service.
`,
  express: `---
name: express
description: Adds an Express API. Use when stack.json backend is express.
---

# Express

Create an Express server with the official generator or a single TypeScript entry. Expose \`/health\`. Keep route modules thin and read configuration from the env schema.
`,
  drizzle: `---
name: drizzle
description: Adds Drizzle ORM for the selected SQL database. Use when stack.json orm is drizzle.
---

# Drizzle

Add Drizzle against the database in \`stack.json\`. Generate migrations with the Drizzle kit. Do not hand-write a second migration system.
`,
  prisma: `---
name: prisma
description: Adds Prisma for the selected SQL database. Use when stack.json orm is prisma.
---

# Prisma

Run \`prisma init\` against the database in \`stack.json\`. Change the schema, then create migrations with \`prisma migrate\`. Do not hand-write a second migration system.
`,
  sqlalchemy: `---
name: sqlalchemy
description: Adds SQLAlchemy for a Python API. Use when stack.json orm is sqlalchemy.
---

# SQLAlchemy

Use SQLAlchemy 2.x style sessions. Point the URL at the selected database provider. Keep models in one module the API imports.
`,
  "better-auth": `---
name: better-auth
description: Wires Better Auth when a database is selected. Use when stack.json auth is better-auth.
---

# Better Auth

Install Better Auth and persist users in the selected database. Protect one example route. Ship \`.env.example\` entries for the auth secret and base URL.
`,
  stripe: `---
name: stripe
description: Adds a Stripe checkout slice. Use when stack.json payments is stripe.
---

# Stripe

Add a Stripe test-mode checkout and a webhook handler. Document \`STRIPE_SECRET_KEY\` and \`STRIPE_WEBHOOK_SECRET\` in \`.env.example\`. Do not call the live API.
`,
  postgres: `---
name: postgres
description: Adds Postgres for local and hosted use. Use when stack.json database is postgres.
---

# Postgres

Provide a Docker Compose service for local Postgres when the provider is local Docker. For Neon or another host, read the URL from the env schema. One schema, one migration path.
`,
};

export function skillFolder(id: string): string {
  return id.startsWith("brix-") ? `brix/${id.slice("brix-".length)}` : id;
}

export function renderSkill(id: string): string {
  const body = skills[id];
  if (!body) {
    throw new Error(`No skill template for "${id}".`);
  }
  return body.endsWith("\n") ? body : `${body}\n`;
}
