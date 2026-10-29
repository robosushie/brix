"use client";

import { useEffect, useState } from "react";

const scenes = [
  { frontend: "nextjs", backend: "express", agent: "cursor" },
  { frontend: "vite-react", backend: "fastapi", agent: "claude-code" },
  { frontend: "sveltekit", backend: "express", agent: "codex" },
  { frontend: "nextjs", backend: "fastapi", agent: "cursor" },
  { frontend: "vite-react", backend: "express", agent: "codex" },
  { frontend: "sveltekit", backend: "fastapi", agent: "claude-code" },
];

const rows = [
  {
    label: "Frontend",
    key: "frontend" as const,
    options: [
      { id: "nextjs", label: "Next.js" },
      { id: "vite-react", label: "Vite + React" },
      { id: "sveltekit", label: "SvelteKit" },
    ],
  },
  {
    label: "Backend",
    key: "backend" as const,
    options: [
      { id: "express", label: "Express" },
      { id: "fastapi", label: "FastAPI" },
    ],
  },
  {
    label: "Coding agents",
    key: "agent" as const,
    options: [
      { id: "claude-code", label: "Claude Code" },
      { id: "codex", label: "Codex" },
      { id: "cursor", label: "Cursor" },
    ],
  },
];

function commandFor(scene: (typeof scenes)[number]) {
  return `npx usebrix@latest init --frontend ${scene.frontend} --backend ${scene.backend} --agent ${scene.agent}`;
}

const longest = scenes.map(commandFor).sort((a, b) => b.length - a.length)[0];

export function StackDemo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % scenes.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  const scene = scenes[index];
  const command = commandFor(scene);

  return (
    <div
      className="relative rounded-[20px] bg-eggshell px-8 py-8 shadow-whisper"
      role="img"
      aria-label={`Stack summary. Current command: ${command}`}
    >
      <p className="mono-label text-muted-foreground">Summary</p>
      <div className="mt-6 flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="mono-label text-ash">{row.label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {row.options.map((option) => {
                const selected = scene[row.key] === option.id;
                return (
                  <span
                    key={option.id}
                    className={`inline-flex h-8 items-center rounded-full border px-3.5 text-sm font-medium transition-colors duration-300 ${
                      selected
                        ? "border-ink bg-ink text-eggshell"
                        : "border-stone bg-eggshell text-ink"
                    }`}
                  >
                    {option.label}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-6">
        <pre className="invisible font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words">
          {longest}
        </pre>
        <pre className="absolute inset-0 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words text-ink">
          {command}
        </pre>
      </div>
    </div>
  );
}
