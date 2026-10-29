import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border text-sm font-medium no-underline whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 ease-out disabled:pointer-events-none disabled:text-ash disabled:opacity-50 motion-safe:active:scale-[0.98] [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "border-ink bg-ink text-eggshell hover:border-graphite hover:bg-graphite",
        outline: "border-stone bg-eggshell text-ink hover:border-ink hover:bg-stone",
        ink: "border-ink bg-ink text-eggshell hover:border-graphite hover:bg-graphite",
        ghost: "border-transparent bg-transparent text-ink hover:bg-taupe",
        pill: "border-stone bg-eggshell text-ink motion-safe:hover:-translate-y-px hover:border-ink hover:bg-stone",
        pillSelected:
          "border-ink bg-ink text-eggshell motion-safe:hover:-translate-y-px hover:border-graphite hover:bg-graphite",
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
