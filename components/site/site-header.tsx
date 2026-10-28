import Link from "next/link";
import { Layers } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/stack", label: "Stack" },
];

export function SiteHeader({ bordered = false }: { bordered?: boolean }) {
  return (
    <header className={cn("bg-eggshell", bordered && "border-b border-stone")}>
      <div className="mx-auto flex h-[50px] max-w-[1280px] items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium tracking-normal text-ink no-underline">
            <Layers className="size-4" aria-hidden />
            Brix
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink no-underline hover:text-smoke"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/stack" className={cn(buttonVariants({ size: "sm" }))}>
          Get started
        </Link>
      </div>
    </header>
  );
}
