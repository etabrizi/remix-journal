# MSW usage

- Environment gate: `USE_MSW` (default on in non-production). Set `USE_MSW=false` to disable.
- Scenario flag: `MSW_SCENARIO` accepts `default`, `empty`, or `errors`.
- Handlers live in `app/mocks/handlers.ts` and cover user and journal endpoints.
- Server bootstrap: `app/mocks/server.server.ts` starts `msw/node` once per server process with `onUnhandledRequest: "warn"`.
- Tests can import `getHandlers`/`resetJournal` from `app/mocks/handlers.ts`.
