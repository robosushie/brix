import { AGENTS, type AgentId } from "./types.ts";

const sharedRoot = ".agents/skills";
const claudeRoot = ".claude/skills";

export function installAgents(agents: AgentId[]): AgentId[] {
  return agents.length > 0 ? agents : [...AGENTS];
}

export function skillRoots(agents: AgentId[]): string[] {
  const selected = installAgents(agents);
  const roots: string[] = [];
  if (selected.some((agent) => agent !== "claude-code")) roots.push(sharedRoot);
  if (selected.includes("claude-code")) roots.push(claudeRoot);
  return roots;
}
