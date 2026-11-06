import {
  decodeConfig,
  emptySelection,
  encodeConfig,
  evaluate,
  expandArgv,
  initCommand,
  registry,
  selectOption,
  selectionFromFlags,
  skillRoots,
  suggestedLayout,
  type Selection,
} from "./index";
import { parseArgs } from "../../cli/src/args.ts";
import { renderSkill, validateSkillCompositions } from "../../cli/src/skills.ts";

validateSkillCompositions(registry.skills.filter((skill) => skill.kind === "local").map((skill) => skill.id));
const postgresSkill = renderSkill("postgres");
if (!postgresSkill.startsWith("---\nname: postgres\n") || !postgresSkill.includes("DATABASE_URL") || !postgresSkill.includes("postgres-docker")) {
  throw new Error("postgres skill did not compose the shared database chunks");
}
const folderSkill = renderSkill("folder-structure");
for (const id of ["apps-src", "apps-packages", "packages", "next-app", "split", "single-src", "feature-modules"]) {
  if (!folderSkill.includes(`\`${id}\``)) throw new Error(`folder skill is missing layout ${id}`);
}
if (!folderSkill.includes("apps/web") || !folderSkill.includes("packages/web")) {
  throw new Error("folder skill is missing the apps and packages trees");
}
if (!folderSkill.includes("frontend/") || !folderSkill.includes("backend/")) {
  throw new Error("folder skill is missing the split tree");
}
const unsetLayout = renderSkill("folder-structure", null);
if (unsetLayout.includes("packages/web") || unsetLayout.includes("## Split folders") || unsetLayout.includes("## Fullstack app")) {
  throw new Error("a missing layout should not install a folder tree");
}
const splitSkill = renderSkill("folder-structure", "split");
const packagesSkill = renderSkill("folder-structure", "packages");
if (!splitSkill.includes("frontend/") || !splitSkill.includes("backend/") || splitSkill.includes("packages/web")) {
  throw new Error("split layout should install the role folders, not packages/web");
}
if (!packagesSkill.includes("packages/web") || packagesSkill.includes("frontend/") || packagesSkill.includes("backend/")) {
  throw new Error("packages layout should install packages/web and leave the split names out");
}
if (!folderSkill.includes("src/agent/") || folderSkill.includes("src/services/agent/")) {
  throw new Error("folder skill should keep the agent library out of services");
}
if (!splitSkill.includes("src/agent/") || splitSkill.includes("src/services/agent/")) {
  throw new Error("installed layout should keep the agent library out of services");
}
if (folderSkill.includes("<!-- interior:") || !folderSkill.includes("src/app/api/")) {
  throw new Error("folder skill should keep every interior and show src/app/api");
}
if (!splitSkill.includes("Vite, React") || !splitSkill.includes("src/api/routes/")) {
  throw new Error("a layout render with no frontend or backend should keep every interior");
}
const focusedSplit = renderSkill("folder-structure", "split", { frontend: "nextjs", backend: "hono" });
if (!focusedSplit.includes("src/app/") || !focusedSplit.includes("src/index.ts")) {
  throw new Error("next plus hono split should keep the Next.js and Hono interiors");
}
if (
  focusedSplit.includes("Vite, React") ||
  focusedSplit.includes("src/api/routes/") ||
  focusedSplit.includes("manage.py")
) {
  throw new Error("next plus hono split should drop the React and FastAPI interiors");
}
const featureUi = renderSkill("folder-structure", "feature-modules", { frontend: "nextjs", backend: "hono" });
if (!featureUi.includes("web/src/app/") || featureUi.includes("web/src/pages/")) {
  throw new Error("feature modules with Next.js should add the web tree and leave the Vite tree out");
}
const featureApi = renderSkill("folder-structure", "feature-modules", { backend: "hono" });
if (featureApi.includes("web/src/app/")) {
  throw new Error("feature modules without a frontend should leave the web tree out");
}
const crewSkill = renderSkill("crewai");
if (!crewSkill.includes("FastAPI")) throw new Error("crewai should name FastAPI");
const bamlSkill = renderSkill("baml");
if (!bamlSkill.includes("baml_client/") || !bamlSkill.includes(".gitignore")) {
  throw new Error("baml should gitignore the generated client");
}

