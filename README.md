# all_in_one — Embel Accessibility Demo

A Next.js 14 e-commerce application used as a test target for axe DevTools accessibility demos. Five automated testing frameworks are integrated — each streaming results to the axe Developer Hub.

---

## System Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 |
| Styling | Bootstrap 5 + custom SCSS |
| Data | Static mock data (no backend) |
| Dev Server | `http://localhost:3000` |

**App structure:** 30 routes across shop, cart, checkout, auth, blog, and account flows. Tested pages cover the critical user journey: Home → Shop → Product → Cart → Checkout → Confirmation.

**Testing packages:**

| Framework | axe Package |
|---|---|
| Playwright | `@axe-core/playwright` |
| Cypress | `@axe-core/watcher` |
| Puppeteer | `@axe-core/watcher/puppeteer` |
| WebdriverIO | `@axe-devtools/webdriverio` |
| WebdriverJS (Selenium) | `@axe-devtools/webdriverjs` |

---

## Setup

```bash
npm install
npm run dev     # http://localhost:3000
```

---

## Environment Variables

Create a `.env` file at the project root (never commit it):

```env
API_KEY=your-axe-devhub-api-key
SERVER_URL=https://axe.deque.com
BUILD_ID=your-build-id

PROJECT_ID=your-playwright-cypress-project-id
PUPPETEER_PROJECT_ID=your-puppeteer-project-id
WEBDRIVERIO_PROJECT_ID=your-webdriverio-project-id
WEBDRIVERJS_PROJECT_ID=your-webdriverjs-project-id
```

All frameworks share a single `API_KEY`. Project IDs remain unique per framework so results are grouped correctly in the Developer Hub.

**Where to find credentials:** Log in to [axe Developer Hub](https://axe.deque.com) → **Manage API Keys** for the API key, **Projects** for project IDs. `BUILD_ID` is optional — use a CI run ID (e.g. `$GITHUB_RUN_ID`) to group parallel runs into one report.

---

## Testing Suite

Each framework covers the same 8 pages: Home, Shop, Product, Cart, Checkout, Login/Register, Order Confirmation, and an Accessibility smoke test.

### Playwright + axe-core/playwright

```bash
npm test                  # run tests (server must be running)
npm run ci                # start server + run tests
```

Specs: `_tests/playwright/specs/*.spec.js`

---

### Cypress + axe Watcher

```bash
npm run test:cypress:run  # headless Chrome
npm run test:cypress      # interactive Cypress runner
npm run test:cypress:axe  # start server + run tests
```

Specs: `_tests/cypress/specs/*.cy.js`

---

### Puppeteer + axe Watcher

```bash
npm run puppeteer         # run tests (server must be running)
npm run puppeteer:axe     # start server + run tests
```

Specs: `_tests/puppeteer/specs/*.spec.js`

---

### WebdriverIO + axe DevTools

```bash
npm run webdriverio       # run tests (server must be running)
npm run webdriverio:axe   # start server + run tests
```

Specs: `_tests/webdriverio/specs/*.spec.js`

---

### WebdriverJS (Selenium) + axe DevTools

```bash
npm run webdriverjs       # run tests (server must be running)
npm run webdriverjs:axe   # start server + run tests
```

Specs: `_tests/webdriverjs/specs/*.spec.js`

ChromeDriver is managed automatically by Selenium Manager (bundled in `selenium-webdriver` v4.11+).

---

## Troubleshooting — Clear the .next Cache

If tests fail with 500 errors, complete in under 300ms, or the dev server logs `MODULE_NOT_FOUND` for page chunks, the Next.js build cache is corrupted.

```bash
# 1. Stop the dev server (Ctrl+C)
rm -rf .next
npm run dev
# 2. Re-run the failing suite
npm run puppeteer:axe
```

**Symptoms of a corrupted cache:** `cy.visit()` returns 500 on specific routes · tests complete in <300ms · `MODULE_NOT_FOUND` in dev server output.

---

## Best Practices

**CI/CD gating** — Add a status check in your pipeline that fails the build when axe DevTools reports new violations. Use `npm run ci` (Playwright) or the equivalent `*:axe` scripts for each framework as your CI command. Set `BUILD_ID=$GITHUB_RUN_ID` to tie every parallel run to a single report.

**ARIA live region monitoring** — Automated scans do not cover dynamic announcements. Supplement with manual checks: add `role="status"` or `role="alert"` to cart updates, toast notifications, and form validation messages, then verify with a screen reader.

**Result grouping** — Keep `PROJECT_ID` unique per framework. This lets you compare axe violation trends across Playwright, Cypress, Puppeteer, WebdriverIO, and WebdriverJS results in the Developer Hub without them colliding.

**Headless vs. headed tradeoffs** — All frameworks run `--headless=new` by default. Run headed (`--headed` in Playwright, omit `--headless` in others) when debugging unexpected element interaction failures — cookie consent overlays and viewport-dependent layouts are easier to diagnose with a visible browser.

**Deque registry authentication** — `@axe-devtools/webdriverio` and `@axe-devtools/webdriverjs` are served from the Deque npm registry. If `npm install` fails on these packages in a new environment, authenticate first:
```bash
npm config set @deque:registry https://registry.deque.com/
npm login --registry=https://registry.deque.com/
```
