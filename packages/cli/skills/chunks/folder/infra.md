## Infra

Create `infra/` only when Docker, Kubernetes + Helm, or Postgres Docker is selected. Do not put a Dockerfile, compose file, or chart inside `src/`.

```
infra/compose/docker-compose.yml
infra/docker/
infra/helm/<service>/
  Chart.yaml
  values.yaml
  templates/
```

`<service>` is a role (`api`, `web`, `worker`), not a product name. Helm templates use dashed file names.
