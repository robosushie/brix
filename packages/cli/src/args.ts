import { sectionIdForFlag } from "@brix/core";

export type Flags = {
  help: boolean;
  yes: boolean;
  config: string;
  pairs: Array<[string, string]>;
};

export type ParsedArgs = {
  command: string;
  flags: Flags;
  errors: string[];
};

export function parseArgs(argv: string[]): ParsedArgs {
  const command = argv[0] && !argv[0].startsWith("-") ? argv[0] : "help";
  const start = command === argv[0] ? 1 : 0;
  const flags: Flags = { help: command === "help", yes: false, config: "", pairs: [] };
  const errors: string[] = [];
  for (let i = start; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue;
    if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg === "--yes" || arg === "-y") flags.yes = true;
    else if (arg === "--config") flags.config = argv[(i += 1)] ?? "";
    else if (arg.startsWith("--")) {
      const sectionId = sectionIdForFlag(arg.slice(2));
      const value = argv[i + 1] ?? "";
      if (!sectionId || !value || value.startsWith("-")) {
        errors.push(sectionId ? `Missing value for ${arg}.` : `Unknown argument "${arg}".`);
        if (value && !value.startsWith("-")) i += 1;
        continue;
      }
      i += 1;
      flags.pairs.push([sectionId, value]);
    } else {
      errors.push(`Unknown argument "${arg}".`);
    }
  }
  return { command, flags, errors };
}
