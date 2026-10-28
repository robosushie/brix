import {
  decodeConfig,
  emptySelection,
  encodeConfig,
  evaluate,
  initCommand,
  selectOption,
  selectionFromFlags,
  type Selection,
} from "./index";

function pick(start: Selection, pairs: Array<[string, string]>): Selection {
  return pairs.reduce((sel, [section, option]) => selectOption(sel, section, option), start);
}

const empty = evaluate(emptySelection());
if (!empty.valid) throw new Error(`empty selection should be valid, got ${empty.errors.join("; ")}`);
if (empty.selection.agents.length !== 0) throw new Error("empty selection should not pick an agent");
if (initCommand(empty.selection) !== "npx brix init") throw new Error("empty command should have no flags");
for (const id of ["frontend-backend", "backend-only", "frontend-only"]) {
  if (empty.disabled[`appType.${id}`]) throw new Error(`${id} should stay enabled`);
}

const frontendOnly = selectOption(empty.selection, "appType", "frontend-only");
const frontendOnlyEval = evaluate(frontendOnly);
if (!frontendOnlyEval.disabled["backend.fastapi"]?.startsWith("Not used for")) {
  throw new Error("frontend only should disable FastAPI");
}
if (frontendOnly.choices.backend) throw new Error("frontend only should clear the backend");
if (!frontendOnlyEval.disabled["frontend.none"]) throw new Error("frontend only should require a frontend");
if (frontendOnlyEval.disabled["testing.none"]) throw new Error("none should stay available for testing");
if (frontendOnlyEval.disabled["appType.backend-only"]) throw new Error("backend only should stay enabled");

const backendOnly = selectOption(empty.selection, "appType", "backend-only");
if (!evaluate(backendOnly).disabled["frontend.nextjs"]?.startsWith("Not used for")) {
  throw new Error("backend only should disable Next.js");
}

const flask = pick(backendOnly, [
  ["backend", "flask"],
  ["package", "uv"],
]);
const flaskEval = evaluate(flask);
if (!flaskEval.disabled["runtime.node"]) throw new Error("backend-only flask should disable node");
if (flaskEval.disabled["runtime.python"]) throw new Error("backend-only flask should leave python enabled");
if (!flaskEval.disabled["package.npm"]) throw new Error("backend-only flask should disable npm");

const stack = pick(empty.selection, [
  ["appType", "frontend-backend"],
  ["frontend", "nextjs"],
  ["ui", "tailwind-shadcn"],
  ["backend", "hono"],
  ["package", "pnpm-turbo"],
  ["runtime", "node"],
  ["database", "postgres"],
  ["dbProvider", "neon"],
  ["orm", "drizzle"],
  ["auth", "better-auth"],
  ["payments", "stripe"],
  ["cache", "none"],
  ["storage", "none"],
  ["email", "none"],
  ["monitoring", "none"],
  ["testing", "vitest-playwright"],
  ["cicd", "github-actions"],
  ["deploy", "railway"],
]);
const done = evaluate(stack);
if (!done.valid) throw new Error(done.errors.join("\n"));
const ids = done.skills.map((skill) => skill.id);
for (const id of ["shadcn", "solid", "api-design", "nextjs", "hono", "drizzle"]) {
  if (!ids.includes(id)) throw new Error(`custom stack missing ${id}`);
}
for (const id of ["security-audit", "codegraph", "graphify"]) {
  if (ids.includes(id)) throw new Error(`${id} should wait for a tool selection`);
}
if (initCommand(done.selection).includes("--cache") || initCommand(done.selection).includes("--config")) {
  throw new Error(`none and the hash token should stay off the command: ${initCommand(done.selection)}`);
}
if (!initCommand(done.selection).includes("--frontend nextjs")) throw new Error("command should include the frontend flag");

