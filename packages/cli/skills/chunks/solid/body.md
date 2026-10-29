# SOLID

Use these as design rules for the generated repo. Do not add a lecture to the README.

The folders that hold the split are `routes` (or `api/routes`), `services`, and `db` (or Django `models`). A file in one of those folders does not import the other two layers except through the call the route is allowed to make.

## Single responsibility

A module changes for one reason. Routes parse HTTP and call a service. Services own the use case. Data modules own queries. Do not put SQL, HTTP, Stripe, and email in the same file.

## Open / closed

Add a behavior by adding a module (a new payment provider, a new mailer) instead of editing a long conditional in an existing one. Prefer a small interface the composition root wires up.

## Liskov substitution

A stand-in must keep the contract. A test double or a second provider accepts the same inputs and returns the same shape. Do not make a subtype throw for a case the caller is allowed to pass.

## Interface segregation

Keep the boundary small. A route depends on the one function it calls, not on a god service with unrelated methods. Prefer `getBook(id)` over injecting an entire `BookService` facade that also sends mail.

## Dependency inversion

Domain and use-case code do not import the framework, the ORM client, or `process.env` / `os.environ`. Pass a narrow interface in from the composition root (the server entry, FastAPI `Depends`, Flask factory, or Express / Fastify / Hono app module).

If a file needs a comment to explain which of these it violates, split the file.
