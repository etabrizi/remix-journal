import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, isRouteErrorResponse, useActionData, useLoaderData, useRouteError } from "@remix-run/react";
import { ensureMockServer } from "../mocks/server.server";
import { getEntry, upsertEntry } from "../data/journal.server";
import { keyFromParams, monthSlugToNumber } from "../utils/date";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { month, day, year } = params;
  const dateKey = month && day && year ? keyFromParams(month, day, year) : null;
  if (!dateKey) throw new Response("Invalid date", { status: 400 });
  // If using MSW, also request remote mock to keep behavior consistent
  ensureMockServer();
  const apiMonth = monthSlugToNumber(month!);
  if (!apiMonth) throw new Response("Invalid month", { status: 400 });

  const API_BASE = process.env.API_BASE_URL ?? "https://api.example.com";
  const forceError = new URL(request.url).searchParams.get("forceError") === "1";
  if (forceError) {
    throw new Response("Upstream journal error", { status: 500 });
  }
  try {
    const res = await fetch(
      `${API_BASE}/journal/${year}/${apiMonth}/${day}${forceError ? "?forceError=1" : ""}`
    );
    if (res.status >= 500) throw new Response("Upstream journal error", { status: res.status });
    if (res.status === 404) throw new Response("Entry not found", { status: 404 });
    if (res.ok) {
      const remote = await res.json();
      // Keep local store in sync so /data/raw includes these entries
      upsertEntry(dateKey, remote.notes ?? "");
      return json({ entry: remote });
    }
  } catch (err) {
    if (err instanceof Response) throw err;
    // fall through to in-memory for network errors
  }

  const entry = getEntry(dateKey) ?? { dateKey, notes: "", updatedAt: "" };
  return json({ entry });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { month, day, year } = params;
  const dateKey = month && day && year ? keyFromParams(month, day, year) : null;
  if (!dateKey) throw new Response("Invalid date", { status: 400 });

  const formData = await request.formData();
  const notes = formData.get("notes")?.toString() ?? "";

  ensureMockServer();
  const apiMonth = monthSlugToNumber(month!);
  if (!apiMonth) throw new Response("Invalid month", { status: 400 });
  const API_BASE = process.env.API_BASE_URL ?? "https://api.example.com";

  try {
    const res = await fetch(`${API_BASE}/journal/${year}/${apiMonth}/${day}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes })
    });
    if (res.ok) {
      const remote = await res.json();
      upsertEntry(dateKey, remote.notes ?? notes);
      return json({ entry: remote, saved: true });
    }
  } catch {
    // fall back to in-memory
  }

  const updated = upsertEntry(dateKey, notes);
  return json({ entry: updated, saved: true });
}

export default function JournalEntryRoute() {
  const { entry } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <main>
      <p className="lead">Entry for {entry.dateKey}</p>
      {actionData?.saved ? (
        <div
          style={{
            background: "#ecfeff",
            border: "1px solid #06b6d4",
            color: "#0f172a",
            padding: "10px 12px",
            borderRadius: 10,
            marginBottom: 12
          }}
        >
          Saved successfully
        </div>
      ) : null}
      <Form method="post" replace>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          Notes
          <textarea
            name="notes"
            defaultValue={entry.notes}
            rows={8}
            style={{ padding: 12, borderRadius: 10, border: "1px solid #cbd5e1" }}
            placeholder="Add your own notes!"
          />
        </label>
        <button type="submit">Save notes</button>
      </Form>
      <p style={{ marginTop: 12 }}>
        <Link to="/">← Back to calendar</Link>
      </p>
      {entry.updatedAt ? <small className="muted">Last updated: {entry.updatedAt}</small> : null}
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <p className="lead" data-testid="entry-error">
          Entry unavailable
        </p>
        <p>{error.data ?? "Something went wrong loading this entry."}</p>
        <p>
          <Link to="/">← Back to calendar</Link>
        </p>
      </main>
    );
  }
  return (
    <main>
      <p className="lead" data-testid="entry-error">
        Entry unavailable
      </p>
      <p>Something went wrong.</p>
      <p>
        <Link to="/">← Back to calendar</Link>
      </p>
    </main>
  );
}
