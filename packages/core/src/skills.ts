import { skillCatalog, selectedIds } from "./registry.ts";
import { type Selection, type SkillRef } from "./types.ts";

export function resolveSkills(sel: Selection): SkillRef[] {
  const selected = new Set(selectedIds(sel));
  const out: SkillRef[] = [];
  const seen = new Set<string>();
  for (const entry of skillCatalog) {
    const matched = entry.when.always === true || (entry.when.any ?? []).some((id) => selected.has(id));
    if (!matched || seen.has(entry.id)) continue;
    seen.add(entry.id);
    out.push({
      id: entry.id,
      license: entry.license ?? "MIT",
      kind: entry.kind,
      optional: entry.optional,
      requiresCommand: entry.requiresCommand,
      missingHelp: entry.missingHelp,
      preinstall: entry.preinstall,
      install: entry.install,
      postinstall: entry.postinstall,
    });
  }
  return out;
}
