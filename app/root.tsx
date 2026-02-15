import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import stylesHref from "./styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesHref },
  { rel: "icon", href: "/favicon.ico" }
];

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "Remix SSR MSW Demo" },
  { name: "viewport", content: "width=device-width,initial-scale=1" }
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}
