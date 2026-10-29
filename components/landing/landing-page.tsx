import Link from "next/link";
import { Star } from "lucide-react";
import { DownloadsSection } from "@/components/landing/downloads-section";
import { StackDemo } from "@/components/landing/stack-demo";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const run = [
  {
    title: "A partial stack is enough",
    body: "Leave a question blank and it stays off the command. None does the same. App type is the one choice that sets the shape: Frontend Only drops the API, Backend Only drops the UI.",
  },
  {
    title: "The line is the whole selection",
    body: "Each answer becomes one flag. Repeat --agent once for Cursor, Claude Code, or Codex. Pass --yes to skip the confirm prompt, or --config to read a stack.json you already have.",
  },
  {
    title: "Nothing is written if the pair is illegal",
    body: "A Python-only API cannot take Node. Clerk cannot sit on Backend Only. The command exits before stack.json, the agent files, or any skill folder exists.",
  },
];

const files = [
  ["stack.json", "Choices, agents, and the registry version"],
  ["AGENTS.md", "Build instructions for the agent"],
  ["CLAUDE.md", "Pointer at AGENTS.md"],
  ["PROMPT.md", "The short prompt you paste into the agent"],
  [".agents/skills/", "Skills for Cursor and Codex"],
  [".claude/skills/", "Skills for Claude Code"],
];

const groups = [
  {
    label: "Core",
    body: "Frontend, UI, backend, package manager, runtime, database, ORM, and coding agents.",
  },
  {
    label: "Services",
    body: "Auth, payments, cache, storage, email, workflows, and testing.",
  },
  {
    label: "Cloud",
    body: "Monitoring, CI/CD, deploy, and containers.",
  },
  {
    label: "Tools",
    body: "Code index, reply style, implementation, memory, and a skill pack.",
  },
];

export function LandingPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden bg-eggshell">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <span className="brix-blob absolute -top-16 -left-16 size-72 rounded-full bg-violet-spark/25 blur-3xl" />
        <span className="brix-blob-late absolute top-40 -right-20 size-80 rounded-full bg-ember-orange/20 blur-3xl" />
        <span className="brix-blob absolute bottom-24 left-1/3 size-64 rounded-full bg-violet-spark/15 blur-3xl" />
      </div>
      <div className="relative">
      <p className="flex items-center justify-center gap-2 bg-ink px-8 py-2.5 text-center text-sm text-eggshell">
        <Star className="size-3.5 fill-eggshell" aria-hidden />
        <span>
          If you like the project, please{" "}
          <a href="https://github.com/robosushie/brix" className="underline underline-offset-2">
            give it a star
          </a>
          .
        </span>
      </p>
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-[1280px] items-center gap-10 px-8 pt-24 md:grid-cols-2">
          <div>
            <h1 className="display max-w-xl text-[48px] text-ink">Pick a stack. Copy one command.</h1>
            <p className="mt-6 max-w-md text-base leading-normal text-smoke">
              Choose the pieces of a repo: the frontend, the API, the database, and which coding agent
              should build it. Brix checks that those pieces can sit together, then writes the
              instructions into an empty folder. You paste one prompt, and the agent builds from those
              files.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/stack" className={cn(buttonVariants())}>
                Get started
              </Link>
              <Link href="/#how" className={cn(buttonVariants({ variant: "outline" }))}>
                How it works
              </Link>
            </div>
          </div>
          <div className="relative">
            <StackDemo />
          </div>
        </section>

        <DownloadsSection />

        <section id="how" className="mx-auto mt-24 max-w-[1280px] px-8">
          <h2 className="display text-[36px] text-ink">What a run does</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {run.map((item, index) => (
              <article
                key={item.title}
                className={cn("brix-rise rounded-[20px] bg-taupe px-8 py-8", index > 0 && `brix-rise-${index + 1}`)}
              >
                <h3 className="text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-normal text-smoke">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1280px] px-8">
          <h2 className="display text-[36px] text-ink">What it writes</h2>
          <p className="mt-4 max-w-xl text-base leading-normal text-smoke">
            A partial stack is valid. None never appears on the command.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {files.map(([name, role]) => (
              <li key={name} className="rounded-[20px] bg-taupe px-8 py-6">
                <p className="font-mono text-sm text-ink">{name}</p>
                <p className="mt-2 text-sm leading-normal text-smoke">{role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-24 max-w-[1280px] px-8">
          <h2 className="display text-[36px] text-ink">What you can pick</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <article key={group.label} className="rounded-[20px] bg-taupe px-8 py-8">
                <p className="mono-label text-muted-foreground">{group.label}</p>
                <p className="mt-4 text-sm leading-normal text-smoke">{group.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-xl text-base leading-normal text-smoke">
            A Python-only API cannot take Node. Clerk cannot sit on Backend Only.
          </p>
        </section>

        <section className="mx-auto mt-24 max-w-[1280px] px-8">
          <div className="rounded-[24px] bg-taupe px-8 py-12 md:px-12">
            <h2 className="display max-w-lg text-[36px] text-ink">Start from an empty folder.</h2>
            <Link href="/stack" className={cn(buttonVariants(), "mt-8")}>
              Build a stack
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      </div>
    </div>
  );
}
