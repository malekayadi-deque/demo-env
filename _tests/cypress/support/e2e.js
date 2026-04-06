import '@axe-core/watcher/cypress/support';

// Next.js hydration mismatches are an app-level issue, not a test failure.
// Suppress them so Cypress continues and only fails on real assertion errors.
Cypress.on('uncaught:exception', (err) => {
  // Suppress React hydration mismatches in both dev (verbose) and production (minified) builds.
  // #418 = hydration mismatch, #423 = hydration error, #425 = text content mismatch.
  if (/hydrat/i.test(err.message) || /Minified React error #(418|423|425)/.test(err.message)) {
    return false;
  }
});

afterEach(() => {
  cy.axeWatcherFlush();
});
