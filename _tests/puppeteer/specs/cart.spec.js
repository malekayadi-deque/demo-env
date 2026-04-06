require('dotenv').config();
const puppeteer = require('puppeteer');
const { puppeteerConfig, PuppeteerController, wrapPuppeteerPage } = require('@axe-core/watcher/puppeteer');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Shopping Cart Page (Puppeteer)', () => {
  let browser, page, controller;
  const totalPrice = 120;

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
    // Navigate to app origin to clear localStorage, then add product fresh
    await page.goto(`${BASE_URL}/`);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/product/249`);
    await page.waitForSelector('section.product-single .btn-addtocart', { visible: true, timeout: 10000 });
    await page.click('section.product-single .btn-addtocart');
    await page.goto(`${BASE_URL}/shop_cart`);
    await page.waitForSelector('.cart-table', { visible: true, timeout: 10000 });
  });

  it('should display cart items with correct details', async () => {
    const rows = await page.$$('.cart-table tbody tr');
    assert.strictEqual(rows.length, 1, 'cart should have 1 item');

    const title = await page.$eval('.cart-table tbody tr h4', el => el.textContent.trim());
    assert.strictEqual(title, 'End Grain Cutting Board');

    const price = await page.$eval('.cart-table tbody tr .shopping-cart__product-price', el => el.textContent.trim());
    assert.strictEqual(price, `$${totalPrice}`);

    const qty = await page.$eval('.cart-table tbody tr input[name="quantity"]', el => el.value);
    assert.strictEqual(qty, '1');

    const subtotal = await page.$eval('.cart-table tbody tr .shopping-cart__subtotal', el => el.textContent.trim());
    assert.strictEqual(subtotal, `$${totalPrice}`);
  });

  it('should update quantity of a product', async () => {
    await page.waitForSelector('.qty-control__increase', { visible: true, timeout: 10000 });
    await page.click('.qty-control__increase');
    await page.waitForFunction(
      () => document.querySelector('input[name="quantity"]')?.value === '2',
      { timeout: 5000 }
    );
    const qty = await page.$eval('input[name="quantity"]', el => el.value);
    assert.strictEqual(qty, '2');

    await page.click('.qty-control__reduce');
    await page.waitForFunction(
      () => document.querySelector('input[name="quantity"]')?.value === '1',
      { timeout: 5000 }
    );
    const qtyAfter = await page.$eval('input[name="quantity"]', el => el.value);
    assert.strictEqual(qtyAfter, '1');
  });

  it('should remove a product from the cart', async () => {
    await page.waitForSelector('.remove-cart', { visible: true, timeout: 10000 });
    await page.click('.remove-cart');
    await page.waitForFunction(
      () => document.querySelectorAll('.cart-table tbody tr').length === 0,
      { timeout: 5000 }
    );
    const rows = await page.$$('.cart-table tbody tr');
    assert.strictEqual(rows.length, 0, 'cart should be empty after removal');
  });

  it('should display cart totals correctly', async () => {
    const totals = await page.evaluate(() => {
      const result = {};
      for (const row of document.querySelectorAll('.cart-totals tr')) {
        const th = row.querySelector('th');
        const td = row.querySelector('td');
        if (th && td) result[th.textContent.trim()] = td.textContent.trim();
      }
      return result;
    });
    assert.strictEqual(totals['Subtotal'], `$${120}`, 'subtotal should be $120');
    assert.strictEqual(totals['VAT'], '$19', 'VAT should be $19');
    assert.ok(totals['Total'], 'Total row should be present');
  });

  it('should proceed to checkout', async () => {
    await page.waitForSelector('.btn-checkout', { visible: true, timeout: 10000 });
    const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.click('.btn-checkout');
    await navPromise;
    assert.ok(page.url().includes('/shop_checkout'), 'should navigate to checkout page');
  });
});
