import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { pathForDate } from "../../utils/date";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const date = formData.get("date")?.toString();
  if (!date) return redirect("/");

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return redirect("/");

  const path = pathForDate(parsed);
  return redirect(path);
}
