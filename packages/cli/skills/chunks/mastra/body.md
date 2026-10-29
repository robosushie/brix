# Mastra

Use Mastra for TypeScript agents. Inside the TypeScript package that runs the agents, keep framework code under `src/mastra/`.

```
src/mastra/index.ts
src/mastra/agents/
src/mastra/tools/
src/mastra/workflows/
```

Register agents in `src/mastra/index.ts`. Routes call that instance. They do not define tools or prompts. Model keys belong in `.env.example`. Do not add a second agent framework beside Mastra.
