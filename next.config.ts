import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@brix/core"],
  outputFileTracingIncludes: {
    "/api/skill-bodies": ["./packages/cli/skills/chunks/**/*.md"],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
