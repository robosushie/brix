---
name: solid
description: Applies SOLID to modules in a Brix project. Use while splitting routes, services, and data access.
---

# SOLID

Use these as design rules for the generated repo. Do not add a lecture to the README.

- Single responsibility: a module changes for one reason. Routes parse input and call a service. Services own the use case. Data modules own queries. Do not put SQL, HTTP, and email in the same file.
- Open/closed: add a behavior by adding a module (a new payment provider, a new mailer) instead of editing a long conditional in an existing one.
- Liskov: a stand-in must keep the contract. A test double or a second provider accepts the same inputs and returns the same shape. Do not make a subtype throw for a case the caller is allowed to pass.
- Interface segregation: keep the boundary small. A route depends on the one function it calls, not on a god service with unrelated methods.
- Dependency inversion: domain and use-case code do not import the framework, the ORM client, or `process.env`. Pass a narrow interface in from the composition root (the server entry or the framework adapter).

If a file needs a comment to explain which of these it violates, split the file.
