# Boundary ML

Use BAML for prompts. The library lives in the agent folder of the package that calls the model: `src/agent/` at the Python repo root, `packages/api/src/agent/` for a TypeScript API, or the React app's `src/agent/` (`apps/web`, `packages/web`, or the repo root) when that app calls the model. On Django, use `<app>/agent/`.

```
src/agent/baml_src/       committed .baml files
src/agent/baml_client/    generated
```

`baml_src` must keep that directory name. `baml.toml` is optional.

Add this line to the repo `.gitignore`:

```
baml_client/
```

Commit `baml_src/`. Do not commit `baml_client/`. Regenerate before the app imports the client:

- Python: `uv run baml-cli generate --from src/agent/baml_src`
- TypeScript: `npx baml-cli generate --from src/agent/baml_src`
- Django: `--from` the `<app>/agent/baml_src` path

`src/services/` holds one runner that calls the generated client. Routes call that runner. They do not contain prompts. Model keys belong in `.env.example` only. Do not add a second agent framework beside BAML.
