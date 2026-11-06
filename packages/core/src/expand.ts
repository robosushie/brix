import { skillAgentMap } from "./registry.ts";
import { installAgents } from "./skill-roots.ts";
import { type AgentId } from "./types.ts";

export function expandArgv(argv: string[], agents: AgentId[]): string[][] {
  const selected = installAgents(agents);
  const skillAgents = selected.map((agent) => skillAgentMap[agent].skills);
  const codegraphTargets = selected
    .map((agent) => skillAgentMap[agent].codegraph)
    .filter((target) => target.length > 0)
    .join(",");
  const platforms = [
    ...new Set(selected.map((agent) => skillAgentMap[agent].graphify).filter((platform) => platform.length > 0)),
  ];
  const usesPlatform = argv.some((arg) => arg.includes("{graphifyPlatform}"));
  const fill = (platform: string) =>
    argv.flatMap((arg) => {
      if (arg === "{agents}") return skillAgents;
      if (arg.includes("{codegraphTargets}")) return [arg.replaceAll("{codegraphTargets}", codegraphTargets)];
      if (arg.includes("{graphifyPlatform}")) return [arg.replaceAll("{graphifyPlatform}", platform)];
      return [arg];
    });
  if (!usesPlatform) return [fill("")];
  return platforms.map((platform) => fill(platform));
}
