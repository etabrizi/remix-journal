import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { PassThrough } from "node:stream";
import ReactDOMServer from "react-dom/server";
import { ensureMockServer } from "./mocks/server.server";

const ABORT_DELAY = 5_000;

ensureMockServer();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(body as unknown as BodyInit, {
              status: responseStatusCode,
              headers: responseHeaders
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
