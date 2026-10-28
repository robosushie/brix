import { fullId, registry } from "./registry.ts";
import { disableReason } from "./rules.ts";
import { normalizeSelection } from "./selection.ts";
import { resolveSkills } from "./skills.ts";
import { type Evaluation, type Selection } from "./types.ts";

export function evaluate(input: Selection): Evaluation {
  const selection = normalizeSelection(input);
  const disabled: Record<string, string> = {};
  for (const section of registry.sections) {
    for (const option of section.options) {
      const reason = disableReason(section.id, option.id, selection);
      if (reason) disabled[fullId(section.id, option.id)] = reason;
    }
  }
  const errors: string[] = [];
  return {
    selection,
    disabled,
    skills: resolveSkills(selection),
    valid: errors.length === 0,
    errors,
  };
}
