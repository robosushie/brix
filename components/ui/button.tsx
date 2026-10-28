import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-medium no-underline whitespace-nowrap transition-opacity disabled:pointer-events-none disabled:text-ash disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "border-ink bg-ink text-eggshell hover:opacity-80",
        outline: "border-stone bg-eggshell text-ink hover:bg-taupe",
        ink: "border-ink bg-ink text-eggshell hover:opacity-80",
        ghost: "border-transparent bg-transparent text-ink hover:bg-taupe",
        pill: "border-stone bg-eggshell text-ink hover:bg-taupe",
        pillSelected: "border-ink bg-ink text-eggshell hover:opacity-90",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3.5",
        md: "h-9 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