function pick(start: Selection, pairs: Array<[string, string]>): Selection {
  return pairs.reduce((sel, [section, option]) => selectOption(sel, section, option), start);
}

const empty = evaluate(emptySelection());
if (!empty.valid) throw new Error(`empty selection should be valid, got ${empty.errors.join("; ")}`);
if (empty.selection.agents.length !== 0) throw new Error("empty selection should not pick an agent");
for (const id of ["brix-architect", "brix-security", "brix-verify", "solid", "api-design"]) {
  if (!empty.skills.some((skill) => skill.id === id && skill.kind === "local")) {
    throw new Error(`empty selection missing local skill ${id}`);
  }
}
if (empty.skills.some((skill) => skill.id === "folder-structure")) {
  throw new Error("an unanswered layout should not install folder structure");
}
if (skillRoots([]).join(",") !== ".agents/skills,.claude/skills") {
  throw new Error(`empty agents should install both skill folders: ${skillRoots([]).join(",")}`);
}
if (skillRoots(["cursor"]).join(",") !== ".agents/skills") throw new Error("cursor should use .agents/skills");
if (skillRoots(["codex"]).join(",") !== ".agents/skills") throw new Error("codex should use .agents/skills");
if (skillRoots(["antigravity"]).join(",") !== ".agents/skills") throw new Error("antigravity should use .agents/skills");
if (skillRoots(["claude-code"]).join(",") !== ".claude/skills") throw new Error("claude code should use .claude/skills");
const defaultAgents = expandArgv(["npx", "skills", "add", "example", "-a", "{agents}"], []);
if (defaultAgents.length !== 1) throw new Error("empty agents should be one skills command");
for (const agent of ["claude-code", "codex", "cursor", "antigravity"]) {
  if (!defaultAgents[0]?.includes(agent)) throw new Error(`empty agents should pass -a ${agent}`);
}
const defaultCodegraph = expandArgv(["codegraph", "install", "--target={codegraphTargets}"], [])[0]?.join(" ");
if (defaultCodegraph !== "codegraph install --target=claude,codex,cursor,antigravity") {
  throw new Error(`empty agents should target every codegraph agent: ${defaultCodegraph}`);
}
const defaultGraphify = expandArgv(["graphify", "install", "--platform", "{graphifyPlatform}"], []).map((argv) => argv.at(-1));
if (defaultGraphify.join(",") !== "claude,codex,cursor") {
  throw new Error(`graphify should skip antigravity: ${defaultGraphify.join(",")}`);
}
const noLayout = selectOption(empty.selection, "layout", "none");
if (noLayout.choices.layout !== "none") throw new Error("layout none should stay selected");
if (evaluate(noLayout).skills.some((skill) => skill.id === "folder-structure")) {
  throw new Error("layout none should not install folder structure");
}
if (initCommand(noLayout).includes("--layout")) throw new Error("layout none should stay off the command");
const fromAll = selectionFromFlags([["agents", "all"]]);
if (fromAll.errors.length !== 0 || fromAll.selection.agents.length !== 0) {
  throw new Error(`--agent all should mean every agent: ${fromAll.errors.join("; ")}`);
}
if (!initCommand(fromAll.selection).includes("--agent all")) throw new Error("parsed all should emit --agent all");
if (empty.selection.choices.appType !== "frontend-backend") {
  throw new Error("empty selection should default to frontend + backend");
}
if (initCommand(empty.selection) !== "npx usebrix@latest init --app-type frontend-backend --agent all") {
  throw new Error(`empty command should set app type and all agents: ${initCommand(empty.selection)}`);
}
for (const id of ["frontend-backend", "backend-only", "frontend-only"]) {
  if (empty.disabled[`appType.${id}`]) throw new Error(`${id} should stay enabled`);
}
if (!empty.disabled["package.uv"]) throw new Error("frontend + backend default should disable uv");
if (empty.disabled["layout.next-app"]) throw new Error("Next.js fullstack should stay available until a backend is chosen");
if (!empty.disabled["layout.single-src"]) throw new Error("two apps should disable the single app layout");
const allowedOnEmpty = new Set(["package.uv", "layout.single-src"]);
const unexpectedDisabled = Object.keys(empty.disabled).filter((id) => !allowedOnEmpty.has(id));
if (unexpectedDisabled.length !== 0) {
  throw new Error(`default form disabled unexpected options: ${unexpectedDisabled.join(", ")}`);
}
const openApp = empty.selection;
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
if (!frontendOnlyEval.disabled["backend.fastapi"]?.startsWith("Not used for") || !frontendOnlyEval.disabled["backend.fastapi"]?.includes("Stack")) {
  throw new Error("frontend only should disable FastAPI for Frontend Only Stack");
}
if (frontendOnly.choices.backend) throw new Error("frontend only should clear the backend");
if (!frontendOnlyEval.disabled["layout.feature-modules"]) {
  throw new Error("frontend only should disable feature modules");
}
if (frontendOnlyEval.disabled["testing.none"]) throw new Error("none should stay available for testing");
if (frontendOnlyEval.disabled["workflows.trigger"]) throw new Error("frontend only should allow Trigger.dev");
if (!frontendOnlyEval.disabled["workflows.prefect"]) throw new Error("frontend only should disable Prefect");
if (!frontendOnlyEval.disabled["package.uv"]) throw new Error("frontend only should disable uv");
if (frontendOnlyEval.disabled["frontendRuntime.node"]) throw new Error("frontend only should leave the frontend runtime enabled");
if (!frontendOnlyEval.disabled["backendRuntime.node"]?.startsWith("Not used for") || !frontendOnlyEval.disabled["backendRuntime.node"]?.includes("Stack")) {
  throw new Error("frontend only should unused the backend runtime for Frontend Only Stack");
}
if (frontendOnlyEval.disabled["appType.backend-only"]) throw new Error("backend only should stay enabled");
if (frontendOnlyEval.skills.some((skill) => skill.id === "api-design")) {
  throw new Error("frontend only should not install api design");
}
const viteOnly = evaluate(pick(frontendOnly, [["frontend", "vite-react"]]));
const viteIds = viteOnly.skills.map((skill) => skill.id);
if (!viteIds.includes("node-layout")) throw new Error("vite frontend should install the node layout");
if (viteIds.includes("api-design") || viteIds.includes("python-layout")) {
  throw new Error("vite frontend should not install api design or the python layout");
}
if (viteIds.includes("crewai") || !viteOnly.disabled["aiFramework.crewai"]) {
  throw new Error("a frontend-only stack should disable CrewAI");
}

