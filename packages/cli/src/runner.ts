import { spawn, spawnSync } from "node:child_process";
import { skillAgentMap, type AgentId } from "@brix/core";

export function platformKey(): "windows" | "linux" | "darwin" {
  if (process.platform === "win32") return "windows";
  if (process.platform === "darwin") return "darwin";
  return "linux";
}

export function commandExists(name: string): boolean {
  const checker = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(checker, [name], { stdio: "ignore", shell: process.platform === "win32" });
  return result.status === 0;
}

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

export function runArgv(argv: string[]): Promise<number> {
  const [cmd, ...args] = argv;
  if (!cmd) return Promise.resolve(1);
  const command = process.platform === "win32" && cmd === "npx" ? "npx.cmd" : cmd;
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => resolvePromise(code ?? 1));
  });
}
