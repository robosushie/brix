import { NextResponse } from "next/server";
import { compositions } from "../../../packages/cli/skills/compositions.ts";
import { renderSkill } from "../../../packages/cli/src/skills.ts";

export function GET(request: Request) {
  try {
    const layout = new URL(request.url).searchParams.get("layout");
    const bodies: Record<string, string> = {};
    for (const id of Object.keys(compositions)) {
      const layoutId = id === "folder-structure" && layout !== null ? layout || null : undefined;
      bodies[id] = renderSkill(id, layoutId);
    }
    return NextResponse.json(bodies);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read skill files.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
