import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[4px] border border-stone bg-eggshell px-3 text-base text-ink outline-none placeholder:text-ash focus:border-ink disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
