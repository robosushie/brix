import { spawn, spawnSync } from "node:child_process";

export { expandArgv } from "@brix/core";

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
