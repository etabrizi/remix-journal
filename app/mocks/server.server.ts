import * as msw from "msw";
import * as mswNode from "msw/node";
import { getHandlers, resetJournal } from "./handlers";

const USE_MSW = process.env.NODE_ENV !== "production" && process.env.USE_MSW !== "false";
const SCENARIO = process.env.MSW_SCENARIO ?? "default"; // default | empty | errors

const { setupServer } = mswNode;

const server = setupServer(...getHandlers(SCENARIO));
let started = false;

export function ensureMockServer() {
  if (!USE_MSW) return;
  if (started) return;
  resetJournal();
  server.listen({ onUnhandledRequest: "warn" });
  started = true;
}

export { server };
