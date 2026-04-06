require('dotenv').config();

const { cypressConfig } = require('@axe-core/watcher/cypress/config');

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
      name: 'chrome',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Chrome for Testing',
      version: '141.0.7390.78',
      path: '/Users/ap/TestEngines/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
      majorVersion: 141,
    },
  ],
});
