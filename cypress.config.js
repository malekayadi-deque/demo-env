require('dotenv').config();

const puppeteer = require('puppeteer');
const { cypressConfig } = require('@axe-core/watcher/cypress/config');

const chromePath = puppeteer.executablePath();
const versionMatch = chromePath.match(/(\d+\.\d+\.\d+\.\d+)/);
const chromeVersion = versionMatch ? versionMatch[1] : '1';
const chromeMajor = parseInt(chromeVersion.split('.')[0], 10);

if (!process.env.CYPRESS_PROJECT_ID) {
  throw new Error('CYPRESS_PROJECT_ID is not set in .env (axe Developer Hub project for Cypress)');
}

// A fixed BUILD_ID merges every run into one old build in axe Developer Hub,
// so ignore the .env placeholder and let Watcher generate a fresh one per run.
const buildID = process.env.BUILD_ID && process.env.BUILD_ID !== 'your-build-id'
  ? process.env.BUILD_ID
  : undefined;

module.exports = cypressConfig({
  axe: {
    apiKey: process.env.API_KEY,
    serverURL: process.env.SERVER_URL,
    projectId: process.env.CYPRESS_PROJECT_ID,
    buildID,
    timeout: { flush: 30000 },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    // Must be >= axe.timeout.flush, since Watcher's flush runs inside a cy.then()
    defaultCommandTimeout: 30000,
    specPattern: '_tests/cypress/specs/**/*.cy.js',
    supportFile: '_tests/cypress/support/e2e.js',
    video: false,
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          const idx = launchOptions.args.indexOf('--headless');
          if (idx !== -1) {
            launchOptions.args[idx] = '--headless=new';
          }
        }
        return launchOptions;
      });
    },
  },
  browsers: [
    {
      name: 'chrome-for-testing',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Chrome for Testing',
      version: chromeVersion,
      path: chromePath,
      majorVersion: chromeMajor,
    },
  ],
});
