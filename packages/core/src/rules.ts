import { fullId, getOption, registry, sectionById, sectionOrder, selectedIds } from "./registry.ts";
import { type Selection, type StackRule, type StackSection } from "./types.ts";

function optionLabel(sectionId: string, optionId: string): string {
  return getOption(fullId(sectionId, optionId))?.label ?? optionId;
}

export function sectionUse(section: StackSection, sel: Selection): "open" | "unused" {
  if (section.id === "appType" || section.multi) return "open";
  const app = sel.choices.appType;
  if (section.appliesTo && app && !section.appliesTo.includes(app)) return "unused";
  if (section.appliesWhen && app) {
    const selected = new Set(selectedIds(sel));
    if (section.appliesWhen.some((id) => selected.has(id))) return "open";
    const deps = new Set(section.appliesWhen.map((id) => id.slice(0, id.indexOf("."))));
    const decided = [...deps].every((dep) => {
      const depSection = sectionById(dep);
      if (!depSection) return false;
      if (sectionUse(depSection, sel) === "unused") return true;
      return Boolean(sel.choices[dep]);
    });
    if (decided) return "unused";
  }
  return "open";
}

function unusedReason(section: StackSection, sel: Selection): string {
  const app = sel.choices.appType;
  if (section.appliesTo && app && !section.appliesTo.includes(app)) {
    return `Not used for ${optionLabel("appType", app)} Stack`;
  }
  return "Not used for this stack";
}

function chosenEarlier(otherSectionId: string, sectionId: string): boolean {
  return (sectionOrder.get(otherSectionId) ?? 0) < (sectionOrder.get(sectionId) ?? 0);
}

function ruleMatches(rule: StackRule, selected: Set<string>): boolean {
  if ((rule.whenAll ?? []).some((id) => !selected.has(id))) return false;
  const any = rule.whenAny ?? [];
  return any.length === 0 || any.some((id) => selected.has(id));
}

function activeRuleReason(targetId: string, selected: Set<string>, sectionId: string): string | null {
  for (const rule of registry.rules) {
    if (!rule.disable.includes(targetId) || !ruleMatches(rule, selected)) continue;
    const triggers = [...(rule.whenAll ?? []), ...(rule.whenAny ?? [])].filter((id) => selected.has(id));
    const earlier = triggers.some((id) => {
      const other = getOption(id);
      return other ? chosenEarlier(other.sectionId, sectionId) : false;
    });
    if (earlier) return rule.reason;
  }
  return null;
}

export function disableReason(sectionId: string, optionId: string, sel: Selection): string | null {
  const opt = getOption(fullId(sectionId, optionId));
  if (!opt) return "Unknown option";
  const section = sectionById(sectionId);
  if (!section) return "Unknown option";
  if (sectionId === "appType" || section.multi) return null;
  if (sectionUse(section, sel) === "unused") return unusedReason(section, sel);
  if (optionId === "none") return null;

  const selected = new Set(selectedIds(sel).filter((id) => id !== opt.fullId));

  for (const conflictId of opt.depends?.conflicts ?? []) {
    if (!selected.has(conflictId)) continue;
    const other = getOption(conflictId);
    if (!other || other.sectionId === opt.sectionId || !chosenEarlier(other.sectionId, opt.sectionId)) continue;
    return `Conflicts with ${other.label}`;
  }

  const requiredBySection = new Map<string, string[]>();
  for (const req of opt.depends?.requires ?? []) {
    const required = getOption(req);
    if (!required || required.sectionId === opt.sectionId) continue;
    const ids = requiredBySection.get(required.sectionId) ?? [];
    ids.push(required.id);
    requiredBySection.set(required.sectionId, ids);
  }
  for (const [requiredSectionId, ids] of requiredBySection) {
    const current = sel.choices[requiredSectionId];
    if (!current || current === "none" || ids.includes(current)) continue;
    const labels = ids.map((id) => optionLabel(requiredSectionId, id));
    return `Requires ${labels.join(" or ")}`;
  }

  return activeRuleReason(opt.fullId, selected, opt.sectionId);
}

export function optionRelations(
  sectionId: string,
  optionId: string,
  sel: Selection,
): { reason: string | null; with: string[]; without: string[] } {
  const opt = getOption(fullId(sectionId, optionId));
  const reason = disableReason(sectionId, optionId, sel);
  if (!opt) return { reason, with: [], without: [] };
  const selected = new Set(selectedIds(sel));
  const labelFor = (id: string) => getOption(id)?.label ?? id;
  return {
    reason,
    with: [],
    without: (opt.depends?.conflicts ?? []).filter((id) => selected.has(id)).map(labelFor),
  };
}
