import { choiceLabel, registry, type Selection } from "@brix/core";

export function renderAgents(sel: Selection): string {
  const lines = [
    "# AGENTS.md",
    "",
    "Built with Brix. This file is the source of truth for coding agents.",
    "",
    "## Stack",
    "",
  ];
  for (const section of registry.sections) {
    if (section.id === "agents") continue;
    const value = sel.choices[section.id];
    if (!value) continue;
    lines.push(`- ${section.label}: ${choiceLabel(section.id, value)}`);
  }
  lines.push(`- AI tools: ${sel.agents.join(", ")}`, "");
  if (sel.notes) lines.push("## Additional requirements", "", sel.notes, "");
  lines.push(
    "## Build",
    "",
    "1. Read `stack.json` and `PROMPT.md`.",
    "2. Scaffold with official CLIs. Apply every skill under the installed skills directory.",
    "3. Always keep security, Docker for local deps, lint, `/health`, `.env.example`, and the verification gate.",
    "4. Run the gate in `brix/verify` and fix failures before stopping.",
    "",
  );
  return lines.join("\n");
}

export function renderClaude(): string {
  return "# Claude Code\n\nFollow [AGENTS.md](./AGENTS.md). Skills for Claude Code live in `.claude/skills/`.\n";
}

export function renderPrompt(sel: Selection): string {
  return `# PROMPT.md

Read \`PROMPT.md\`, \`AGENTS.md\`, and \`stack.json\`. Build this project.

Preset: ${sel.preset ?? "custom"}
Agents: ${sel.agents.join(", ")}

Scaffold with official CLIs for the choices in \`stack.json\`. Apply the installed skills. Ship a thin vertical slice (health route, one table if a database is selected, one protected route if auth is selected, payment or email only if selected). Run the verification gate and fix failures before you stop.
${sel.notes ? `\nAdditional requirements:\n${sel.notes}\n` : ""}`;
}
