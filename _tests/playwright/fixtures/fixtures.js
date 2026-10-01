import "dotenv/config";
import { playwrightTest } from "@axe-core/watcher";
require("dotenv").config();


const { test, expect } = playwrightTest({
  axe: {
    apiKey: process.env.API_KEY,
    buildID: process.env.BUILD_ID,
    projectId: process.env.PROJECT_ID,
    serverURL: process.env.SERVER_URL,
  },
  headless: false,
  args: ["--headless=new"],
});

export { test, expect };
