import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { allEntries } from "../../data/journal.server";
import { pathForDate } from "../../utils/date";
import type { IndexData } from "./types";

export async function loader(_args: LoaderFunctionArgs) {
  const todayPath = pathForDate(new Date());
  const totalEntries = allEntries().length;
  return json<IndexData>({ todayPath, totalEntries });
}
