import registryJson from "../../../registry/registry.json";
import skillsJson from "../../../registry/skills.json";

export const AGENTS = ["claude-code", "codex", "cursor"] as const;
export type AgentId = (typeof AGENTS)[number];

export type StackOption = {
  id: string;
  label: string;
  status: "proven" | "experimental";
  skill?: string;
  license?: string;
  requires?: string[];
  excludes?: string[];
};

export type StackSection = {
  id: string;
  label: string;
  multi?: boolean;
  appliesTo?: string[];
  appliesWhen?: string[];
  options: StackOption[];
};

export type Preset = {
  id: string;
  label: string;
  agents: AgentId[];
  choices: Record<string, string>;
};

export type Registry = {
  version: string;
  alwaysOnSkills: string[];
  presets: Preset[];
  sections: StackSection[];
};

export type Selection = {
  registryVersion: string;
  preset: string | null;
  agents: AgentId[];
  choices: Record<string, string>;
  notes: string;
};

export type SkillCommands = {
  windows: string[][];
  linux: string[][];
  darwin: string[][];
};

export type SkillCatalogEntry = {
  id: string;
  kind: "local" | "upstream";
  license?: string;
  when: { always?: boolean; any?: string[] };
  optional?: boolean;
  requiresCommand?: string;
  missingHelp?: string;
  preinstall?: SkillCommands;
  install?: SkillCommands;
  postinstall?: SkillCommands;
};

export type SkillRef = {
  id: string;
  license: string;
  kind: "local" | "upstream";
  optional?: boolean;
  requiresCommand?: string;
  missingHelp?: string;
  preinstall?: SkillCommands;
  install?: SkillCommands;
  postinstall?: SkillCommands;
};

export const skillAgentMap = skillsJson.agentMap as Record<
  AgentId,
  { skills: string; codegraph: string; graphify: string }
>;

const skillCatalog = skillsJson.skills as SkillCatalogEntry[];

export type Evaluation = {
  selection: Selection;
  disabled: Record<string, string>;
  skills: SkillRef[];
  valid: boolean;
  errors: string[];
};

export const registry = registryJson as Registry;

export type IndexedOption = StackOption & { sectionId: string; fullId: string };

const optionIndex = new Map<string, IndexedOption>();
for (const section of registry.sections) {
  for (const option of section.options) {
    const fullId = `${section.id}.${option.id}`;
    optionIndex.set(fullId, { ...option, sectionId: section.id, fullId });
  }
}

export function fullId(sectionId: string, optionId: string): string {
  return `${sectionId}.${optionId}`;
}

export function getOption(id: string): IndexedOption | undefined {
  return optionIndex.get(id);
}

function isAgent(value: string): value is AgentId {
  return (AGENTS as readonly string[]).includes(value);
}

function clone(sel: Selection): Selection {
  return {
    registryVersion: registry.version,
    preset: sel.preset,
    agents: [...sel.agents],
    choices: { ...sel.choices },
    notes: sel.notes ?? "",
  };
}

function selectedIds(sel: Selection): string[] {
  const ids: string[] = [];
  for (const section of registry.sections) {
    if (section.id === "agents") continue;
    const value = sel.choices[section.id];
    if (value) ids.push(fullId(section.id, value));
  }
  for (const agent of sel.agents) ids.push(fullId("agents", agent));
  return ids;
}

function sectionLabel(sectionId: string): string {
  return registry.sections.find((section) => section.id === sectionId)?.label ?? sectionId;
}

function sectionById(sectionId: string): StackSection | undefined {
  return registry.sections.find((section) => section.id === sectionId);
}

