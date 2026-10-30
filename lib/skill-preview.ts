import { expandArgv, type AgentId, type SkillRef } from "@brix/core";

export type SkillPlatform = "windows" | "linux" | "darwin";

const phases = ["preinstall", "install", "postinstall"] as const;

export function visitorPlatform(): SkillPlatform {
  if (typeof navigator === "undefined") return "linux";
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac OS|Macintosh/i.test(ua)) return "darwin";
  return "linux";
}

export function skillFilePaths(id: string, agents: AgentId[]): string[] {
  const folder = id.startsWith("brix-") ? `brix/${id.slice("brix-".length)}` : id;
  const roots: string[] = [];
  if (agents.includes("claude-code")) roots.push(".claude/skills");
  if (agents.some((agent) => agent === "codex" || agent === "cursor")) roots.push(".agents/skills");
  if (roots.length === 0) roots.push(".agents/skills");
  return roots.map((root) => `${root}/${folder}/SKILL.md`);
}

export function commandPreview(skill: SkillRef, agents: AgentId[], platform: SkillPlatform): string {
  const lines: string[] = [];
  for (const phase of phases) {
    for (const argv of skill[phase]?.[platform] ?? []) {
      for (const expanded of expandArgv(argv, agents)) {
        if (expanded.length === 0) continue;
        lines.push(expanded.join(" "));
      }
    }
  }
  return lines.join("\n");
}

export type SkillSource = {
  label: string;
  href?: string;
};

function positionalAfter(argv: string[], token: string): string | undefined {
  const at = argv.indexOf(token);
  if (at < 0) return undefined;
  for (let index = at + 1; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg || arg.startsWith("-")) continue;
    return arg;
  }
  return undefined;
}

function remember(sources: SkillSource[], seen: Set<string>, source: string, href?: string) {
  if (!source || seen.has(source)) return;
  seen.add(source);
  sources.push(href ? { label: source, href } : { label: source });
}

export function skillSources(skill: SkillRef, platform: SkillPlatform): SkillSource[] {
  const sources: SkillSource[] = [];
  const seen = new Set<string>();
  for (const phase of phases) {
    for (const argv of skill[phase]?.[platform] ?? []) {
      for (const arg of argv) {
        if (/^https?:\/\//.test(arg)) remember(sources, seen, arg, arg);
      }
      const added = positionalAfter(argv, "add");
      if (added && /^https?:\/\//.test(added)) remember(sources, seen, added, added);
      else if (added && /^[\w.-]+\/[\w.-]+$/.test(added)) {
        remember(sources, seen, added, `https://github.com/${added}`);
      } else if (added) remember(sources, seen, added);
      if (argv[0] === "npm") {
        const pkg = positionalAfter(argv, "install");
        if (pkg) remember(sources, seen, pkg, `https://www.npmjs.com/package/${pkg}`);
      }
      if (argv[0] === "uv") {
        const pkg = positionalAfter(argv, "install");
        if (pkg) remember(sources, seen, pkg);
      }
    }
  }
  return sources;
}
