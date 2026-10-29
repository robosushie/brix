import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compositions, type SkillComposition } from "../skills/compositions.ts";

const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "skills");

function chunkFile(part: string): string {
  return join(skillsRoot, "chunks", `${part}.md`);
}

function readChunk(part: string): string {
  const file = chunkFile(part);
  if (!existsSync(file)) {
    throw new Error(`Missing skill chunk "${part}" (${file}).`);
  }
  return readFileSync(file, "utf8").trim();
}

export function skillFolder(id: string): string {
  return id.startsWith("brix-") ? `brix/${id.slice("brix-".length)}` : id;
}

export function renderSkill(id: string): string {
  const composition = compositions[id];
  if (!composition) {
    throw new Error(`No skill composition for "${id}".`);
  }
  const body = composition.parts.map(readChunk).join("\n\n");
  const rendered = `---\nname: ${composition.name}\ndescription: ${JSON.stringify(composition.description)}\n---\n\n${body}\n`;
  return rendered;
}

export function validateSkillCompositions(localIds: string[]): void {
  const expected = new Set(localIds);
  for (const id of localIds) {
    const composition: SkillComposition | undefined = compositions[id];
    if (!composition) throw new Error(`No composition for local skill "${id}".`);
    if (composition.parts.length === 0) throw new Error(`Composition "${id}" has no parts.`);
    for (const part of composition.parts) readChunk(part);
  }
  for (const id of Object.keys(compositions)) {
    if (!expected.has(id)) throw new Error(`Composition "${id}" is not a local registry skill.`);
  }
}