function sectionUse(section: StackSection, sel: Selection): "open" | "unused" {
  if (section.id === "appType" || section.id === "agents") return "open";
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

function previousApplicable(section: StackSection, sel: Selection): StackSection | null {
  const index = registry.sections.findIndex((item) => item.id === section.id);
  for (let i = index - 1; i >= 0; i -= 1) {
    const prev = registry.sections[i];
    if (!prev || prev.id === "agents") continue;
    if (sectionUse(prev, sel) === "unused") continue;
    return prev;
  }
  return null;
}

function unusedReason(section: StackSection, sel: Selection): string {
  const app = sel.choices.appType;
  if (section.appliesTo && app && !section.appliesTo.includes(app)) {
    return `Not used for ${choiceLabel("appType", app)}`;
  }
  return "Not used for this stack";
}

const PYTHON_BACKENDS = new Set(["fastapi", "flask", "django"]);
const NODE_BACKENDS = new Set(["hono", "express", "fastify", "next-handlers"]);

function languageGate(sectionId: string, optionId: string, sel: Selection): string | null {
  const app = sel.choices.appType;
  const backend = sel.choices.backend;
  const pythonBackend = Boolean(backend && PYTHON_BACKENDS.has(backend));
  const nodeBackend = Boolean(backend && NODE_BACKENDS.has(backend));
  const pythonOnly = app === "backend-only" && pythonBackend;
  const jsOnly = app === "frontend-only" || (app === "backend-only" && nodeBackend) || (app === "frontend-backend" && nodeBackend);
  if (sectionId === "package") {
    if (app === "frontend-only" && optionId === "uv") return "Not used for Frontend Only";
    if (pythonOnly && optionId !== "uv") return "Not used for a Python stack";
    if (app === "backend-only" && nodeBackend && optionId === "uv") return "Not used for a JavaScript stack";
  }
  if (sectionId === "runtime") {
    if (app === "frontend-only" && optionId === "python") return "Not used for Frontend Only";
    if (pythonOnly && optionId !== "python") return "Not used for a Python stack";
    if (app === "backend-only" && nodeBackend && optionId === "python") return "Not used for a JavaScript stack";
  }
  if (sectionId === "testing") {
    if (jsOnly && optionId === "pytest") return "Not used for a JavaScript stack";
    if (pythonOnly && optionId !== "pytest") return "Not used for a Python stack";
  }
  if (sectionId === "auth" && (optionId === "better-auth" || optionId === "authjs")) {
    const database = sectionById("database");
    if (database && sectionUse(database, sel) === "unused") {
      return `Not used for ${choiceLabel("appType", app ?? "")}`;
    }
  }
  if (sectionId === "auth" && optionId === "clerk") {
    const frontend = sectionById("frontend");
    if (frontend && sectionUse(frontend, sel) === "unused") {
      return `Not used for ${choiceLabel("appType", app ?? "")}`;
    }
  }
  return null;
}

export function disableReason(sectionId: string, optionId: string, sel: Selection): string | null {
  const opt = optionIndex.get(fullId(sectionId, optionId));
  if (!opt) return "Unknown option";
  if (sectionId === "appType" || sectionId === "agents") return null;

  const section = sectionById(sectionId);
  if (!section) return "Unknown option";
  if (sectionUse(section, sel) === "unused") return unusedReason(section, sel);

  const previous = previousApplicable(section, sel);
  if (previous && !sel.choices[previous.id]) return `Choose ${previous.label} first`;

  const gated = languageGate(sectionId, optionId, sel);
  if (gated) return gated;

  const selected = selectedIds(sel).filter((id) => id !== opt.fullId);

  for (const excluded of opt.excludes ?? []) {
    if (!selected.includes(excluded)) continue;
    const other = optionIndex.get(excluded);
    if (other?.sectionId === opt.sectionId) continue;
    return `Conflicts with ${other?.label ?? excluded}`;
  }

  for (const id of selected) {
    const other = optionIndex.get(id);
    if (!other || other.sectionId === opt.sectionId) continue;
    if (other.excludes?.includes(opt.fullId)) return `Conflicts with ${other.label}`;
  }

  const sectionIndex = new Map(registry.sections.map((section, index) => [section.id, index]));
  for (const req of opt.requires ?? []) {
    const required = optionIndex.get(req);
    if (!required || required.sectionId === "agents") continue;
    const current = sel.choices[required.sectionId];
    if (!current) {
      const requiredSection = sectionById(required.sectionId);
      if (requiredSection && sectionUse(requiredSection, sel) === "unused") return `Requires ${required.label}`;
      const requiredEarlier = (sectionIndex.get(required.sectionId) ?? 0) < (sectionIndex.get(opt.sectionId) ?? 0);
      if (requiredEarlier) return `Choose ${sectionLabel(required.sectionId)} first`;
      continue;
    }
    if (current !== required.id) return `Requires ${required.label}`;
  }

  return null;
}

function clearExcluded(sel: Selection, opt: IndexedOption) {
  const optIndex = registry.sections.findIndex((section) => section.id === opt.sectionId);
  for (const excluded of opt.excludes ?? []) {
    const other = optionIndex.get(excluded);
    if (!other || other.sectionId === opt.sectionId) continue;
    const otherIndex = registry.sections.findIndex((section) => section.id === other.sectionId);
    if (otherIndex >= 0 && otherIndex < optIndex) continue;
    if (other.sectionId === "agents") {
      sel.agents = sel.agents.filter((agent) => agent !== other.id);
      continue;
    }
    if (sel.choices[other.sectionId] === other.id) delete sel.choices[other.sectionId];
  }
}

export function normalizeSelection(input: Selection): Selection {
  const sel = clone(input);
  sel.agents = sel.agents.filter(isAgent);
  sel.notes = sel.notes.slice(0, 2000);

  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false;
    for (const section of registry.sections) {
      if (section.id === "agents") continue;
      if (sectionUse(section, sel) === "unused" && sel.choices[section.id]) {
        delete sel.choices[section.id];
        changed = true;
      }
    }
    for (const section of registry.sections) {
      if (section.id === "agents") continue;
      const value = sel.choices[section.id];
      if (!value) continue;
      const opt = optionIndex.get(fullId(section.id, value));
      if (!opt) {
        delete sel.choices[section.id];
        changed = true;
        continue;
      }
      const before = JSON.stringify(sel.choices);
      clearExcluded(sel, opt);
      if (JSON.stringify(sel.choices) !== before) changed = true;
      if (disableReason(section.id, sel.choices[section.id] ?? value, sel)) {
        delete sel.choices[section.id];
        changed = true;
      }
    }
    if (!changed) break;
  }

  if (sel.agents.length === 0) sel.agents = ["cursor"];
  return sel;
}

