import { NextResponse } from "next/server";
import { compositions } from "../../../packages/cli/skills/compositions.ts";
import { renderSkill } from "../../../packages/cli/src/skills.ts";

export function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const layout = params.get("layout");
    const frontend = params.get("frontend");
    const backend = params.get("backend");
    const focus =
      frontend !== null || backend !== null
        ? { frontend: frontend || undefined, backend: backend || undefined }
        : undefined;
    const bodies: Record<string, string> = {};
    for (const id of Object.keys(compositions)) {
      const layoutId = id === "folder-structure" && layout !== null ? layout || null : undefined;
      bodies[id] = renderSkill(id, layoutId, id === "folder-structure" ? focus : undefined);
    }
    return NextResponse.json(bodies);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read skill files.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
