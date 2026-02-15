import * as msw from "msw";
import type { JournalEntry } from "../data/journal.server";
import { numberToMonthSlug, toKey } from "../utils/date";

const { rest } = msw;

// Seed data for demos
const seedEntries: Record<string, JournalEntry> = {};
(function seed() {
  const today = new Date();
  const key = toKey(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate());
  seedEntries[key] = {
    dateKey: key,
    notes: "",
    updatedAt: new Date().toISOString()
  };
})();

let journalStore: Record<string, JournalEntry> = { ...seedEntries };

function makeJournalHandlers({ scenario }: { scenario: string }) {
  const failDateKey = toKey(2026, 1, 1); // example failure date for demo

  return [
    rest.get("https://api.example.com/journal/:year/:month/:day", (req, res, ctx) => {
      const { year, month, day } = req.params as Record<string, string>;
      const dateKey = toKey(Number(year), Number(month), Number(day));
      const forceError = req.url.searchParams.get("forceError") === "1";

      if (forceError || (scenario === "errors" && dateKey === failDateKey)) {
        return res(ctx.status(500), ctx.json({ message: "Forced error for demo" }));
      }

      const entry = journalStore[dateKey];
      if (!entry) {
        if (scenario === "empty") return res(ctx.status(404));
        return res(ctx.status(200), ctx.json({ dateKey, notes: "", updatedAt: "" }));
      }
      return res(ctx.status(200), ctx.json(entry));
    }),

    rest.post("https://api.example.com/journal/:year/:month/:day", async (req, res, ctx) => {
      const { year, month, day } = req.params as Record<string, string>;
      const dateKey = toKey(Number(year), Number(month), Number(day));
      const body = (await req.json()) as { notes?: string };
      const entry: JournalEntry = {
        dateKey,
        notes: body.notes ?? "",
        updatedAt: new Date().toISOString()
      };
      journalStore[dateKey] = entry;
      return res(ctx.status(200), ctx.json(entry));
    }),

    // Dev server health ping (Remix dev on 3001); keep it quiet
    rest.post("http://localhost:3001/ping", (_req, res, ctx) => {
      return res(ctx.status(200), ctx.text("ok"));
    })
  ];
}

export function getHandlers(scenario: string) {
  return makeJournalHandlers({ scenario });
}

export function resetJournal() {
  journalStore = { ...seedEntries };
}
