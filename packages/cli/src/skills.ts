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

export type FolderFocus = {
  frontend?: string;
  backend?: string;
};

const viteFrontends = new Set(["vite-react", "react", "sveltekit"]);
const nodeBackends = new Set(["hono", "express", "fastify"]);
const pythonBackends = new Set(["fastapi", "flask"]);
function keptInteriors(focus: FolderFocus): Set<string> {
  const keep = new Set<string>();
  if (focus.frontend === "nextjs") keep.add("nextjs");
  else if (focus.frontend && viteFrontends.has(focus.frontend)) keep.add("vite");
  if (focus.backend && nodeBackends.has(focus.backend)) keep.add("node");
  else if (focus.backend && pythonBackends.has(focus.backend)) keep.add("python");
  else if (focus.backend === "django") keep.add("django");
  return keep;
}

function applyInteriors(markdown: string, focus?: FolderFocus): string {
  const keep = focus ? keptInteriors(focus) : null;
  const interiorPattern = /<!-- interior:([\w-]+) -->\r?\n?([\s\S]*?)<!-- \/interior -->\r?\n?/g;
  const filtered = markdown.replace(interiorPattern, (_match, kind: string, body: string) => {
    if (keep && !keep.has(kind)) return "";
    return `${body.trim()}\n\n`;
  });
  return filtered.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function renderSkill(id: string, layoutId?: string | null, focus?: FolderFocus): string {
  const composition = compositions[id];
  if (!composition) {
    throw new Error(`No skill composition for "${id}".`);
  }
  let parts = composition.parts;
  if (id === "folder-structure" && layoutId !== undefined) {
    const layoutPart = layoutId ? `folder/${layoutId}` : "";
    if (layoutPart && !composition.parts.includes(layoutPart)) {
      throw new Error(`Unknown layout "${layoutId}".`);
    }
    parts = composition.parts.filter(
      (part) => part === "folder/rules" || part === "folder/infra" || part === layoutPart,
    );
  }
  const joined = parts.map(readChunk).join("\n\n");
  const body = id === "folder-structure" ? applyInteriors(joined, focus) : joined;
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
