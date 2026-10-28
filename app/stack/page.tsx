import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { StackBuilder } from "@/components/stack/stack-builder";

export default function StackPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-eggshell">
      <SiteHeader bordered />
      <main className="flex-1">
        <StackBuilder />
      </main>
      <SiteFooter />
    </div>
  );
}
