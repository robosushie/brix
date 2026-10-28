import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { type AgentId, type SkillRef } from "@brix/core";
import { commandExists, expandArgv, platformKey, runArgv } from "./runner.ts";
import { renderSkill, skillFolder } from "./skills.ts";

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

export async function installSkills(skills: SkillRef[], agents: AgentId[], targets: Set<string>): Promise<string[]> {
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
  return failures;
}
