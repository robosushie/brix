# API design

Apply this skill when the app has a backend (Frontend + Backend, or Backend only). If this project has no HTTP API, do not invent one. Apply the contract rules only to an API the app already calls.

Sources to match: RFC 9457 problem details, OpenAPI 3.1 for the contract, and OWASP API Security Top 10 for authz and inventory.

## Structure

Mount the version on the router once: `/v1`. Route files do not repeat `v1` in the filename.

- A route validates input, calls one service function, and sends the status and body. It does not run queries or talk to Stripe, email, or storage.
- A service owns the use case. It does not read the raw request object.
- A `db` module (or a Django model / manager) owns queries. Services call it. Routes do not.
- OpenAPI lives next to that API. FastAPI exposes the generated schema from the app. A Node API keeps one OpenAPI 3.1 document (or generates it from route types) in the API package. Do not keep a second hand-written copy that can drift.

Node files: `src/routes`, `src/services`, `src/db` (under `apps/api` when the repo has both a JavaScript frontend and a JavaScript API). Python files: `src/app/api/routes`, `src/app/services`, `src/app/schemas`, `src/app/db`. Django: views, models, and urls inside the app package from `startapp`.

## Resources

- Nouns, plural, versioned: `/v1/books`, `/v1/books/51`. Nest one level when the child has no meaning alone (`/v1/authors/7/books`).
- The method is the verb. Do not put verbs in the path (`/getAllBooks`, `/createBook`, `/books/42/delete`).
- Path identifies the resource. Query parameters filter, sort, and page. A bad query value is 422.
- Breaking changes (remove or rename a field, change a type, change what a URL means) ship under `/v2`. Adding an optional field, endpoint, or query parameter stays on the current version. Keep an inventory of public routes (OWASP API9).

## Methods and status codes

- GET is safe and idempotent. PUT replaces the whole resource and is idempotent. PATCH sends only changed fields. DELETE is idempotent and returns 204 with an empty body. POST creates and returns 201 plus a `Location` header. POST is not safe to retry blindly.
- Same four steps on every route: match method and path, validate input, run the use case, send the status and JSON body.
- 200 for a read or successful update with a body. 201 Created. 204 No Content for delete.
- 400 when the JSON is broken or a cursor is garbage. 422 when the JSON parses but a field fails a rule.
- 401 unknown caller. 403 known but not allowed. 404 missing resource. 409 conflict. 429 rate limited.
- Never answer 200 with an error body. The HTTP status and the body's `status` field match.

## Errors (RFC 9457)

- Use `Content-Type: application/problem+json`: `type` (URI), `title`, `status`, `detail`, and optional `instance`. Field failures add `errors` with `pointer` (JSON Pointer) plus `detail`.
- Do not put stack traces, SQL, file paths, or internal hostnames in the body. Unknown user and wrong password share one message.

## Pagination

- Cap `limit`: default 10, maximum 50 (server-enforced). Above the max is 422. Sort on a stable unique key such as `id` (or `(created_at, id)`).
- Prefer opaque cursor pagination for feeds and infinite scroll. Treat the cursor as opaque; clients must not build it. A malformed cursor is 400. Stop when `next_cursor` is null.
- Offset or page numbers are acceptable for small admin tables that jump to a page. Prefer cursor for large or frequently changing lists.
- Response shape: `items` plus `next_cursor`, or `items` plus `total` and `offset`.

## Auth

- Stateless. Every request carries its credential. Do not store a server session that another instance cannot see.
- Authentication (401) vs authorization (403). Check ownership on every object (OWASP API1). Prefer 404 when hiding existence is the product rule.
- API keys identify an application. Send them in a header such as `X-API-Key`, never in the URL. Use 128 or more random bits, store only a hash, compare in constant time, support rotate and revoke.
- JWTs identify a user. Pin the algorithm (`HS256` or the chosen asymmetric alg). Do not trust the token's own `alg` header. Verify the signature before reading claims. Require `exp`, `iss`, and `aud`. Lifetime 5 to 15 minutes. Payload holds no secrets. Signing secret is 32 or more random bytes from the environment.

## Limits and browsers

- Rate limit per client. Login is stricter (about 5 per minute). 429 includes `Retry-After`. Successful responses can send `RateLimit` headers.
- CORS is a browser rule, not access control. Allow-list origins. Never combine `*` with credentials. Do not reflect an arbitrary `Origin`. List `Authorization` and `Content-Type` on preflight.

## Contract and tests

- Describe the API once in OpenAPI 3.1. Reuse schemas with `components` and `$ref`. Mark public routes with `security: []`.
- Every success test has a failing twin: 401, 403, 404, 422, and 429 where those codes apply. Assert status, headers, body shape, and the problem+json error format.
