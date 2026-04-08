require('dotenv').config();

const puppeteer = require('puppeteer');
const { cypressConfig } = require('@axe-core/watcher/cypress/config');

const chromePath = puppeteer.executablePath();
const versionMatch = chromePath.match(/(\d+\.\d+\.\d+\.\d+)/);
const chromeVersion = versionMatch ? versionMatch[1] : '1';
const chromeMajor = parseInt(chromeVersion.split('.')[0], 10);

module.exports = cypressConfig({
  axe: {
    apiKey: process.env.API_KEY,
    serverURL: process.env.SERVER_URL,
    projectId: process.env.PROJECT_ID,
    buildID: process.env.BUILD_ID,
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
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
