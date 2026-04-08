# all_in_one — Project Context

## Overview
Next.js 14 e-commerce demo app (merged from `embel-ts` and `recipes-js` repos). Used as a test target for axe accessibility tooling demos.

## Routes
| Path | Description |
|------|-------------|
| `/` | Home page |
| `/shop` | Product listing |
| `/shop_cart` | Shopping cart |
| `/shop_checkout` | Checkout |
| `/login_register` | Login / Register tabs |
| `/reset_password` | Password reset |
| `/blog` | Blog listing |
| `/blog/[id]` | Blog post detail |
| `/product/[id]` | Standard product page |
| `/product_onsale/[id]` | On-sale product |
| `/product_outofstock/[id]` | Out-of-stock product |
| `/product_grouped/[id]` | Grouped product |
| `/product_external/[id]` | External product |
| `/account_dashboard` | User dashboard |
| `/account_orders` | Order history |
| `/account_wishlist` | Wishlist |
| `/account_edit` | Edit account |
| `/account_edit_address` | Edit address |
| `/contact` | Contact page |
| `/faq` | FAQ |
| `/terms` | Terms & Conditions |
| `/store_location` | Store locator |
| `/lookbook` | Lookbook |
| `/coming_soon` | Coming soon |
| `/order-confirmation` | Order confirmation (static demo page) |

## Dev Server
```
npm run dev      # http://localhost:3000
npm run start    # production build server (requires npm run build first)
```

## First-time Setup (new machine / fresh fork)
1. Configure the Deque private registry — copy `.npmrc.example` to `.npmrc` and fill in Agora credentials before running `npm install`. Without this, install fails on `@axe-devtools/*` packages.
2. `npm install`
3. `npx playwright install chromium` — not included in `npm install`, must be run separately
4. Create `.env` at project root (see Environment Variables below)
5. `npm run build` before using any `:axe` scripts (they use `npm start`, not `npm run dev`)

## GitHub Actions Secrets Required
`API_KEY`, `PROJECT_ID`, `LINTER_API_KEY`, `AGORA_AUTH_TOKEN`, `AGORA_AUTH_EMAIL` — all must be set in GitHub → Settings → Secrets before any workflow will pass.

## Environment Variables
`.env` file at project root (not committed). All API keys have been unified into a single `API_KEY` variable. Project IDs remain unique per framework.

| Variable | Used by | Notes |
|----------|---------|-------|
| `SERVER_URL` | all frameworks | axe DevTools server endpoint (`https://axe.deque.com`) |
| `BUILD_ID` | all frameworks | Build/run identifier for grouping runs |
| `API_KEY` | all frameworks | Single shared axe DevHub API key (replaces 5 separate `*_API_KEY` vars) |
| `PROJECT_ID` | Playwright, Cypress | Project ID for those frameworks |
| `PUPPETEER_PROJECT_ID` | Puppeteer | Unique project ID for Puppeteer results |
| `WEBDRIVERIO_PROJECT_ID` | WebdriverIO | Unique project ID for WebdriverIO results |
| `WEBDRIVERJS_PROJECT_ID` | WebdriverJS/Selenium | Unique project ID for WebdriverJS results |

> **Old vars removed:** `CYPRESS_API_KEY`, `PLAYWRIGHT_API_KEY`, `PUPPETEER_API_KEY`, `WEBDRIVERIO_API_KEY`, `WEBDRIVERJS_API_KEY` — all replaced by `API_KEY`.

---

## Key Selectors
| Element | Selector |
|---------|----------|
| Product grid | `#products-grid` |
| Product card wrapper | `.product-card-wrapper` |
| Add to cart button | `.pc__atc` |
| Wishlist button | `.pc__btn-wl` |
| Sort dropdown | `select[aria-label="Sort Items"]` |
| Login tab | `#login-tab` |
| Register tab | `#register-tab` |
| Login form panel | `#tab-item-login` |
| Register form panel | `#tab-item-register` |
| Shopping cart section | `section.shopping-cart` |
| Cart table | `.cart-table` |
| Cart totals | `.cart-totals` |
| Checkout first name | `#checkout_first_name` |
| Country dropdown | `#search-dropdown` |
| Order complete message | `.order-complete__message` |
| Order info items | `.order-info__item` |
| Product single section | `section.product-single` |
| Prev/Next nav | `.product-single__prev-next` |

---

## Playwright

