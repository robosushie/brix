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
const sceneMs = 3600;

export function StackDemo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % scenes.length);
    }, sceneMs);
    return () => window.clearInterval(timer);
  }, []);

  const scene = scenes[index];
  const command = commandFor(scene);

  return (
    <div
      className="relative cursor-default rounded-[20px] bg-eggshell px-8 py-8 shadow-whisper select-none"
      role="img"
      aria-label={`Preview of a stack summary. It plays on its own. Current command: ${command}`}
    >
      <div className="pointer-events-none">
      <div className="flex items-center justify-between gap-4">
        <p className="mono-label text-muted-foreground">Preview</p>
        <p className="mono-label flex items-center gap-2 text-ash">
          <span className="brix-demo-dot size-1.5 rounded-full bg-ink motion-safe:animate-[brix-demo-dot_1.4s_ease-in-out_infinite]" aria-hidden />
          Playing
        </p>
      </div>
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
      <div className="mt-6" aria-hidden>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-stone">
          <div key={index} className="brix-demo-progress h-full w-full origin-left rounded-full bg-ink motion-safe:animate-[brix-demo-progress_3.6s_linear]" />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {scenes.map((_, sceneIndex) => (
            <span
              key={sceneIndex}
              className={`h-1 rounded-full ${
                sceneIndex === index ? "w-6 bg-ink" : "w-1.5 bg-stone"
              }`}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
