# Repository Guidelines

## Project Structure & Module Organization
This repo is a Next.js 16 App Router project for a chatbot admin dashboard.

- `app/`: routes, layouts, and API handlers (`app/api/**/route.ts`)
- `app/admin/`: admin pages (`faqs`, `chat`, `test`, `settings`, `search-vector`, `vectors`)
- `components/`: shared UI and feature components (`components/ui/*`, `components/admin/sidebar.tsx`)
- `lib/` and `hooks/`: utilities and reusable hooks
- `public/`: static assets and icons
- Root config: `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json`

Use the `@/*` import alias from `tsconfig.json` (example: `import { Button } from '@/components/ui/button'`).

## Build, Test, and Development Commands
- `npm run dev`: start local dev server at `http://localhost:3000`
- `npm run build`: create production build
- `npm run start`: run production server from the built output
- `npm run lint`: run ESLint across the project

Recommended pre-PR check:
```bash
npm run lint && npm run build
```

## Coding Style & Naming Conventions
- Language: TypeScript + React function components.
- Indentation: 2 spaces; keep semicolon usage consistent within edited files.
- Components: PascalCase names (example: `Sidebar`, `FAQsPage`).
- Routes: folder-based lowercase/kebab-case under `app/admin/*`.
- Prefer small, focused components and keep API route logic in `app/api/*`.
- Reuse existing UI primitives in `components/ui/*` before adding new ones.

## Testing Guidelines
There is currently no automated test suite configured (`package.json` has no `test` script).

- Minimum expectation for changes: `npm run lint` + manual verification in `npm run dev`.
- For UI changes, verify affected admin pages and responsive behavior.
- If you add tests, colocate with source as `*.test.ts` / `*.test.tsx` and document the run command in `package.json`.

## Commit & Pull Request Guidelines
Current history uses short, imperative commit subjects (examples: `Add README.md`, `Initial commit from v0`).

- Commit format: concise imperative subject, <= 72 chars.
- Keep commits focused by concern (UI, API route, config).
- PRs should include:
  - What changed and why
  - Screenshots/GIFs for UI updates
  - Config/env changes (for example `NEXT_PUBLIC_API_URL`, `API_KEY`)
  - Verification steps executed (`npm run lint`, `npm run build`, manual pages checked)
