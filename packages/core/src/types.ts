export const AGENTS = ["claude-code", "codex", "cursor"] as const;
export type AgentId = (typeof AGENTS)[number];

/** One-way. Ids must be from an earlier section. Selecting one of them turns this option off. */
export type StackDepends = {
  requires?: string[];
  conflicts?: string[];
};

export type StackOption = {
  id: string;
  label: string;
  status: "proven" | "experimental";
  skill?: string;
  license?: string;
  description?: string;
  depends?: StackDepends;
};

export type StackRule = {
  id: string;
  reason: string;
  whenAll?: string[];
  whenAny?: string[];
  disable: string[];
};

export type StackSection = {
  id: string;
  label: string;
  group?: string;
  multi?: boolean;
  appliesTo?: string[];
  appliesWhen?: string[];
  options: StackOption[];
};

export type StackGroup = {
  id: string;
  label: string;
};

export type Preset = {
  id: string;
  label: string;
  agents: AgentId[];
  choices: Record<string, string>;
};

export type AgentTargets = {
  skills: string;
  codegraph: string;
  graphify: string;
};

export type Registry = {
  version: string;
  agents: Record<AgentId, AgentTargets>;
  presets: Preset[];
  groups: StackGroup[];
  rules: StackRule[];
  sections: StackSection[];
  skills: SkillCatalogEntry[];
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
  name?: string;
  description?: string;
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

export type Evaluation = {
  selection: Selection;
  disabled: Record<string, string>;
  skills: SkillRef[];
  valid: boolean;
  errors: string[];
};

export type IndexedOption = StackOption & { sectionId: string; fullId: string };

export function isAgent(value: string): value is AgentId {
  return (AGENTS as readonly string[]).includes(value);
}
