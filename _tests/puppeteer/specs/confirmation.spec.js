require('dotenv').config();
const puppeteer = require('puppeteer');
const { puppeteerConfig, PuppeteerController, wrapPuppeteerPage } = require('@axe-core/watcher/puppeteer');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Order Confirmation Page (Puppeteer)', () => {
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
    await page.goto(`${BASE_URL}/order-confirmation`);
    await page.waitForSelector('.order-complete__message', { visible: true, timeout: 10000 });
  });

  it('should display order completion message', async () => {
    const heading = await page.$eval('.order-complete__message h3', el => el.textContent.trim());
    assert.strictEqual(heading, 'Your order is completed!');

    const para = await page.$eval('.order-complete__message p', el => el.textContent.trim());
    assert.strictEqual(para, 'Thank you. Your order has been received.');
  });

  it('should display order info details', async () => {
    const orderNumber = await page.evaluate(() => {
      for (const item of document.querySelectorAll('.order-info__item')) {
        if (item.querySelector('label')?.textContent.includes('Order Number')) {
          return item.querySelector('span')?.textContent.trim();
        }
      }
      return null;
    });
    assert.strictEqual(orderNumber, '13119', 'order number should be 13119');

    const orderTotal = await page.evaluate(() => {
      for (const item of document.querySelectorAll('.order-info__item')) {
        if (item.querySelector('label')?.textContent.includes('Total')) {
          return item.querySelector('span')?.textContent.trim();
        }
      }
      return null;
    });
    assert.strictEqual(orderTotal, '$0', 'order total should be $0');
  });

  it('should display order details table', async () => {
    const rows = await page.$$('.checkout-cart-items tbody tr');
    assert.strictEqual(rows.length, 0, 'order table should have no rows');
  });
});
