# Boundary ML

Use BAML for prompts. Run `baml init` in the package that calls the model: the API package, or `backend/` when the API is Python.

- Keep every `.baml` file under `baml_src/`. The directory name is required. `baml.toml` is optional.
- Generate the client and call it from `services/agent` (Python: `src/app/services/agent`). Routes do not contain prompts.
- Model keys belong in `.env.example` only. Do not add a second agent framework beside BAML.
