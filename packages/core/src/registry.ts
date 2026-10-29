import registryJson from "../../../registry/registry.json";
import { type IndexedOption, type Registry, type Selection, type StackSection } from "./types.ts";

export const registry = registryJson as Registry;

export const skillAgentMap = registry.agents;

export const skillCatalog = registry.skills;

const optionIndex = new Map<string, IndexedOption>();
for (const section of registry.sections) {
  for (const option of section.options) {
    const id = `${section.id}.${option.id}`;
    optionIndex.set(id, { ...option, sectionId: section.id, fullId: id });
  }
}

export const sectionOrder = new Map(registry.sections.map((item, index) => [item.id, index]));

export function fullId(sectionId: string, optionId: string): string {
  return `${sectionId}.${optionId}`;
}

export function getOption(id: string): IndexedOption | undefined {
  return optionIndex.get(id);
}

export function sectionById(sectionId: string): StackSection | undefined {
  return registry.sections.find((section) => section.id === sectionId);
}

export function sectionLabel(sectionId: string): string {
  return sectionById(sectionId)?.label ?? sectionId;
}

export function selectedIds(sel: Selection): string[] {
  const ids: string[] = [];
  for (const section of registry.sections) {
    if (section.multi) continue;
    const value = sel.choices[section.id];
    if (value) ids.push(fullId(section.id, value));
  }
  for (const agent of sel.agents) ids.push(fullId("agents", agent));
  return ids;
}
