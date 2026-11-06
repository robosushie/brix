import { disableReason } from "./rules.ts";
import { type Selection } from "./types.ts";

const PYTHON_BACKENDS = new Set(["fastapi", "flask", "django"]);
const JS_BACKENDS = new Set(["hono", "express", "fastify"]);

/** The layout the old stack inference would have picked. A click overrides it. */
export function suggestedLayout(sel: Selection): string | null {
  const app = sel.choices.appType;
  const frontend = sel.choices.frontend;
  const backend = sel.choices.backend;
  let id: string | null = null;

  if (app === "backend-only") {
    id = "single-src";
  } else if (app === "frontend-only") {
    id = frontend === "nextjs" ? "next-app" : "single-src";
  } else if (app === "frontend-backend") {
    if (backend && PYTHON_BACKENDS.has(backend)) id = "apps-src";
    else if (backend && JS_BACKENDS.has(backend)) {
      id = sel.choices.turbo === "turborepo" ? "apps-packages" : "packages";
    } else if (frontend === "nextjs") {
      id = "next-app";
    }
  }

  if (!id || disableReason("layout", id, sel)) return null;
  return id;
}
