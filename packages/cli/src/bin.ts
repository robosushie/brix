import { spawn, spawnSync } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { resolve } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import {
  AGENTS,
  type AgentId,
  type Selection,
  type SkillRef,
  choiceLabel,
  decodeConfig,
  evaluate,
  registry,
  skillAgentMap,
} from "@brix/core";
import { renderSkill, skillFolder } from "./skills.ts";

type Flags = {
  help: boolean;
  yes: boolean;
  config: string;
  agents: AgentId[];
};

function parseArgs(argv: string[]): { command: string; flags: Flags } {
  const command = argv[0] && !argv[0].startsWith("-") ? argv[0] : "help";
  const start = command === argv[0] ? 1 : 0;
  const flags: Flags = { help: command === "help", yes: false, config: "", agents: [] };
  for (let i = start; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue;
    if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg === "--yes" || arg === "-y") flags.yes = true;
    else if (arg === "--config") flags.config = argv[(i += 1)] ?? "";
    else if (arg === "--agent") {
      const agent = argv[(i += 1)] ?? "";
      if ((AGENTS as readonly string[]).includes(agent)) flags.agents.push(agent as AgentId);
      else {
        console.error(`Unknown agent "${agent}". Use ${AGENTS.join(", ")}.`);
        process.exit(1);
      }
    } else {
      console.error(`Unknown argument "${arg}".`);
      process.exit(1);
    }
  }
  return { command, flags };
}

function help() {
  console.log(`brix — install the skill set for a stack

  brix init [--config <hash-or-stack.json>] [--yes] [--agent ${AGENTS.join("|")}]
  brix add
  brix doctor

Inside this repo, npx brix uses the local bin. From an empty folder, npx brix works only after the package is published.
`);
}

async function loadSelection(config: string): Promise<Selection> {
  if (!config) {
    try {
      const raw = await readFile(resolve("stack.json"), "utf8");
      return JSON.parse(raw) as Selection;
    } catch {
      console.error("Pass --config <hash> from /stack, or run inside a folder that has stack.json.");
      process.exit(1);
    }
  }
  const asPath = resolve(config);
  try {
    await access(asPath);
    const raw = await readFile(asPath, "utf8");
    return JSON.parse(raw) as Selection;
  } catch {
    const decoded = decodeConfig(config);
    if (!decoded) {
      console.error("Could not read --config as a file path or stack hash.");
      process.exit(1);
    }
    return decoded;
  }
}

