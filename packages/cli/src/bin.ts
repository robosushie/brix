import { access, readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { resolve } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { evaluate, selectionFromFlags, type Selection } from "@brix/core";
import { parseArgs, type Flags } from "./args.ts";
import { renderAgents, renderClaude, renderPrompt } from "./documents.ts";
import { installSkills } from "./install.ts";
import { skillFolder } from "./skills.ts";

function help() {
  console.log(`brix — install the skill set for a stack

  brix init [--yes] [--app-type <id>] [--frontend <id>] [--agent <id>] [--code-index <id>] ...
  brix init --config <stack.json>
  brix add
  brix doctor

Repeat --agent once per coding agent. A missing flag, or None, adds nothing.
Inside this repo, pnpm brix runs the local build. From an empty folder: npx usebrix@latest init
`);
}

async function readStackFile(path: string): Promise<Selection> {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as Selection;
}

async function loadSelection(flags: Flags): Promise<Selection> {
  if (flags.pairs.length > 0 && flags.config) {
    console.error("Pass section flags or --config, not both.");
    process.exit(1);
  }
  if (flags.pairs.length > 0) {
    const parsed = selectionFromFlags(flags.pairs);
    if (parsed.errors.length > 0) {
      console.error(parsed.errors.join("\n"));
      process.exit(1);
    }
    return parsed.selection;
  }
  if (flags.config) {
    const asPath = resolve(flags.config);
    try {
      await access(asPath);
      return await readStackFile(asPath);
    } catch {
      console.error("Could not read --config as a stack.json path.");
      process.exit(1);
    }
  }
  try {
    return await readStackFile(resolve("stack.json"));
  } catch {
    console.error("Pass section flags from /stack, or run inside a folder that has stack.json.");
    process.exit(1);
  }
}

async function confirm(message: string): Promise<boolean> {
  const rl = createInterface({ input, output });
  const answer = (await rl.question(message)).trim().toLowerCase();
  rl.close();
  return answer === "y" || answer === "yes";
}

async function init(flags: Flags) {
  const selection = await loadSelection(flags);
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
  await writeFile("CLAUDE.md", renderClaude());
  await writeFile("PROMPT.md", renderPrompt(result.selection));

  console.log(`Wrote stack.json, AGENTS.md, CLAUDE.md, PROMPT.md`);
  const failures = await installSkills(result.skills, result.selection.agents, targets);
  if (failures.length === 0) return;
  console.error("\nRequired skill steps failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

async function main() {
  const { command, flags, errors } = parseArgs(process.argv.slice(2));
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
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
