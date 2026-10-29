import Link from "next/link";
import { StackDemo } from "@/components/landing/stack-demo";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "One selection",
    body: "Every section is open. Later options turn off when they conflict with what you already picked.",
  },
  {
    title: "One command",
    body: "The summary copies a single init command. The skill files are written into the folder you run it in.",
  },
  {
    title: "One gate",
    body: "The agent scaffolds with official CLIs, then checks the project before it stops.",
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
      <p className="border-b border-stone bg-taupe/80 px-8 py-2 text-center text-sm text-smoke">
        If you like the project, please{" "}
        <a
          href="https://github.com/robosushie/brix"
          className="text-ink underline decoration-stone underline-offset-2"
        >
          give it a star
        </a>
        .
      </p>
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-[1280px] items-center gap-10 px-8 pt-24 md:grid-cols-2">
          <div>
            <h1 className="display max-w-xl text-[48px] text-ink">Pick a stack. Copy one command.</h1>
            <p className="mt-6 max-w-md text-base leading-normal text-smoke">
              Choose the pieces of a repo. Brix writes the instructions, and your agent builds from an
              empty folder.
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

        <section id="how" className="mx-auto mt-24 grid max-w-[1280px] gap-4 px-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={cn("brix-rise rounded-[20px] bg-taupe px-8 py-8", index > 0 && `brix-rise-${index + 1}`)}
            >
              <h2 className="display text-[32px] text-ink">{feature.title}</h2>
              <p className="mt-4 text-base leading-normal text-smoke">{feature.body}</p>
            </article>
          ))}
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