const withAgents = selectOption(selectOption(done.selection, "agents", "cursor"), "agents", "codex");
const withTools = selectOption(selectOption(selectOption(withAgents, "tools", "codegraph"), "tools", "graphify"), "tools", "security-audit");
const command = initCommand(withTools);
if (!command.includes("--agent cursor --agent codex")) throw new Error(`agents should repeat: ${command}`);
if (!command.includes("--tool codegraph --tool graphify --tool security-audit")) {
  throw new Error(`tools should repeat: ${command}`);
}
const cleared = selectOption(withTools, "tools", "none");
if (cleared.tools.length !== 0 || initCommand(cleared).includes("--tool")) throw new Error("tool none should clear flags");

const tooled = evaluate(withTools);
const byId = new Map(tooled.skills.map((skill) => [skill.id, skill]));
const codegraph = byId.get("codegraph");
if (!codegraph) throw new Error("codegraph should install when selected");
if (!byId.has("graphify") || !byId.has("security-audit")) throw new Error("selected tools should resolve skills");
const codegraphOrder = ["preinstall", "install", "postinstall"] as const;
const expectedCodegraph = [
  ["npm", "install", "-g", "@colbymchenry/codegraph"],
  ["codegraph", "install", "--target={codegraphTargets}", "--location=local", "--yes"],
  ["codegraph", "init", "--yes"],
];
for (const platform of ["windows", "linux", "darwin"] as const) {
  codegraphOrder.forEach((phase, index) => {
    const commands = codegraph[phase]?.[platform] ?? [];
    const first = commands[0]?.join(" ");
    if (commands.length !== 1 || first !== expectedCodegraph[index].join(" ")) {
      throw new Error(`codegraph ${platform} ${phase} is ${first}`);
    }
  });
}
const graphify = byId.get("graphify");
if (graphify?.preinstall?.windows[0]?.[0] !== "uv") throw new Error("graphify preinstall should install with uv");
if (graphify?.postinstall?.windows[0]?.[1] !== "extract") throw new Error("graphify postinstall should build the graph");
const solid = byId.get("solid");
if ((solid?.install?.windows.length ?? 1) !== 0) throw new Error("local skills have no shell install");
for (const skill of done.skills) {
  if (skill.kind !== "upstream") continue;
  for (const platform of ["windows", "linux", "darwin"] as const) {
    for (const argv of skill.install?.[platform] ?? []) {
      if (argv[0] === "npx" && !argv.includes("--copy")) throw new Error(`${skill.id} ${platform} install is missing --copy`);
    }
  }
}

const withHono = pick(empty.selection, [
  ["appType", "frontend-backend"],
  ["frontend", "vite-react"],
  ["ui", "tailwind"],
  ["backend", "hono"],
  ["package", "pnpm-turbo"],
  ["runtime", "node"],
]);
const workers = selectOption(withHono, "runtime", "workers");
if (workers.choices.runtime !== "workers") throw new Error("hono should allow workers");
if (!evaluate(workers).disabled["backend.express"]) throw new Error("workers should disable express");

const roundTrip = decodeConfig(encodeConfig(withTools));
if (!roundTrip || roundTrip.choices.frontend !== "nextjs" || roundTrip.tools[0] !== "codegraph") {
  throw new Error("hash round-trip failed");
}

const partial = selectionFromFlags([
  ["auth", "clerk"],
  ["cache", "none"],
]);
if (partial.errors.length !== 0 || partial.selection.choices.auth !== "clerk" || partial.selection.choices.cache) {
  throw new Error(`partial flags failed: ${partial.errors.join("; ")}`);
}
if (initCommand(partial.selection) !== "npx brix init --auth clerk") throw new Error(initCommand(partial.selection));

const conflict = selectionFromFlags([
  ["appType", "backend-only"],
  ["backend", "fastapi"],
  ["orm", "drizzle"],
]);
if (conflict.errors.length === 0) throw new Error("fastapi should reject drizzle");

console.log("core smoke ok");
