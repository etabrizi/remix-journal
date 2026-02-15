import type { LoaderFunctionArgs } from "@remix-run/node";
import { allEntries } from "../data/journal.server";

export async function loader(_args: LoaderFunctionArgs) {
  const body = JSON.stringify({ entries: allEntries() }, null, 2);
  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="journal.json"'
    }
  });
}
