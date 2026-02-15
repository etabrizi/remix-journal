import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "About | Remix SSR + MSW" },
  { name: "description", content: "About this Remix SSR + MSW demo app." }
];
