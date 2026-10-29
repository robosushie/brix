## Health

`GET /health` returns a small JSON body and does not leak config, versions, stack traces, SQL, or dependency status. Do not expose connection strings. HTTP health stays separate from database liveness unless the product explicitly wants a readiness probe that checks the database.
