import "dotenv/config";
import { playwrightTest } from "@axe-core/watcher";
require("dotenv").config();

// A fixed BUILD_ID merges every run into one old build in axe Developer Hub,
// so ignore the .env placeholder and let Watcher generate a fresh one per run.
const buildID = process.env.BUILD_ID && process.env.BUILD_ID !== "your-build-id"
  ? process.env.BUILD_ID
  : undefined;

const { test, expect } = playwrightTest({
  axe: {
    apiKey: process.env.API_KEY,
    buildID,
    projectId: process.env.PROJECT_ID,
    serverURL: process.env.SERVER_URL,
  },
  headless: false,
  args: ["--headless=new"],
});

export { test, expect };
