---
name: api-design
description: Designs HTTP APIs with REST rules, problem+json errors, pagination, and stateless auth. Use when the stack exposes or consumes an HTTP API.
---

# API design

If this project has no HTTP API, do not invent one. Apply the contract rules only to an API the app already calls.

## Resources

- Nouns, plural, versioned: `/v1/books`, `/v1/books/51`. Nest one level when the child has no meaning alone (`/v1/authors/7/books`).
- The method is the verb. Do not put verbs in the path (`/getAllBooks`, `/createBook`, `/books/42/delete`).
- Path identifies the resource. Query parameters filter, sort, and page. A bad query value is 422.
- Breaking changes (remove or rename a field, change a type, change what a URL means) ship under `/v2`. Adding an optional field, endpoint, or query parameter stays on the current version.

## Methods

- GET is safe and idempotent. PUT replaces the whole resource and is idempotent. PATCH sends only changed fields. DELETE is idempotent and returns 204 with an empty body. POST creates and returns 201 plus a `Location` header. POST is not safe to retry blindly.
- Same four steps on every route: match method and path, validate input, run the use case, send the status and JSON body.

## Status codes

- 200 OK for a read or a successful update with a body. 201 Created for a new resource. 204 No Content for a delete.
- 400 when the JSON is broken or a cursor is garbage. 422 when the JSON parses but a field fails a rule (empty title, year out of range).
- 401 when the caller is unknown (missing, invalid, or expired credential). 403 when they are known but not allowed. 404 when the resource does not exist. 409 for a conflict such as a duplicate review. 429 when a limit is exceeded.
- Never answer 200 with an error body. The HTTP status and the body's `status` field match.

## Errors

- Use `Content-Type: application/problem+json` (RFC 9457): `type`, `title`, `status`, `detail`, and `errors` with `pointer` plus `detail` for field failures.
- Do not put stack traces, SQL, or file paths in the body. Unknown user and wrong password share one message.

## Pagination

- Cap `limit`: default 10, maximum 50. Above the max is 422. Sort on a stable key such as `id`.
- Offset or page numbers are for admin tables that jump to a page. Cursor pagination is for feeds and infinite scroll. Treat the cursor as opaque. A malformed cursor is 400. Stop when `next_cursor` is null.
- The body tells the client what is next: `total` and `offset`, or `next_cursor`.

## Auth

- Stateless. Every request carries its credential. Do not store a server session that another instance cannot see.
- Authentication answers who the caller is (401). Authorization answers what they may do (403). Check ownership on every object read or write. A valid token for the wrong object is not proof of access; respond 404 when hiding existence is the product rule.
- API keys identify an application. Send them in a header such as `X-API-Key`, never in the URL. Use 128 or more random bits, store only a hash, compare in constant time, and support rotate and revoke. One key per client.
- JWTs identify a user. Pin the algorithm (`HS256` or the chosen asymmetric alg). Do not trust the token's own `alg` header. Verify the signature before reading claims. Require `exp`, `iss`, and `aud`. Lifetime is 5 to 15 minutes. The payload is readable, so it holds no secrets. The signing secret is 32 or more random bytes from the environment.

## Limits and browsers

- Rate limit per client. Login is stricter (about 5 per minute). 429 includes `Retry-After`. Successful responses can send `RateLimit` headers.
- CORS is a browser rule, not access control. Allow-list origins. Never combine `*` with credentials. Do not reflect an arbitrary `Origin`. List `Authorization` and `Content-Type` on preflight. `curl` and server-to-server clients are not protected by CORS.

## Contract

- Describe the API once in OpenAPI. Reuse schemas with `components` and `$ref`. Mark public routes with `security: []`.
- Code-first (generated from types) must not drift from the routes. Design-first (a hand-written file) must be linted and kept in sync.
- Every success test has a failing twin: 401, 403, 404, 422, and 429 where those codes apply. Assert status, headers, body shape, and the problem+json error format.