### Status: ✅ 35/35 passing
- Config: `playwright.config.js` (root)
- Fixtures: `_tests/playwright/fixtures/fixtures.js` — uses `process.env.API_KEY`
- Specs: `_tests/playwright/specs/*.spec.js`
- Runner: `npm test` (via `npx playwright test`)
- CI script: `npm run ci` — uses `start-server-and-test` to spin up dev server then run tests
- `testDir` is scoped to `_tests/specs/` so Playwright does not pick up Puppeteer/WebdriverIO/WebdriverJS spec files

---

## Cypress + axe Watcher

### Status: ✅ 39/39 passing (Chrome for Testing 146, headless)
- Config: `cypress.config.js` — uses `process.env.API_KEY` and `process.env.PROJECT_ID`
- Support: `cypress/support/e2e.js` — imports watcher support, flushes after each test
- Browser: Puppeteer's bundled **Chrome for Testing** via `puppeteer.executablePath()` — version and path resolved dynamically at config load time, no hardcoded paths
- Cypress browser name: `chrome-for-testing` (set in `--browser` flag in all cypress scripts)

### Scripts
```
npm run cypress             # headless Chrome run
npm run test:cypress        # open Cypress interactive runner
npm run test:cypress:run    # headless Chrome run
npm run test:cypress:axe    # start server + headless run (full CI flow)
```

### Troubleshooting — Tests Failing or Skipped
Tests can intermittently fail or skip due to a corrupted `.next` build cache. Symptoms:
- `cy.visit()` returns **500 Internal Server Error** on specific routes (e.g. `/product/249`)
- `MODULE_NOT_FOUND` errors in the dev server log for compiled page chunks
- Tests complete in under 300ms (page never loaded)

**Fix: clear the cache and restart the server before re-running.**
```bash
rm -rf .next
npm run dev
npm run cypress
```

### Known Cypress Quirks
- **React hydration errors** — suppressed globally in `cypress/support/e2e.js` via `Cypress.on('uncaught:exception')`.
- **Element detachment** — all interactive commands use `{ force: true }` and re-query before acting.
- **Off-screen elements** — cart totals and checkout button require `.scrollIntoView()` before asserting visibility.
- **localStorage isolation** — every `beforeEach` calls `cy.clearLocalStorage()`.

### Cypress Spec Files
| File | Coverage |
|------|----------|
| `_tests/cypress/specs/accessibility.cy.js` | axe Watcher smoke tests (home, shop, cart, login) |
| `_tests/cypress/specs/home.cy.js` | Title, sections, hero slides, collections nav, Instagram posts |
| `_tests/cypress/specs/shop.cy.js` | Product grid, sorting, column layout, add to cart, wishlist, pagination |
| `_tests/cypress/specs/product.cy.js` | Product details, rating, quantity controls, add to cart, tabs, prev/next nav |
| `_tests/cypress/specs/cart.cy.js` | Cart items, quantity update, remove product, totals, proceed to checkout |
| `_tests/cypress/specs/checkout.cy.js` | Billing form, country/region dropdown |
| `_tests/cypress/specs/login.cy.js` | Login tab default, register tab switch, login/register flows, required fields, reset password |
| `_tests/cypress/specs/confirmation.cy.js` | Order completion message, order info details, empty cart table |

---

## Puppeteer + axe Watcher

### Status: ✅ 36/36 passing
- Package: `@axe-core/watcher/puppeteer`
- Peer dep: `puppeteer: ^24.0.0`
- Test runner: Mocha (`mocha: ^10.6.0`)
- Specs: `_tests/puppeteer/specs/*.spec.js`
- Auth pattern: `puppeteerConfig({ axe: { apiKey: process.env.API_KEY, serverURL, projectId: process.env.PUPPETEER_PROJECT_ID, buildID }, args: ['--headless=new', '--no-sandbox'] })`
- **Critical:** Do NOT pass `headless: true` to `puppeteerConfig()` — the watcher throws `HeadlessNotSupportedError`. Use `--headless=new` in `args` instead; the watcher sets `headless: false` internally.
- Lifecycle: `before` → `puppeteer.launch()` + `wrapPuppeteerPage()`; `afterEach` → `controller.flush()`; `after` → `browser.close()`
- Chrome: Puppeteer's bundled **Chrome for Testing** at `~/.cache/puppeteer/chrome/mac_arm-146.0.7680.153/`

### Scripts
```
npm run puppeteer        # run Mocha tests (server must already be running)
npm run puppeteer:axe    # start server + run tests
```