const backendOnly = selectOption(empty.selection, "appType", "backend-only");
if (!evaluate(backendOnly).disabled["frontend.nextjs"]?.startsWith("Not used for") || !evaluate(backendOnly).disabled["frontend.nextjs"]?.includes("Stack")) {
  throw new Error("backend only should disable Next.js for Backend Only Stack");
}

const flask = pick(backendOnly, [
  ["backend", "flask"],
  ["package", "uv"],
]);
const flaskEval = evaluate(flask);
if (!flaskEval.disabled["backendRuntime.node"]?.startsWith("Conflicts with")) {
  throw new Error("backend-only flask should disable the JS backend runtime");
}
if (!flaskEval.disabled["frontendRuntime.node"]?.startsWith("Not used for") || !flaskEval.disabled["frontendRuntime.node"]?.includes("Stack")) {
  throw new Error("backend-only flask should unused the frontend runtime for Backend Only Stack");
}
if (!flaskEval.disabled["package.npm"]) throw new Error("backend-only flask should disable npm");
if (!flaskEval.disabled["package.pnpm"] || !flaskEval.disabled["package.bun"]) {
  throw new Error("backend-only flask should disable pnpm and bun");
}
if (flaskEval.disabled["package.uv"]) throw new Error("backend-only flask should leave uv enabled");
if (!flaskEval.disabled["turbo.turborepo"]) throw new Error("backend-only flask should disable Turborepo");
if (selectOption(flask, "turbo", "turborepo").choices.turbo) {
  throw new Error("python-only should refuse Turborepo");
}
if (!flaskEval.disabled["workflows.trigger"]) throw new Error("python stack should disable Trigger.dev");
if (flaskEval.disabled["workflows.prefect"]) throw new Error("python stack should leave Prefect enabled");

