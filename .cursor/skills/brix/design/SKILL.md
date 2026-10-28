---
name: design
description: Applies the Brix design system from docs/design.md. Use when changing Brix UI, layout, theme, Tailwind classes, or when the user mentions design.md or the Brix theme.
---

# Design

Read `docs/design.md` before changing a screen.

## Before editing a screen

1. Read `docs/design.md` inside `brix` (or `brix/docs/design.md` from the monorepo).
2. Use eggshell, taupe, stone, and ink. Violet and orange stay in decoration.
3. Use the shadcn components in `components/ui`. Pills are `rounded-full`.

## Tokens

- Canvas `#fdfcfc`, cards `#f5f3f1`, borders `#ebe8e4`, text `#000000`, body `#777169`.
- Filled actions are black pills (`rounded-full bg-ink text-eggshell`). Outline pills are eggshell with a stone border.
- Violet `#0447ff` and orange `#ff4704` are decoration only. Never buttons, links, or badges.
- Display type is Inter 300 via `.display`. Do not bold it.
- Cards are `rounded-[20px] bg-taupe` with no border. The only shadow is `shadow-whisper` on the stack summary.
- No sidebar. The summary lists choices and the command, not skills.

```tsx
<button className="inline-flex h-8 items-center rounded-full bg-ink px-3.5 text-sm font-medium text-eggshell">
  Next.js
</button>
```

## Checks

- Filled actions are `bg-ink text-eggshell`. Selected stack options use the same fill.
- Cards are `rounded-[20px] bg-taupe` with no border.
- The stack summary is eggshell with `shadow-whisper` and does not list skills.
- Headlines use `.display` at weight 300. Do not bold them.
- There is no sidebar.