### Known Puppeteer Quirks
- **`#tab-item-register` visibility** — Bootstrap fades in the register tab panel; `required` attributes exist in DOM even when hidden, so no need to wait for `visible: true` before asserting `.required`.
- **Prev/Next links** — `SingleProduct12.jsx` renders `<a>` elements without `href` for prev/next; test verifies they are present in the DOM rather than testing navigation.
- **Home `beforeEach`** — uses `{ waitUntil: 'domcontentloaded', timeout: 30000 }` on `page.goto()` and `waitForSelector('header', { timeout: 15000 })` without `visible: true` to handle Next.js hydration timing.

### Puppeteer Spec Files
| File | Coverage |
|------|----------|
| `_tests/puppeteer/specs/accessibility.spec.js` | axe Watcher smoke tests (home, shop, cart, login) |
| `_tests/puppeteer/specs/home.spec.js` | Title, main sections, hero slides, collections nav, Instagram posts |
| `_tests/puppeteer/specs/shop.spec.js` | Product grid, sorting, product navigation, pagination |
| `_tests/puppeteer/specs/product.spec.js` | Product details, rating, quantity controls, add to cart, tabs, prev/next presence |
| `_tests/puppeteer/specs/cart.spec.js` | Cart items, quantity, remove, totals, proceed to checkout |
| `_tests/puppeteer/specs/checkout.spec.js` | Billing form fields, country dropdown |
| `_tests/puppeteer/specs/login.spec.js` | Login tab default, register tab, login/register forms, required fields, reset password |
| `_tests/puppeteer/specs/confirmation.spec.js` | Order complete message, order info, cart table |

---

## WebdriverIO + axe DevTools

### Status: ✅ 36/36 passing

- Package: `@axe-devtools/webdriverio` (v4.11.0) — replaces the broken `@axe-core/watcher` approach
- Peer dep: `webdriverio: ^9.26.1`
- Test runner: Mocha (standalone WDIO via `remote()`)
- Specs: `_tests/webdriverio/specs/*.spec.js`
- Auth: `API_KEY` env var (standard Deque registry auth)
- Chrome: Puppeteer's bundled Chrome for Testing via `require('puppeteer').executablePath()`
- Viewport: `setWindowSize(1280, 900)` in each `before()` — required to avoid mobile layout overlays

### Why the Switch from `@axe-core/watcher`
`@axe-core/watcher` required a Chrome extension (service worker) that never initialized when ChromeDriver launched Chrome in a Mocha context. Root cause confirmed: the extension service worker target was absent (`0 extension targets`) in all ChromeDriver sessions. `@axe-devtools/webdriverio` uses direct axe-core script injection — no extension, no service worker, no ChromeDriver conflict.

### Pattern
```javascript
const { AxeDevToolsWebdriverIO } = require('@axe-devtools/webdriverio');
// In accessibility tests:
const results = await new AxeDevToolsWebdriverIO({ client: browser })
  .setLegacyMode(true)
  .analyze();
```
`setLegacyMode(true)` prevents the v4.3.0+ new-window technique which can be blocked by headless popup restrictions.

### Known Quirks
- **Click interception** — cookie consent banner and product aside overlays block standard WDIO clicks; affected buttons use `browser.execute(() => element.click())` as a JS click bypass.
- **Button text case** — `getText()` returns CSS-transformed text (e.g., `"ADD TO CART"`); assertions use `.toLowerCase().includes(...)`.
- **Window size** — must set 1280×900 or mobile layout footer overlaps interactive elements.

### Scripts
```
npm run webdriverio        # run Mocha tests (server must already be running)
npm run webdriverio:axe    # start server + run tests (start-server-and-test)
```

### WebdriverIO Spec Files
| File | Coverage |
|------|----------|
| `_tests/webdriverio/specs/accessibility.spec.js` | axe Watcher smoke tests (home, shop, cart, login) |
| `_tests/webdriverio/specs/home.spec.js` | Title, main sections, hero slides, collections nav, Instagram posts |
| `_tests/webdriverio/specs/shop.spec.js` | Product grid, sorting, product navigation, pagination |
| `_tests/webdriverio/specs/product.spec.js` | Product details, rating, quantity controls, add to cart, tabs, prev/next |
| `_tests/webdriverio/specs/cart.spec.js` | Cart items, quantity, remove, totals, proceed to checkout |
| `_tests/webdriverio/specs/checkout.spec.js` | Billing form fields, country dropdown |
| `_tests/webdriverio/specs/login.spec.js` | Login tab default, register tab, login/register forms, required fields, reset password |
| `_tests/webdriverio/specs/confirmation.spec.js` | Order complete message, order info, cart table |

