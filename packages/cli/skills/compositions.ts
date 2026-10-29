export type SkillComposition = {
  name: string;
  description: string;
  parts: string[];
};

export const compositions: Record<string, SkillComposition> = {
  "brix-architect": {
    name: "architect",
    description: "Reads stack.json and scaffolds the chosen stack with official CLIs. Use when building a Brix project from PROMPT.md.",
    parts: ["brix/architect"],
  },
  "brix-security": {
    name: "security",
    description: "Applies the always-on Brix security baseline. Use on every project created with brix init.",
    parts: ["brix/security", "common/health-no-leak", "common/infra"],
  },
  "brix-verify": {
    name: "verify",
    description: "Runs the Brix verification gate before the agent stops. Use after scaffolding a stack.",
    parts: ["brix/verify"],
  },
  solid: {
    name: "solid",
    description: "Applies SOLID to modules in a Brix project. Use while splitting routes, services, and data access.",
    parts: ["solid/body"],
  },
  "api-design": {
    name: "api-design",
    description: "Designs HTTP APIs with REST rules, problem+json errors, pagination, and stateless auth. Use when the stack exposes or consumes an HTTP API.",
    parts: ["api-design/body"],
  },
  "folder-structure": {
    name: "folder-structure",
    description: "Places app code in the folders that match stack.json. Use on every project created with brix init.",
    parts: [
      "folder/rules",
      "folder/nextjs",
      "folder/vite",
      "folder/node-api",
      "folder/js-multi",
      "folder/python-api",
      "folder/django",
      "folder/infra",
    ],
  },
  "node-layout": {
    name: "node-layout",
    description: "Places a Node or Bun app in src, or in packages/web and packages/api. Use when the stack runtime is Node or Bun, or the frontend or JS API is selected.",
    parts: ["node-layout/body", "common/infra"],
  },
  "python-layout": {
    name: "python-layout",
    description: "Places a Python API in a uv src layout, with Django on the official project layout. Use when the stack runtime or backend is Python.",
    parts: ["python-layout/body", "common/infra"],
  },
  nextjs: {
    name: "nextjs",
    description: "Scaffolds a Next.js app with the official create-next-app flow. Use when stack.json frontend is nextjs.",
    parts: ["nextjs/body", "common/folder-placement"],
  },
  hono: {
    name: "hono",
    description: "Adds a Hono API beside the frontend. Use when stack.json backend is hono.",
    parts: ["hono/body", "common/health-no-leak", "common/folder-placement"],
  },
  express: {
    name: "express",
    description: "Adds an Express API. Use when stack.json backend is express.",
    parts: ["express/body", "common/health-no-leak", "common/folder-placement"],
  },
  fastify: {
    name: "fastify",
    description: "Adds a Fastify API. Use when stack.json backend is fastify.",
    parts: ["fastify/body", "common/health-no-leak", "common/folder-placement"],
  },
  fastapi: {
    name: "fastapi",
    description: "Scaffolds a FastAPI service with uv. Use when stack.json backend is fastapi.",
    parts: ["fastapi/body", "common/health-no-leak", "common/no-node-beside-python", "common/folder-placement"],
  },
  flask: {
    name: "flask",
    description: "Scaffolds a Flask API with uv. Use when stack.json backend is flask.",
    parts: ["flask/body", "common/health-no-leak", "common/no-node-beside-python", "common/folder-placement"],
  },
  django: {
    name: "django",
    description: "Scaffolds a Django project with uv. Use when stack.json backend is django.",
    parts: ["django/body", "common/database-url", "common/one-migration-path", "common/health-no-leak", "common/no-node-beside-python", "common/folder-placement"],
  },
  drizzle: {
    name: "drizzle",
    description: "Adds Drizzle ORM for the selected SQL database. Use when stack.json orm is drizzle.",
    parts: ["drizzle/body", "common/database-url", "common/pooler-vs-direct", "common/one-migration-path"],
  },
  prisma: {
    name: "prisma",
    description: "Adds Prisma for the selected SQL database. Use when stack.json orm is prisma.",
    parts: ["prisma/body", "common/database-url", "common/pooler-vs-direct", "common/one-migration-path"],
  },
  sqlalchemy: {
    name: "sqlalchemy",
    description: "Adds SQLAlchemy for a Python API. Use when stack.json orm is sqlalchemy.",
    parts: ["sqlalchemy/body", "common/database-url", "common/pooler-vs-direct", "common/one-migration-path"],
  },
  baml: {
    name: "baml",
    description: "Adds Boundary ML prompts in baml_src. Use when stack.json aiFramework is baml.",
    parts: ["baml/body"],
  },
  mastra: {
    name: "mastra",
    description: "Adds Mastra agents under src/mastra. Use when stack.json aiFramework is mastra.",
    parts: ["mastra/body"],
  },
  langchain: {
    name: "langchain",
    description: "Adds LangChain calls in src/agent. Use when stack.json aiFramework is langchain.",
    parts: ["langchain/body"],
  },
  langgraph: {
    name: "langgraph",
    description: "Adds a LangGraph graph in src/agent. Use when stack.json aiFramework is langgraph.",
    parts: ["langgraph/body"],
  },
  crewai: {
    name: "crewai",
    description: "Adds a CrewAI crew in src/agent. Use when stack.json aiFramework is crewai.",
    parts: ["crewai/body"],
  },
  "ai-sdk": {
    name: "ai-sdk",
    description: "Adds Vercel AI SDK streaming from the React app. Use when stack.json aiFramework is ai-sdk.",
    parts: ["ai-sdk/body"],
  },
  "pydantic-ai": {
    name: "pydantic-ai",
    description: "Adds a PydanticAI agent with typed results. Use when stack.json aiFramework is pydantic-ai.",
    parts: ["pydantic-ai/body"],
  },
  stripe: {
    name: "stripe",
    description: "Adds a Stripe checkout slice. Use when stack.json payments is stripe.",
    parts: ["stripe/body"],
  },
  postgres: {
    name: "postgres",
    description: "Adds Postgres for local and hosted use. Use when stack.json database is postgres.",
    parts: [
      "postgres/intro",
      "common/database-url",
      "common/pooler-vs-direct",
      "postgres/local-docker",
      "postgres/hosted",
      "postgres/tls",
      "common/one-migration-path",
      "common/health-no-leak",
    ],
  },
};
