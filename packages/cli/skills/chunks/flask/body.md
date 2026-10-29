# Flask

Use `uv` in the Python root from `python-layout`. Follow the official application-factory pattern.

## Factory

`src/app/main.py` (or `src/app/__init__.py`) exposes `create_app(test_config=None)`:

1. `app = Flask(__name__, instance_relative_config=True)`
2. Load default config, then env / instance config, or `test_config` when testing.
3. Ensure the instance folder exists when needed.
4. Create extensions unbound at module level (`db = SQLAlchemy()`) and call `db.init_app(app)` inside the factory — never `SQLAlchemy(app)` inside the factory in a way that blocks multiple app instances.
5. Register blueprints from `src/app/api/routes`.

## Routes

- Blueprints live in `src/app/api/routes`. `GET /health` is its own blueprint.
- Mount product blueprints under `/v1`.
- Run with `flask --app app.main:create_app run` (or the factory path you chose). `uv run` from the Python root.

Use the ORM named in `stack.json`. When that ORM is SQLAlchemy, the session factory is in `src/app/db/session.py` and the factory / teardown closes the session.
