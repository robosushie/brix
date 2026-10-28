# Registry

Shared by the site and the CLI via `packages/core`.

## `registry/registry.json`

```ts
{
  version: string;            // e.g. "2026.10.2"
  alwaysOnSkills: string[];   // installed for every stack
  presets: {
    id: string;
    label: string;
    choices: Record<string, string>;
    agents: ("claude-code" | "codex" | "cursor")[];
  }[];
  sections: {
    id: string;
    label: string;
    multi?: boolean;          // only "agents"
    options: {
      id: string;
      label: string;
      skill?: string;         // folder under skills/
      license?: string;
      status: "proven" | "experimental";
      requires?: string[];    // "section.option"
      excludes?: string[];
    }[];
  }[];
}
```

Full option id is `sectionId.optionId` (example: `frontend.nextjs`).

`choices` in a selection stores the short option id per section. Multi sections store an array (`agents`).

## `registry/rules.json`

Narrative list of v1 constraints (R1–R14). The evaluator enforces them through each option’s `requires` and `excludes`, which stay in `registry.json` so the UI and CLI cannot drift.

## `stack.json`

Written by `brix init`:

| Field | Meaning |
|-------|---------|
| `registryVersion` | Registry version used to resolve skills |
| `preset` | Preset id or `null` |
| `agents` | Agent ids to install for |
| `choices` | Section id → option id |
| `notes` | Advanced free text |

## Hash

`/stack` encodes the selection as URL-safe base64 JSON in the location hash. `decodeConfig` accepts that hash or a parsed `stack.json`.

## Skill resolution

`registry/skills.json` is the catalog. Each entry is `local` (a template in `packages/cli/src/skills.ts`) or `upstream` (an install command for Windows, Linux, and macOS). `when.always` installs on every stack. `when.any` installs when one of those `section.option` ids is selected. A choice does not auto-fill later sections; it disables conflicts and clears a choice that became illegal.
