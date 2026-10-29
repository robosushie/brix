import { fileURLToPath } from "node:url";
import { defineConfig } from "tsdown";

const coreEntry = fileURLToPath(new URL("../core/src/index.ts", import.meta.url));

export default defineConfig({
  entry: ["src/bin.ts"],
  format: "esm",
  platform: "node",
  outDir: "dist",
  clean: true,
  dts: false,
  alias: {
    "@brix/core": coreEntry,
  },
  banner: {
    js: "#!/usr/bin/env node",
  },
  deps: {
    onlyImport: [],
  },
});
