## Local Docker (`dbProvider.postgres-docker`)

Service definition lives in `infra/compose/docker-compose.yml`:

- Official `postgres` image with a pinned major tag.
- Named volume for data.
- Ports published only for local use.
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` from a gitignored env file; mirror the keys in `.env.example`.
- App `DATABASE_URL` points at that service name from Compose networks, or `localhost` when the API runs on the host.
