import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { compositions } from "../../../packages/cli/skills/compositions.ts";

function renderSkill(id: string): string {
  const composition = compositions[id];
  if (!composition) {
    throw new Error(`No skill composition for "${id}".`);
  }
  const root = join(process.cwd(), "packages", "cli", "skills", "chunks");
  const body = composition.parts
    .map((part) => {
      const file = join(root, `${part}.md`);
      if (!existsSync(file)) {
        throw new Error(`Missing skill chunk "${part}" (${file}).`);
      }
      return readFileSync(file, "utf8").trim();
    })
    .join("\n\n");
  return `---\nname: ${composition.name}\ndescription: ${JSON.stringify(composition.description)}\n---\n\n${body}\n`;
}

export function GET() {
  try {
    const bodies: Record<string, string> = {};
    for (const id of Object.keys(compositions)) {
      bodies[id] = renderSkill(id);
    }
    return NextResponse.json(bodies);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read skill files.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
