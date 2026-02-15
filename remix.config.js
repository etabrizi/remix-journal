/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: "app",
  serverModuleFormat: "esm",
  serverPlatform: "node",
  // Keep node_modules external and pick proper export conditions for msw/node
  serverDependenciesToBundle: [],
  // Force node-flavored exports, avoid picking browser/null condition
  serverConditions: ["node", "import", "require", "default"],
  serverMainFields: ["module", "main"],
  ignoredRouteFiles: [
    "**/.*",
    "**/loader.*",
    "**/action.*",
    "**/meta.*",
    "**/view.*",
    "**/types.*"
  ],
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    v3_singleFetch: true,
    v3_lazyRouteDiscovery: true
  }
};