export function emptySelection(notes = ""): Selection {
  return normalizeSelection({
    registryVersion: registry.version,
    preset: null,
    agents: ["cursor"],
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
  const next = clone(sel);
  next.preset = null;
  if (sectionId === "agents") {
    if (!isAgent(optionId)) return next;
    const has = next.agents.includes(optionId);
    next.agents = has ? next.agents.filter((agent) => agent !== optionId) : [...next.agents, optionId];
    return normalizeSelection(next);
  }
  next.choices[sectionId] = optionId;
  const opt = optionIndex.get(fullId(sectionId, optionId));
  if (opt) clearExcluded(next, opt);
  const normalized = normalizeSelection(next);
  if (normalized.choices[sectionId] !== optionId) return sel;
  return normalized;
}

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
  for (const section of registry.sections) {
    if (section.id === "agents") {
      if (selection.agents.length === 0) errors.push("Pick at least one AI tool.");
      continue;
    }
    if (sectionUse(section, selection) === "unused") continue;
    const previous = previousApplicable(section, selection);
    if (previous && !selection.choices[previous.id]) continue;
    if (!selection.choices[section.id]) errors.push(`Pick ${section.label}.`);
  }
  return {
    selection,
    disabled,
    skills: resolveSkills(selection),
    valid: errors.length === 0,
    errors,
  };
}

export function encodeConfig(sel: Selection): string {
  const json = JSON.stringify(normalizeSelection(sel));
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

export function decodeConfig(hash: string): Selection | null {
  try {
    const trimmed = hash.replace(/^#/, "").trim();
    if (!trimmed) return null;
    let base64 = trimmed.replaceAll("-", "+").replaceAll("_", "/");
    while (base64.length % 4) base64 += "=";
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Partial<Selection>;
    if (!parsed || typeof parsed !== "object" || !parsed.choices) return null;
    return normalizeSelection({
      registryVersion: registry.version,
      preset: parsed.preset ?? null,
      agents: (parsed.agents ?? []).filter((agent): agent is AgentId => isAgent(String(agent))),
      choices: parsed.choices,
      notes: parsed.notes ?? "",
    });
  } catch {
    return null;
  }
}

export function initCommand(sel: Selection): string {
  return `npx brix init --config ${encodeConfig(sel)}`;
}

export function choiceLabel(sectionId: string, optionId: string): string {
  return optionIndex.get(fullId(sectionId, optionId))?.label ?? optionId;
}
