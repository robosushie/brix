import Link from "next/link";
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

export function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-eggshell">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-[1280px] items-end gap-10 px-8 pb-8 pt-24 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <h1 className="display max-w-xl text-[48px] text-ink">Pick a stack. Copy one command.</h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/stack" className={cn(buttonVariants())}>
                Get started
              </Link>
              <Link href="/#how" className={cn(buttonVariants({ variant: "outline" }))}>
                How it works
              </Link>
            </div>
          </div>
          <div className="relative pb-16">
            <p className="max-w-md text-base leading-normal text-smoke">
              Choose the pieces of a production repo. Brix writes the instructions, and your agent
              builds the project from an empty folder.
            </p>
            <div className="pointer-events-none absolute -bottom-2 right-6 flex gap-3" aria-hidden>
              <span className="size-16 rounded-full bg-violet-spark/80 blur-[2px]" />
              <span className="size-10 translate-y-3 rounded-full bg-ember-orange/80 blur-[2px]" />
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto mt-24 grid max-w-[1280px] gap-4 px-8 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-[20px] bg-taupe px-8 py-8">
              <h2 className="display text-[32px] text-ink">{feature.title}</h2>
              <p className="mt-4 text-base leading-normal text-smoke">{feature.body}</p>
            </article>
          ))}
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
  );
}