---

## WebdriverJS (Selenium) + axe DevTools

### Status: ✅ 36/36 passing

- Package: `@axe-devtools/webdriverjs` (v4.11.0) — replaces the broken `@axe-core/watcher/selenium-webdriver` approach
- Peer dep: `selenium-webdriver: ^4.41.0` (selenium-manager handles ChromeDriver automatically)
- Test runner: Mocha
- Specs: `_tests/webdriverjs/specs/*.spec.js`
- Chrome: Puppeteer's bundled Chrome for Testing via `require('puppeteer').executablePath()`
- Viewport: `browser.manage().window().setRect({ width: 1280, height: 900 })` in each `before()` — required to avoid mobile layout overlays

### Why the Switch from `@axe-core/watcher`
`@axe-core/watcher/selenium-webdriver` required a Chrome extension (service worker) that never initialized under ChromeDriver+Mocha. Same root cause as WDIO. `@axe-devtools/webdriverjs` uses direct axe-core script injection — no extension, no service worker, no ChromeDriver conflict.

### Pattern
```javascript
const { AxeDevToolsBuilder } = require('@axe-devtools/webdriverjs');
// In accessibility tests:
const results = await new AxeDevToolsBuilder(browser)
  .withTags(['wcag2a', 'wcag2aa'])
  .setLegacyMode(true)
  .analyze();
```
`setLegacyMode(true)` prevents the v4.3+ new-window technique blocked in headless.

### Chrome Flags (required for stability)
```javascript
options.addArguments(
  '--headless=new',
  '--no-sandbox',
  '--disable-features=PerfettoSystemTracing',  // prevents Perfetto SIGTRAP crash
  '--disable-gpu',
  '--no-first-run',
  '--disable-extensions',
  '--disable-background-networking'
);
```

### Session Stability Pattern
Chrome crashes intermittently when sessions start back-to-back (Perfetto trace cleanup race). Two mitigations applied:

1. **Retry logic in every `before()` hook** — retries `new Builder().build()` up to 3 times with 2s/4s backoff:
```javascript
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    browser = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    break;
  } catch (e) {
    if (attempt === 3) throw e;
    await new Promise(r => setTimeout(r, 2000 * attempt));
  }
}
```

2. **Cooldown delay in every `after()` hook** — 2.5s for most specs, 5s for `checkout.spec.js` (short spec, next spec crashes most often):
```javascript
after(async () => { if (browser) await browser.quit(); await new Promise(r => setTimeout(r, 2500)); });
```

### Known Quirks
- **Click interception** — cookie consent banner blocks standard clicks; all interactive elements use `browser.executeScript("document.querySelector('...').click()")` bypass.
- **Button text case** — `getText()` returns CSS-transformed text (e.g., `"ADD TO CART"`); assertions use `.toLowerCase().includes(...)`.
- **Login button selector** — `document.querySelector('button[type="submit"]')` selects the wrong button; use `By.xpath('//button[normalize-space(.)="Log In"]')` + JS click.
- **Window size** — must set 1280×900 or mobile layout overlaps interactive elements.

### Scripts
```
npm run webdriverjs        # run Mocha tests (server must already be running)
npm run webdriverjs:axe    # start server + run tests
```

### WebdriverJS Spec Files
| File | Coverage |
|------|----------|
| `_tests/webdriverjs/specs/accessibility.spec.js` | axe DevTools scans (home, shop, cart, login/register) |
| `_tests/webdriverjs/specs/home.spec.js` | Title, main sections, hero slides, collections nav, Instagram posts |
| `_tests/webdriverjs/specs/shop.spec.js` | Product grid, sorting, product navigation, pagination |
| `_tests/webdriverjs/specs/product.spec.js` | Product details, rating, quantity controls, add to cart, tabs, prev/next |
| `_tests/webdriverjs/specs/cart.spec.js` | Cart items, quantity, remove, totals, proceed to checkout |
| `_tests/webdriverjs/specs/checkout.spec.js` | Billing form fields, country dropdown |
| `_tests/webdriverjs/specs/login.spec.js` | Login tab default, register tab, login/register forms, required fields, reset password |
| `_tests/webdriverjs/specs/confirmation.spec.js` | Order complete message, order info, cart table |

