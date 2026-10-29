"use client";

const steps = [
  "npx usebrix@latest init",
  "npx usebrix@latest init --frontend nextjs",
  "npx usebrix@latest init --frontend nextjs --backend fastapi",
  "npx usebrix@latest init --frontend nextjs --backend fastapi --agent cursor",
];

const pills = [
  { label: "Next.js", step: 1 },
  { label: "FastAPI", step: 2 },
  { label: "Cursor", step: 3 },
];

export function StackDemo() {
  return (
    <div
      className="relative rounded-[20px] bg-eggshell px-8 py-8 shadow-whisper"
      role="img"
      aria-label="A stack summary filling in Next.js, FastAPI, and Cursor. The command ends as npx usebrix@latest init --frontend nextjs --backend fastapi --agent cursor."
    >
      <p className="mono-label text-muted-foreground">Summary</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {pills.map((pill) => (
          <span
            key={pill.label}
            className={`brix-pill brix-pill-${pill.step} inline-flex h-8 items-center rounded-full border px-3.5 text-sm font-medium`}
          >
            {pill.label}
          </span>
        ))}
      </div>
      <div className="relative mt-6">
        <pre className="invisible font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words">
          {steps[3]}
        </pre>
        {steps.map((command, index) => (
          <pre
            key={command}
            className={`brix-cmd brix-cmd-${index} absolute inset-0 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words`}
          >
            {command}
          </pre>
        ))}
      </div>
    </div>
  );
}
