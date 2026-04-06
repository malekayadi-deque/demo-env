require('dotenv').config();
const puppeteer = require('puppeteer');
const { puppeteerConfig, PuppeteerController, wrapPuppeteerPage } = require('@axe-core/watcher/puppeteer');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Checkout Page (Puppeteer)', () => {
  let browser, page, controller;

  before(async () => {
    const rawBrowser = await puppeteer.launch(
      puppeteerConfig({
        axe: {
          apiKey: process.env.API_KEY,
          serverURL: process.env.SERVER_URL,
          projectId: process.env.PUPPETEER_PROJECT_ID,
          buildID: process.env.BUILD_ID,
        },
        args: ['--headless=new', '--no-sandbox'],
      })
    );
    browser = rawBrowser;
    const rawPage = await browser.newPage();
    controller = new PuppeteerController(rawPage);
    page = wrapPuppeteerPage(rawPage, controller);
  });

  after(async () => { await browser.close(); });
  afterEach(async () => { await controller.flush(); });

  beforeEach(async () => {
    await page.goto(`${BASE_URL}/`);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/product/249`);
    await page.waitForSelector('section.product-single .btn-addtocart', { visible: true, timeout: 10000 });
    await page.click('section.product-single .btn-addtocart');
    await page.goto(`${BASE_URL}/shop_checkout`);
    await page.waitForSelector('#checkout_first_name', { visible: true, timeout: 10000 });
  });

  it('should display the billing details form', async () => {
    await page.waitForSelector('#checkout_first_name', { visible: true, timeout: 10000 });
    await page.waitForSelector('#checkout_last_name', { visible: true, timeout: 10000 });

    // Triple-click to select existing value, then type
    await page.click('#checkout_first_name', { clickCount: 3 });
    await page.type('#checkout_first_name', 'John');
    const firstName = await page.$eval('#checkout_first_name', el => el.value);
    assert.strictEqual(firstName, 'John');

    await page.click('#checkout_last_name', { clickCount: 3 });
    await page.type('#checkout_last_name', 'Doe');
    const lastName = await page.$eval('#checkout_last_name', el => el.value);
    assert.strictEqual(lastName, 'Doe');
  });

  it('should handle the country/region dropdown', async () => {
    await page.waitForSelector('#search-dropdown', { visible: true, timeout: 10000 });
    await page.click('#search-dropdown');
    await page.waitForSelector('ul.search-suggestion', { visible: true, timeout: 10000 });
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('ul.search-suggestion *'));
      const us = items.find(el => el.textContent.trim() === 'United States');
      if (us) us.click();
    });
    await page.waitForFunction(
      () => document.querySelector('#search-dropdown')?.value === 'United States',
      { timeout: 5000 }
    );
    const value = await page.$eval('#search-dropdown', el => el.value);
    assert.strictEqual(value, 'United States');
  });
});
