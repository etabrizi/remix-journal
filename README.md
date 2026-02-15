# Remix Journal Demo (SSR + MSW + Playwright)

A minimal Remix app demonstrating:
- SSR-only data flows with MSW for mock HTTP.
- A journal/calendar that routes by date (`/jan/29/2026`) with loader/action.
- About pages with nested child (`/about/emyr`).
- E2E coverage using Playwright (snapshots/traces ready).

## Getting started
```bash
npm install
npx playwright install   # download browsers for e2e
npm run dev
```
Visit http://localhost:3000.

## Environment flags
- `API_BASE_URL` – real API base (defaults to https://api.example.com).
- `USE_MSW` – enable mocks (default on unless NODE_ENV=production). Set `USE_MSW=false` to disable.
- `MSW_SCENARIO` – `default` | `empty` | `errors` (chooses handler set).
- `PLAYWRIGHT_BASE_URL` – base URL for e2e (defaults to http://localhost:3000).
- `PLAYWRIGHT_SKIP_SERVER` – set to `1` to stop global setup from starting `npm run dev`.

## Mocks
- Server-only MSW lives in `app/mocks/server.server.ts`; handlers in `app/mocks/handlers.ts`.
- Scenarios:
  - `default`: seeded journal entry for today + normal responses.
  - `empty`: journal GET returns 404 when no data.
  - `errors`: journal GET for 2026-01-01 returns 500 (demo failure).
- Handlers cover user (`/user`, `/user/emyr`) and journal (`/journal/:year/:month/:day`) endpoints.
- In-memory seed reset on server start; data is ephemeral.

## Routes
- `/` – date picker; redirects to per-day route; shows today link and entry count.
- `/:month/:day/:year` – journal entry view/edit (mock API first, fallback to in-memory).
- `/about` – about page (renders `<Outlet/>`).
- `/about/emyr` – profile page using MSW mock.
- `/data/raw` – downloads `journal.json`.

## Scripts
- `npm run dev` – Remix dev server.
- `npm run build` / `npm start` – production build/serve.
- `npm run test:e2e` – Playwright tests (starts dev server via global setup unless skipped).
- `npm run typecheck` – TypeScript.

## E2E tests (Playwright)
- Config: `playwright.config.ts` (snapshots in `tests/e2e/__snapshots__`, traces on first retry).
- Global setup/teardown auto-starts the dev server on port 3000 unless `PLAYWRIGHT_SKIP_SERVER` is set.
- Tests: `tests/e2e/journal.spec.ts`
  - Journal flow: pick today, save note, verify persistence.
  - About flow: navigate to `/about`.
  - Error flow: visiting `/jan/01/2026?forceError=1` forces an upstream error and captures a screenshot.
- `tests/e2e/download.spec.ts` saves a note on a separate date then verifies `/data/raw` contains it (avoids cross-test collision).
- To record new screenshots/traces, run with `PWDEBUG=console` or inspect `playwright-report/` after failures.
- Snapshots auto-update because `npm run test:e2e` runs `playwright test --update-snapshots`.

## Notes
- Journal data lives in memory (MSW and local store); restart resets it.
- Download link: `/data/raw` forces `journal.json` download.
- Client hydration enabled via `<Scripts/>` in `root.tsx`; the only client JS is Remix + your alert button.
