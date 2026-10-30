import { skillAgentMap } from "./registry.ts";
import { type AgentId } from "./types.ts";

export function expandArgv(argv: string[], agents: AgentId[]): string[][] {
  const skillAgents = agents.map((agent) => skillAgentMap[agent].skills);
  const codegraphTargets = agents.map((agent) => skillAgentMap[agent].codegraph).join(",");
  const platforms = agents.map((agent) => skillAgentMap[agent].graphify);
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
