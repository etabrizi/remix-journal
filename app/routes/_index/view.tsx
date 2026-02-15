import { Form, Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./loader";

export default function IndexRoute() {
  const { todayPath, totalEntries } = useLoaderData<typeof loader>();

  return (
    <main>
      <p className="lead">Journal / Calendar</p>
      <p>Pick a date to create or edit notes. The URL encodes the date (e.g. /jan/29/2026).</p>

      <Form method="post" replace>
        <label>
          Pick a date
          <input name="date" type="date" required />
        </label>
        <button type="submit">Open day</button>
      </Form>

      <section style={{ marginTop: "20px" }}>
        <p>
          Today: <Link to={todayPath}>{todayPath}</Link>
        </p>
        <p>
          Total saved entries (this run): <strong>{totalEntries}</strong>
        </p>
        <p>
          <a href="/data/raw" download>
            Download raw data (JSON)
          </a>
        </p>
        <p>
          <Link to="/about">About this demo →</Link>
        </p>
      </section>
    </main>
  );
}
