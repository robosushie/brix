import { fullId, getOption, registry, sectionById, sectionLabel } from "./registry.ts";
import { disableReason } from "./rules.ts";
import { cloneSelection, normalizeSelection } from "./selection.ts";
import { isAgent, type AgentId, type Selection } from "./types.ts";

export function flagName(sectionId: string): string {
  if (sectionId === "agents") return "agent";
  return sectionId.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

const sectionIdByFlag = new Map(registry.sections.map((section) => [flagName(section.id), section.id]));

export function sectionIdForFlag(flag: string): string | undefined {
  return sectionIdByFlag.get(flag);
}

function multiValues(sel: Selection, sectionId: string): string[] {
  if (sectionId === "agents") return sel.agents;
  return [];
}

export function initCommand(sel: Selection): string {
  const normalized = normalizeSelection(sel);
  const parts = ["npx usebrix@latest init"];
  for (const section of registry.sections) {
    const flag = `--${flagName(section.id)}`;
    if (section.multi) {
      for (const value of multiValues(normalized, section.id)) {
        if (!value || value === "none") continue;
        parts.push(flag, value);
      }
      continue;
    }
    const value = normalized.choices[section.id];
    if (!value || value === "none") continue;
    parts.push(flag, value);
  }
  return parts.join(" ");
}

export function selectionFromFlags(pairs: Array<[string, string]>): { selection: Selection; errors: string[] } {
  const choices: Record<string, string> = {};
  const agents: AgentId[] = [];
  const errors: string[] = [];
  const requested: Array<[string, string]> = [];

  for (const [sectionId, optionId] of pairs) {
    const section = sectionById(sectionId);
    if (!section) {
      errors.push(`Unknown section "${sectionId}".`);
      continue;
    }
    if (optionId === "none") continue;
    if (!getOption(fullId(sectionId, optionId))) {
      errors.push(`Unknown option "${optionId}" for --${flagName(sectionId)}.`);
      continue;
    }
    requested.push([sectionId, optionId]);
    if (section.multi) {
      if (sectionId === "agents" && isAgent(optionId) && !agents.includes(optionId)) agents.push(optionId);
      continue;
    }
    choices[sectionId] = optionId;
  }

  const selection = normalizeSelection({
    registryVersion: registry.version,
    preset: null,
    agents,
    choices,
    notes: "",
  });

  for (const [sectionId, optionId] of requested) {
    const section = sectionById(sectionId);
    const kept = section?.multi
      ? multiValues(selection, sectionId).includes(optionId)
      : selection.choices[sectionId] === optionId;
    if (kept) continue;
    const draft = cloneSelection(selection);
    if (section?.multi) {
      if (sectionId === "agents" && isAgent(optionId)) draft.agents = [...draft.agents, optionId];
    } else {
      draft.choices[sectionId] = optionId;
    }
    errors.push(disableReason(sectionId, optionId, draft) ?? `${sectionLabel(sectionId)} ${optionId} conflicts with the rest of the stack.`);
  }

  return { selection, errors };
}

export function choiceLabel(sectionId: string, optionId: string): string {
  return getOption(fullId(sectionId, optionId))?.label ?? optionId;
}
