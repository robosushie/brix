# Mastra

Use Mastra for TypeScript agents. Inside the TypeScript package that runs the agents, keep the framework library under `src/mastra/`.

```
src/mastra/index.ts
src/mastra/agents/
src/mastra/tools/
src/mastra/workflows/
```

Register agents in `src/mastra/index.ts`. `src/services/` holds runners that call that instance and return a result. Routes call the runners. They do not define tools or prompts, and `services/` does not copy the Mastra library. Model keys belong in `.env.example`. Do not add a second agent framework beside Mastra.
