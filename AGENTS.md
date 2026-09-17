<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Keep agent context small

- Grep `src/i18n/strings.ts` / `extra.ts` / `pages.ts` for a key. Do not load those files whole.
- Do not read `src/data/footballPlayerRows.ts`, `src/data/facts/all.json`, `src/data/languageData.ts`, `src/data/passportI18n.json`.
- Known `wikiFile` portraits: render Commons CDN thumbs immediately. Do not add live Commons search in UI.
