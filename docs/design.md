# Brix — Design System

> Warm cream editorial. Eggshell paper, black ink, whisper headlines. Violet and orange only inside decoration.

**Theme:** light

Display type is Inter 300 (stand-in for a whisper display cut) at 32–48px with `-0.02em` tracking. Everything else is Inter 400, or 500 on buttons and emphasis. Geist Mono is only for the command and short meta labels.

## Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Eggshell | `#fdfcfc` | `--color-eggshell` | Page canvas and outline-button fill |
| Warm taupe | `#f5f3f1` | `--color-taupe` | Section cards |
| Stone | `#ebe8e4` | `--color-stone` | Hairline borders and dividers |
| Ink | `#000000` | `--color-ink` | Text and filled buttons |
| Graphite | `#44403b` | `--color-graphite` | Strong secondary text |
| Smoke | `#777169` | `--color-smoke` | Body copy |
| Ash | `#a59f97` | `--color-ash` | Captions and disabled labels |
| Violet spark | `#0447ff` | `--color-violet-spark` | Decorative marks only |
| Ember orange | `#ff4704` | `--color-ember-orange` | Decorative marks only |

Filled actions are ink. Outline actions are eggshell with a stone border. Do not use violet or orange on buttons, links, badges, or borders.

## Type

| Role | Weight | Size | Line height | Tracking |
|------|--------|------|-------------|----------|
| Caption | 400 | 10px | 1.6 | normal |
| Body sm | 400 | 14px | 1.5 | 0.01em |
| Body | 400 | 16px | 1.5 | 0.01em |
| Heading sm | 300 | 32px | 1.13 | -0.02em |
| Heading | 300 | 36px | 1.17 | -0.02em |
| Display | 300 | 48px | 1.08 | -0.02em |

Class `.display` is the headline style. Do not set display type bolder than 300.

## Shape and elevation

| Element | Value |
|---------|-------|
| Buttons and tags | `rounded-full` |
| Cards | 20px |
| Large feature blocks | 24px |
| Inputs | 4px |
| Page width | 1280px |
| Section gap | 96px |
| Card padding | 32px |

The only shadow is `shadow-whisper`:

`0 0 1px rgb(0 0 0 / 0.4), 0 1px 1px rgb(0 0 0 / 0.04), 0 2px 4px rgb(0 0 0 / 0.04)`

Use it on the stack summary. Feature cards stay flat.

## Components

- **Filled pill:** `rounded-full bg-ink text-eggshell text-sm font-medium`
- **Outline pill:** `rounded-full border border-stone bg-eggshell text-ink text-sm font-medium`
- **Selected stack option:** filled ink pill
- **Idle stack option:** outline pill. Disabled options use ash text.
- **Taupe card:** `rounded-[20px] bg-taupe`, no border, no shadow
- **Summary card:** eggshell fill plus `shadow-whisper`. Lists chosen options and the copy command. It does not list skills.
- **Mark:** Lucide `Layers` in ink, next to the wordmark

## Do

- Keep the canvas eggshell, never pure white.
- Keep buttons fully rounded.
- Pair a black pill with an eggshell outline pill.
- Leave violet and orange inside the hero decoration only.

## Don't

- Do not bold display headlines.
- Do not color interactive controls with violet or orange.
- Do not add a large blurred drop shadow.
- Do not use sharp corners on cards.
- Do not put a skill list in the stack summary.

Tokens live in `styles/theme.css` and `app/globals.css`. Shadcn components live in `components/ui`.
