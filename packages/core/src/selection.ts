import { fullId, getOption, registry, sectionById, sectionOrder } from "./registry.ts";
import { disableReason, sectionUse } from "./rules.ts";
import { isAgent, type Selection } from "./types.ts";

export function cloneSelection(sel: Selection): Selection {
  return {
    registryVersion: registry.version,
    preset: sel.preset,
    agents: [...(sel.agents ?? [])],
    choices: { ...sel.choices },
    notes: sel.notes ?? "",
  };
}

function clearLater(sel: Selection, sectionId: string) {
  const optIndex = sectionOrder.get(sectionId) ?? -1;
  for (const section of registry.sections) {
    const index = sectionOrder.get(section.id) ?? -1;
    if (section.multi || index <= optIndex) continue;
    const value = sel.choices[section.id];
    if (value && disableReason(section.id, value, sel)) delete sel.choices[section.id];
  }
}

export function normalizeSelection(input: Selection): Selection {
  const sel = cloneSelection(input);
  sel.agents = sel.agents.filter(isAgent);
  sel.notes = sel.notes.slice(0, 2000);

  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false;
    for (const section of registry.sections) {
      if (section.multi) continue;
      if (sectionUse(section, sel) === "unused" && sel.choices[section.id]) {
        delete sel.choices[section.id];
        changed = true;
      }
    }
    for (const section of registry.sections) {
      if (section.multi) continue;
      const value = sel.choices[section.id];
      if (!value) continue;
      const opt = getOption(fullId(section.id, value));
      if (!opt) {
        delete sel.choices[section.id];
        changed = true;
        continue;
      }
      const before = JSON.stringify(sel.choices);
      clearLater(sel, section.id);
      if (JSON.stringify(sel.choices) !== before) changed = true;
      if (disableReason(section.id, sel.choices[section.id] ?? value, sel)) {
        delete sel.choices[section.id];
        changed = true;
      }
    }
    if (!changed) break;
  }

  return sel;
}

export function emptySelection(notes = ""): Selection {
  return normalizeSelection({
    registryVersion: registry.version,
    preset: null,
    agents: [],
    choices: {},
    notes,
  });
}

export function selectionFromPreset(presetId: string, notes = ""): Selection {
  const preset = registry.presets.find((item) => item.id === presetId);
  if (!preset) return emptySelection(notes);
  return normalizeSelection({
    registryVersion: registry.version,
    preset: preset.id,
    agents: [...preset.agents],
    choices: { ...preset.choices },
    notes,
  });
}

export function selectOption(sel: Selection, sectionId: string, optionId: string): Selection {
  const next = cloneSelection(sel);
  next.preset = null;
  const section = sectionById(sectionId);
  if (section?.multi) {
    if (optionId === "none") {
      if (sectionId === "agents") next.agents = [];
      return normalizeSelection(next);
    }
    if (sectionId === "agents") {
      if (!isAgent(optionId)) return next;
      const has = next.agents.includes(optionId);
      next.agents = has ? next.agents.filter((agent) => agent !== optionId) : [...next.agents, optionId];
      return normalizeSelection(next);
    }
  }
  next.choices[sectionId] = optionId;
  clearLater(next, sectionId);
  const normalized = normalizeSelection(next);
  if (normalized.choices[sectionId] !== optionId) return sel;
  return normalized;
}
