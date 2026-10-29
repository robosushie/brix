# Node layout

The `folder-structure` skill is installed on every stack and owns the tree. Read `stack.json` and apply only the matching section there: Next.js with no separate API, a Vite or SvelteKit app, one Node API, or more than one JavaScript deployable.

Do not describe a second tree in this skill. A Python API beside a JavaScript frontend lives in `backend/` and is not an npm workspace member.