const stack = pick(empty.selection, [
  ["appType", "frontend-backend"],
  ["frontend", "nextjs"],
  ["ui", "tailwind-shadcn"],
  ["backend", "hono"],
  ["frontendRuntime", "node"],
  ["backendRuntime", "node"],
  ["package", "pnpm"],
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
for (const id of ["security-audit", "shadcn", "solid", "api-design", "node-layout", "nextjs", "hono", "drizzle"]) {
  if (!ids.includes(id)) throw new Error(`custom stack missing ${id}`);
}
if (ids.includes("folder-structure")) throw new Error("an unpicked layout should not install folder structure");
if (ids.includes("python-layout")) throw new Error("a node API should not install the python layout");
for (const id of ["codegraph", "graphify", "gitnexus", "caveman"]) {
  if (ids.includes(id)) throw new Error(`${id} should wait for a tool selection`);
}
if (initCommand(done.selection).includes("--cache") || initCommand(done.selection).includes("--config")) {
  throw new Error(`none and the hash token should stay off the command: ${initCommand(done.selection)}`);
}
if (!initCommand(done.selection).includes("--frontend nextjs")) throw new Error("command should include the frontend flag");
if (initCommand(done.selection).includes("--layout")) throw new Error("an unpicked layout should stay off the command");
if (suggestedLayout(done.selection) !== "packages") throw new Error("next plus hono should suggest packages");
if (done.disabled["layout.next-app"] !== "A separate API needs its own folder") {
  throw new Error("a selected API should disable the Next.js fullstack layout");
}
const nextFullstack = pick(empty.selection, [["frontend", "nextjs"], ["layout", "next-app"]]);
if (nextFullstack.choices.layout !== "next-app") {
  throw new Error("Next.js fullstack should stay selectable before a backend is chosen");
}
if (selectOption(nextFullstack, "backend", "hono").choices.layout) {
  throw new Error("a separate API should clear the Next.js fullstack layout");
}
if (suggestedLayout(pick(empty.selection, [["frontend", "nextjs"]])) !== "next-app") {
  throw new Error("Next.js with no separate API should suggest the fullstack layout");
}
const withLayout = selectOption(done.selection, "layout", "split");
if (withLayout.choices.layout !== "split" || !initCommand(withLayout).includes("--layout split")) {
  throw new Error("a chosen layout should be a flag");
}
if (!evaluate(withLayout).skills.some((skill) => skill.id === "folder-structure")) {
  throw new Error("a chosen layout should install folder structure");
}
const splitInstalled = renderSkill("folder-structure", withLayout.choices.layout);
if (!splitInstalled.includes("frontend/") || splitInstalled.includes("packages/web")) {
  throw new Error("next plus hono with split should install the split tree");
}
const pickedPackages = selectOption(done.selection, "layout", "packages");
const clearedLayout = selectOption(pickedPackages, "backend", "fastapi");
if (clearedLayout.choices.layout) throw new Error("a python backend should clear the packages layout");
if (suggestedLayout(selectOption(done.selection, "turbo", "turborepo")) !== "apps-packages") {
  throw new Error("turborepo should suggest apps and packages");
}
if (suggestedLayout(frontendOnly) !== "single-src") throw new Error("frontend only should suggest single source");
if (suggestedLayout(pick(frontendOnly, [["frontend", "nextjs"]])) !== "next-app") {
  throw new Error("frontend only next should suggest the Next.js app layout");
}
if (suggestedLayout(backendOnly) !== "single-src") throw new Error("backend only should suggest single source");
const doneCommand = initCommand(done.selection);
if (!doneCommand.includes("--frontend-runtime node") || !doneCommand.includes("--backend-runtime node") || !doneCommand.includes("--package pnpm")) {
  throw new Error(`runtimes and package should be on the command: ${doneCommand}`);
}
if (doneCommand.indexOf("--frontend-runtime") > doneCommand.indexOf("--package") || doneCommand.indexOf("--backend-runtime") > doneCommand.indexOf("--package")) {
  throw new Error(`runtimes should precede the package manager: ${doneCommand}`);
}
const withTurbo = selectOption(done.selection, "turbo", "turborepo");
const turboCommand = initCommand(withTurbo);
if (!turboCommand.includes("--package pnpm --turbo") || turboCommand.includes("--turbo turborepo")) {
  throw new Error(`Turborepo should be a bare flag: ${turboCommand}`);
}
const workspacesOnly = selectOption(withTurbo, "turbo", "workspaces");
if (workspacesOnly.choices.turbo !== "workspaces" || initCommand(workspacesOnly).includes("--turbo")) {
  throw new Error("workspaces only should omit --turbo");
}
const parsedTurbo = parseArgs(["init", "--package", "pnpm", "--turbo", "--frontend-runtime", "node"]);
const turboPair = parsedTurbo.flags.pairs.find((pair) => pair[0] === "turbo");
if (
  parsedTurbo.errors.length !== 0 ||
  turboPair?.[1] !== "turborepo" ||
  !parsedTurbo.flags.pairs.some((pair) => pair[0] === "frontendRuntime" && pair[1] === "node")
) {
  throw new Error(`bare --turbo should parse: ${parsedTurbo.errors.join("; ")} ${JSON.stringify(parsedTurbo.flags.pairs)}`);
}
const mixed = evaluate(pick(empty.selection, [
  ["appType", "frontend-backend"],
  ["frontend", "nextjs"],
  ["backend", "fastapi"],
]));
if (!mixed.disabled["package.uv"]) throw new Error("frontend plus fastapi should disable uv");
if (mixed.disabled["package.npm"]) throw new Error("frontend plus fastapi should leave npm enabled");
if (!mixed.disabled["backendRuntime.node"]?.startsWith("Conflicts with")) {
  throw new Error("frontend plus fastapi should disable the JS backend runtime");
}
if (mixed.disabled["frontendRuntime.node"]) throw new Error("frontend plus fastapi should leave the frontend runtime enabled");
if (!mixed.disabled["layout.packages"] || !mixed.disabled["layout.apps-packages"]) {
  throw new Error("frontend plus fastapi should disable npm workspace layouts");
}
if (mixed.disabled["layout.apps-src"] || mixed.disabled["layout.split"]) {
  throw new Error("frontend plus fastapi should leave apps and source, and the split layout, enabled");
}
if (!mixed.disabled["layout.feature-modules"]) {
  throw new Error("a python API should disable feature modules");
}
if (selectOption(mixed.selection, "layout", "packages").choices.layout === "packages") {
  throw new Error("fastapi should refuse the packages layout");
}
if (suggestedLayout(mixed.selection) !== "apps-src") {
  throw new Error("frontend plus fastapi should suggest apps and source");
}

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
for (const id of ["fastapi", "python-layout", "api-design", "brix-architect", "brix-security", "brix-verify", "security-audit"]) {
  if (!fastApiIds.includes(id)) throw new Error(`fastapi selection missing ${id}`);
}
if (fastApiIds.includes("folder-structure")) throw new Error("fastapi without a layout should not install folder structure");
if (fastApiIds.includes("node-layout")) throw new Error("fastapi should not install the node layout");
if (fastApiIds.includes("mastra") || !fastApi.disabled["aiFramework.mastra"]) {
  throw new Error("fastapi should disable Mastra");
}
const withBaml = selectOption(fastApi.selection, "aiFramework", "baml");
if (!initCommand(withBaml).includes("--ai-framework baml")) throw new Error("ai framework should be a flag");
if (!evaluate(withBaml).skills.some((skill) => skill.id === "baml")) throw new Error("baml should install when selected");
if (selectOption(fastApi.selection, "aiFramework", "mastra").choices.aiFramework === "mastra") {
  throw new Error("fastapi should refuse Mastra");
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
  ["frontendRuntime", "node"],
  ["backendRuntime", "node"],
  ["package", "pnpm"],
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
if (initCommand(partial.selection) !== "npx usebrix@latest init --agent all --auth clerk") throw new Error(initCommand(partial.selection));

const conflict = selectionFromFlags([
  ["appType", "backend-only"],
  ["backend", "fastapi"],
  ["orm", "drizzle"],
]);
if (conflict.errors.length === 0) throw new Error("fastapi should reject drizzle");

console.log("core smoke ok");
