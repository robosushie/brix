import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("mono-label inline-flex items-center rounded-full px-2 py-0.5", {
  variants: {
    variant: {
      muted: "bg-taupe text-smoke",
      ink: "bg-ink text-eggshell",
    },
  },
  defaultVariants: { variant: "muted" },
});

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