function renderAgents(sel: Selection): string {
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

function renderPrompt(sel: Selection): string {
  return `# PROMPT.md

Read \`PROMPT.md\`, \`AGENTS.md\`, and \`stack.json\`. Build this project.

Preset: ${sel.preset ?? "custom"}
Agents: ${sel.agents.join(", ")}

Scaffold with official CLIs for the choices in \`stack.json\`. Apply the installed skills. Ship a thin vertical slice (health route, one table if a database is selected, one protected route if auth is selected, payment or email only if selected). Run the verification gate and fix failures before you stop.
${sel.notes ? `\nAdditional requirements:\n${sel.notes}\n` : ""}`;
}

async function confirm(message: string): Promise<boolean> {
  const rl = createInterface({ input, output });
  const answer = (await rl.question(message)).trim().toLowerCase();
  rl.close();
  return answer === "y" || answer === "yes";
}

async function init(flags: Flags) {
  const selection = await loadSelection(flags.config);
  if (flags.agents.length > 0) selection.agents = flags.agents;
  const result = evaluate(selection);
  if (!result.valid) {
    console.error(result.errors.join("\n"));
    process.exit(1);
  }

  console.log("Skills to install:");
  for (const skill of result.skills) {
    console.log(`- ${skillFolder(skill.id)} (${skill.kind}, ${skill.license})`);
  }

  if (!flags.yes) {
    const ok = await confirm("Install these skills and write stack files? [y/N] ");
    if (!ok) {
      console.log("Cancelled.");
      process.exit(0);
    }
  }

  const targets = new Set<string>();
  if (result.selection.agents.includes("claude-code")) targets.add(".claude/skills");
  if (result.selection.agents.some((agent) => agent === "codex" || agent === "cursor")) {
    targets.add(".agents/skills");
  }

  const stack = {
    registryVersion: result.selection.registryVersion,
    preset: result.selection.preset,
    agents: result.selection.agents,
    choices: result.selection.choices,
    notes: result.selection.notes,
  };
  await writeFile("stack.json", `${JSON.stringify(stack, null, 2)}\n`);
  await writeFile("AGENTS.md", renderAgents(result.selection));
  await writeFile(
    "CLAUDE.md",
    "# Claude Code\n\nFollow [AGENTS.md](./AGENTS.md). Skills for Claude Code live in `.claude/skills/`.\n",
  );
  await writeFile("PROMPT.md", renderPrompt(result.selection));

  console.log(`Wrote stack.json, AGENTS.md, CLAUDE.md, PROMPT.md`);
  await installSkills(result.skills, result.selection.agents, targets);
}

function platformKey(): "windows" | "linux" | "darwin" {
  if (process.platform === "win32") return "windows";
  if (process.platform === "darwin") return "darwin";
  return "linux";
}

function commandExists(name: string): boolean {
  const checker = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(checker, [name], { stdio: "ignore", shell: process.platform === "win32" });
  return result.status === 0;
}

function expandArgv(argv: string[], agents: AgentId[]): string[][] {
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

function runArgv(argv: string[]): Promise<number> {
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

type Phase = "preinstall" | "install" | "postinstall";

function phaseCommands(skill: SkillRef, phase: Phase, platform: "windows" | "linux" | "darwin"): string[][] {
  return skill[phase]?.[platform] ?? [];
}

async function runCommands(
  skill: SkillRef,
  phase: Phase,
  agents: AgentId[],
  platform: "windows" | "linux" | "darwin",
  failures: string[],
): Promise<boolean> {
  for (const argv of phaseCommands(skill, phase, platform)) {
    for (const expanded of expandArgv(argv, agents)) {
      const label = `${skill.id} ${phase}: ${expanded.join(" ")}`;
      console.log(`\n$ ${expanded.join(" ")}`);
      try {
        const code = await runArgv(expanded);
        if (code !== 0) {
          console.error(`Command failed (${code}): ${label}`);
          if (!skill.optional) failures.push(`${label} (${code})`);
          return false;
        }
      } catch (error) {
        console.error(`Command failed: ${label}`);
        console.error(error);
        if (!skill.optional) failures.push(label);
        return false;
      }
    }
  }
  return true;
}

async function writeLocalSkill(skill: SkillRef, targets: Set<string>): Promise<void> {
  const body = renderSkill(skill.id);
  for (const target of targets) {
    const dest = resolve(target, skillFolder(skill.id));
    await mkdir(dest, { recursive: true });
    await writeFile(resolve(dest, "SKILL.md"), body);
  }
}

async function installSkills(skills: SkillRef[], agents: AgentId[], targets: Set<string>) {
  const platform = platformKey();
  const failures: string[] = [];
  let localCount = 0;

  for (const skill of skills) {
    if (skill.requiresCommand && !commandExists(skill.requiresCommand)) {
      const help = skill.missingHelp ? ` ${skill.missingHelp}` : "";
      console.warn(`Skipped ${skill.id}: ${skill.requiresCommand} is not installed.${help}`);
      if (!skill.optional) failures.push(`${skill.id}: ${skill.requiresCommand} is not installed`);
      continue;
    }

    const preinstalled = await runCommands(skill, "preinstall", agents, platform, failures);
    if (!preinstalled) continue;

    if (skill.kind === "local") {
      try {
        await writeLocalSkill(skill, targets);
        localCount += 1;
      } catch (error) {
        console.error(`Command failed: ${skill.id} install`);
        console.error(error);
        failures.push(`${skill.id} install`);
        continue;
      }
    } else {
      const installed = await runCommands(skill, "install", agents, platform, failures);
      if (!installed) continue;
    }

    await runCommands(skill, "postinstall", agents, platform, failures);
  }

  console.log(`Installed ${localCount} local skills into ${[...targets].join(", ") || "(no agent folder)"}`);
  if (failures.length === 0) return;
  console.error("\nRequired skill steps failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

async function main() {
  const { command, flags } = parseArgs(process.argv.slice(2));
  if (flags.help || command === "help") {
    help();
    return;
  }
  if (command === "init") {
    await init(flags);
    return;
  }
  if (command === "add") {
    console.log("brix add is not implemented yet. Re-run brix init with a new --config hash.");
    return;
  }
  if (command === "doctor") {
    console.log("brix doctor is not implemented yet. Follow the checklist the CLI writes into brix/verify.");
    return;
  }
  help();
  process.exitCode = 1;
}

void main();
