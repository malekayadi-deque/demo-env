import { defineConfig } from "@playwright/test";
require('dotenv').config();
export default defineConfig({
  testDir: "./_tests/playwright/specs",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  timeout: 300000,
  fullyParallel: true,
  workers: 3,
});
