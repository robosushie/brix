import {
  decodeConfig,
  emptySelection,
  encodeConfig,
  evaluate,
  initCommand,
  registry,
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
if (initCommand(empty.selection) !== "npx usebrix@latest init") throw new Error("empty command should have no flags");
for (const id of ["frontend-backend", "backend-only", "frontend-only"]) {
  if (empty.disabled[`appType.${id}`]) throw new Error(`${id} should stay enabled`);
}
if (Object.keys(empty.disabled).length !== 0) {
  throw new Error(`blank form should disable nothing, got ${Object.keys(empty.disabled).join(", ")}`);
}
const openApp = selectOption(empty.selection, "appType", "frontend-backend");
if (evaluate(openApp).disabled["dbProvider.supabase"] || evaluate(openApp).disabled["orm.django"] || evaluate(openApp).disabled["orm.mongoose"]) {
  throw new Error("unanswered questions should not disable required options");
}
const mysql = selectOption(openApp, "database", "mysql");
if (!evaluate(mysql).disabled["dbProvider.supabase"] || !evaluate(mysql).disabled["dbProvider.postgres-docker"]) {
  throw new Error("mysql should disable supabase and postgres docker");
}
const postgres = selectOption(openApp, "database", "postgres");
if (evaluate(postgres).disabled["dbProvider.supabase"] || evaluate(postgres).disabled["dbProvider.postgres-docker"]) {
  throw new Error("postgres should leave supabase and postgres docker on");
}
const sectionOrder = new Map(registry.sections.map((section, index) => [section.id, index]));
for (const section of registry.sections) {
  for (const option of section.options) {
    for (const id of [...(option.depends?.requires ?? []), ...(option.depends?.conflicts ?? [])]) {
      const otherSection = id.slice(0, id.indexOf("."));
      if ((sectionOrder.get(otherSection) ?? 0) >= (sectionOrder.get(section.id) ?? 0)) {
        throw new Error(`${section.id}.${option.id} depends on later option ${id}`);
      }
    }
  }
}
const mongo = selectOption(openApp, "database", "mongo");
const mongoEval = evaluate(mongo);
if (mongoEval.disabled["database.mongo"]) throw new Error("mongo should stay enabled");
if (!mongoEval.disabled["orm.drizzle"]) throw new Error("mongo should disable drizzle");
const mongoBadges = registry.sections
  .find((section) => section.id === "database")
  ?.options.find((option) => option.id === "mongo")?.depends;
if (mongoBadges) throw new Error("mongo should not declare dependencies");

const frontendOnly = selectOption(empty.selection, "appType", "frontend-only");
const frontendOnlyEval = evaluate(frontendOnly);
if (!frontendOnlyEval.disabled["backend.fastapi"]?.startsWith("Not used for")) {
  throw new Error("frontend only should disable FastAPI");
}
if (frontendOnly.choices.backend) throw new Error("frontend only should clear the backend");
if (frontendOnlyEval.disabled["testing.none"]) throw new Error("none should stay available for testing");
if (frontendOnlyEval.disabled["workflows.trigger"]) throw new Error("frontend only should allow Trigger.dev");
if (!frontendOnlyEval.disabled["workflows.prefect"]) throw new Error("frontend only should disable Prefect");
if (!frontendOnlyEval.disabled["package.uv"]) throw new Error("frontend only should disable uv");
if (!frontendOnlyEval.disabled["runtime.python"]) throw new Error("frontend only should disable the python runtime");
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
if (!flaskEval.disabled["workflows.trigger"]) throw new Error("python stack should disable Trigger.dev");
if (flaskEval.disabled["workflows.prefect"]) throw new Error("python stack should leave Prefect enabled");

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
for (const id of ["security-audit", "shadcn", "solid", "api-design", "nextjs", "hono", "drizzle"]) {
  if (!ids.includes(id)) throw new Error(`custom stack missing ${id}`);
}
for (const id of ["codegraph", "graphify", "gitnexus", "caveman"]) {
  if (ids.includes(id)) throw new Error(`${id} should wait for a tool selection`);
}
if (initCommand(done.selection).includes("--cache") || initCommand(done.selection).includes("--config")) {
  throw new Error(`none and the hash token should stay off the command: ${initCommand(done.selection)}`);
}
if (!initCommand(done.selection).includes("--frontend nextjs")) throw new Error("command should include the frontend flag");

const withAgents = selectOption(selectOption(done.selection, "agents", "cursor"), "agents", "codex");
const withIndex = selectOption(withAgents, "codeIndex", "codegraph");
const withStyle = selectOption(selectOption(withIndex, "replyStyle", "caveman"), "memory", "mem0");
const command = initCommand(withStyle);
if (!command.includes("--agent cursor --agent codex")) throw new Error(`agents should repeat: ${command}`);
if (!command.includes("--code-index codegraph")) throw new Error(`code index should be a flag: ${command}`);
if (!command.includes("--reply-style caveman")) throw new Error(`reply style should be a flag: ${command}`);
if (!command.includes("--memory mem0")) throw new Error(`memory should be a flag: ${command}`);
if (command.includes("--tool") || command.includes(" none")) throw new Error(`none and --tool should stay off: ${command}`);
const cleared = selectOption(withStyle, "codeIndex", "none");
if (cleared.choices.codeIndex !== "none" || initCommand(cleared).includes("--code-index")) {
  throw new Error("code index none should clear the flag");
}

const tooled = evaluate(withIndex);
const byId = new Map(tooled.skills.map((skill) => [skill.id, skill]));
const codegraph = byId.get("codegraph");
if (!codegraph) throw new Error("codegraph should install when selected");
if (byId.has("graphify")) throw new Error("graphify should wait for its own selection");
if (!byId.has("security-audit")) throw new Error("security audit should stay on");
const fastApi = evaluate(pick(emptySelection(), [["appType", "backend-only"], ["backend", "fastapi"]]));
const fastApiIds = fastApi.skills.map((skill) => skill.id);
for (const id of ["fastapi", "brix-architect", "brix-security", "brix-verify", "security-audit"]) {
  if (!fastApiIds.includes(id)) throw new Error(`fastapi selection missing ${id}`);
}
const memOnly = evaluate(selectOption(done.selection, "memory", "mem0"));
if (memOnly.skills.some((skill) => skill.id === "mem0")) throw new Error("mem0 is recorded only");
if (!done.disabled["workflows.prefect"]) throw new Error("prefect should wait for a Python stack");
const withTrigger = selectOption(done.selection, "workflows", "trigger");
const triggerEval = evaluate(withTrigger);
const trigger = triggerEval.skills.find((skill) => skill.id === "trigger");
const temporal = evaluate(selectOption(done.selection, "workflows", "temporal")).skills.find((skill) => skill.id === "temporal");
const prefect = evaluate(selectOption(flask, "workflows", "prefect")).skills.find((skill) => skill.id === "prefect");
if (trigger?.install?.windows[0]?.join(" ") !== "npx --yes skills add triggerdotdev/skills -y --copy -a {agents}") {
  throw new Error("trigger.dev should install the official skills");
}
if (temporal?.install?.windows[0]?.[4] !== "temporalio/skill-temporal-developer") {
  throw new Error("temporal should install the developer skill");
}
if (prefect?.install?.windows[0]?.[4] !== "prefecthq/prefect-mcp-server" || prefect.install.windows.length !== 2) {
  throw new Error("prefect should install the official workflows and cli skills");
}
if (!initCommand(withTrigger).includes("--workflows trigger")) throw new Error("workflows should be a flag");
if (initCommand(selectOption(withTrigger, "workflows", "none")).includes("--workflows")) {
  throw new Error("workflows none should clear the flag");
}
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
const graphifyStack = evaluate(selectOption(done.selection, "codeIndex", "graphify"));
const graphify = new Map(graphifyStack.skills.map((skill) => [skill.id, skill])).get("graphify");
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
const withPrisma = pick(empty.selection, [
  ["appType", "frontend-backend"],
  ["frontend", "vite-react"],
  ["backend", "fastify"],
  ["orm", "prisma"],
]);
if (evaluate(withPrisma).disabled["backend.fastapi"]) throw new Error("prisma below should not disable FastAPI");
const toFastApi = selectOption(withPrisma, "backend", "fastapi");
if (toFastApi.choices.backend !== "fastapi" || toFastApi.choices.orm === "prisma") {
  throw new Error("fastapi should clear prisma");
}

const roundTrip = decodeConfig(encodeConfig(withIndex));
if (!roundTrip || roundTrip.choices.frontend !== "nextjs" || roundTrip.choices.codeIndex !== "codegraph") {
  throw new Error("hash round-trip failed");
}

const partial = selectionFromFlags([
  ["auth", "clerk"],
  ["cache", "none"],
]);
if (partial.errors.length !== 0 || partial.selection.choices.auth !== "clerk" || partial.selection.choices.cache) {
  throw new Error(`partial flags failed: ${partial.errors.join("; ")}`);
}
if (initCommand(partial.selection) !== "npx usebrix@latest init --auth clerk") throw new Error(initCommand(partial.selection));

const conflict = selectionFromFlags([
  ["appType", "backend-only"],
  ["backend", "fastapi"],
  ["orm", "drizzle"],
]);
if (conflict.errors.length === 0) throw new Error("fastapi should reject drizzle");

console.log("core smoke ok");
