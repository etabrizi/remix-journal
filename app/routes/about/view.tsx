import { Link } from "@remix-run/react";

export default function About() {
  return (
    <main>
      <p className="lead">About this demo</p>
      <section>
        <h1>Remix SSR + MSW</h1>
        <p>
          This example shows how to keep Remix fully server-rendered while mocking outbound HTTP
          calls with <strong>msw/node</strong>. Loaders fetch mock data and actions post updates, all
          without client-side data fetching.
        </p>
        <ul>
          <li>Route sidecar pattern: loader, action, meta, and view split for clarity.</li>
          <li>MSW runs only on the server via `server.server.ts`, so the browser bundle stays lean.</li>
          <li>Forms use Remix &lt;Form&gt; for progressive enhancement; no custom client JS.</li>
        </ul>
        <p>Explore the home page to see the mocked user flow.</p>
        <Link to="/">← Back to user demo</Link>
      </section>
    </main>
  );
}
