import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-[4px] border border-stone bg-eggshell px-3 py-2.5 text-base text-ink outline-none placeholder:text-ash focus:border-ink disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
