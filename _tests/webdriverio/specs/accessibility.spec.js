require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { remote } = require('webdriverio');
const { AxeDevToolsWebdriverIO } = require('@axe-devtools/webdriverio');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Accessibility monitoring — axe DevTools (WebdriverIO)', () => {
  let browser;

  before(async () => {
    browser = await remote({
      capabilities: {
        browserName: 'chrome',
        'wdio:enforceWebDriverClassic': true,
        'goog:chromeOptions': {
          binary: chromeBinary,
          args: ['--headless=new', '--no-sandbox'],
        },
      },
      connectionRetryTimeout: 300000,
      logLevel: 'silent',
    });
    await browser.setWindowSize(1280, 900);
  });

  after(async () => {
    await browser.deleteSession();
  });

  it('home page is accessible', async () => {
    await browser.url(`${BASE_URL}/`);
    await browser.$('body').waitForDisplayed({ timeout: 10000 });
    const results = await new AxeDevToolsWebdriverIO({ client: browser })
      .setLegacyMode(true)
      .analyze();
    assert.ok(results, 'axe analysis should return results');
    assert.ok(Array.isArray(results.violations), 'results should have violations array');
    console.log(`  home: ${results.violations.length} violation(s)`);
  });

  it('shop page is accessible', async () => {
    await browser.url(`${BASE_URL}/shop`);
    await browser.$('section.shop-main').waitForDisplayed({ timeout: 10000 });
    const results = await new AxeDevToolsWebdriverIO({ client: browser })
      .setLegacyMode(true)
      .analyze();
    assert.ok(results, 'axe analysis should return results');
    assert.ok(Array.isArray(results.violations), 'results should have violations array');
    console.log(`  shop: ${results.violations.length} violation(s)`);
  });

  it('cart page is accessible', async () => {
    await browser.url(`${BASE_URL}/shop_cart`);
    await browser.$('body').waitForDisplayed({ timeout: 10000 });
    const results = await new AxeDevToolsWebdriverIO({ client: browser })
      .setLegacyMode(true)
      .analyze();
    assert.ok(results, 'axe analysis should return results');
    assert.ok(Array.isArray(results.violations), 'results should have violations array');
    console.log(`  cart: ${results.violations.length} violation(s)`);
  });

  it('login/register page is accessible', async () => {
    await browser.url(`${BASE_URL}/login_register`);
    await browser.$('#login-tab').waitForDisplayed({ timeout: 10000 });
    const results = await new AxeDevToolsWebdriverIO({ client: browser })
      .setLegacyMode(true)
      .analyze();
    assert.ok(results, 'axe analysis should return results');
    assert.ok(Array.isArray(results.violations), 'results should have violations array');
    console.log(`  login/register: ${results.violations.length} violation(s)`);
  });
});
