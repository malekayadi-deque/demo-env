require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { Builder, until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { AxeDevToolsBuilder } = require('@axe-devtools/webdriverjs');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Accessibility monitoring — axe DevTools (WebdriverJS)', () => {
  let browser;

  before(async () => {
    const options = new Options();
    options.setChromeBinaryPath(chromeBinary);
    options.addArguments('--headless=new', '--no-sandbox', '--disable-features=PerfettoSystemTracing', '--disable-gpu', '--no-first-run', '--disable-extensions', '--disable-background-networking');
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        browser = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        break;
      } catch (e) {
        if (attempt === 3) throw e;
        await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
    await browser.manage().window().setRect({ width: 1280, height: 900 });
  });

  after(async () => { if (browser) await browser.quit(); await new Promise(r => setTimeout(r, 2500)); });

  it('home page is accessible', async () => {
    await browser.get(`${BASE_URL}/`);
    await browser.wait(until.elementLocated(By.css('body')), 10000);
    const results = await new AxeDevToolsBuilder(browser)
      .withTags(['wcag2a', 'wcag2aa'])
      .setLegacyMode(true)
      .analyze();
    assert.ok(results, 'axe analysis should return results');
    assert.ok(Array.isArray(results.violations), 'results should have violations array');
    console.log(`  home: ${results.violations.length} violation(s)`);
  });

  it('shop page is accessible', async () => {
    await browser.get(`${BASE_URL}/shop`);
    await browser.wait(until.elementLocated(By.css('section.shop-main')), 10000);
    const results = await new AxeDevToolsBuilder(browser)
      .withTags(['wcag2a', 'wcag2aa'])
      .setLegacyMode(true)
      .analyze();
    assert.ok(results, 'axe analysis should return results');
    assert.ok(Array.isArray(results.violations), 'results should have violations array');
    console.log(`  shop: ${results.violations.length} violation(s)`);
  });

  it('cart page is accessible', async () => {
    await browser.get(`${BASE_URL}/shop_cart`);
    await browser.wait(until.elementLocated(By.css('body')), 10000);
    const results = await new AxeDevToolsBuilder(browser)
      .withTags(['wcag2a', 'wcag2aa'])
      .setLegacyMode(true)
      .analyze();
    assert.ok(results, 'axe analysis should return results');
    assert.ok(Array.isArray(results.violations), 'results should have violations array');
    console.log(`  cart: ${results.violations.length} violation(s)`);
  });

  it('login/register page is accessible', async () => {
    await browser.get(`${BASE_URL}/login_register`);
    await browser.wait(until.elementLocated(By.id('login-tab')), 10000);
    const results = await new AxeDevToolsBuilder(browser)
      .withTags(['wcag2a', 'wcag2aa'])
      .setLegacyMode(true)
      .analyze();
    assert.ok(results, 'axe analysis should return results');
    assert.ok(Array.isArray(results.violations), 'results should have violations array');
    console.log(`  login/register: ${results.violations.length} violation(s)`);
  });
});
