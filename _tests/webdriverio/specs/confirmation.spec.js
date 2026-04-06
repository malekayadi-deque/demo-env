require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { remote } = require('webdriverio');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Order Confirmation Page (WebdriverIO)', () => {
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

  after(async () => { await browser.deleteSession(); });

  beforeEach(async () => {
    await browser.url(`${BASE_URL}/order-confirmation`);
    await browser.$('.order-complete__message').waitForDisplayed({ timeout: 10000 });
  });

  it('should display order completion message', async () => {
    const heading = await browser.$('.order-complete__message h3').getText();
    assert.strictEqual(heading, 'Your order is completed!');

    const para = await browser.$('.order-complete__message p').getText();
    assert.strictEqual(para, 'Thank you. Your order has been received.');
  });

  it('should display order info details', async () => {
    const orderNumber = await browser.execute(() => {
      for (const item of document.querySelectorAll('.order-info__item')) {
        if (item.querySelector('label')?.textContent.includes('Order Number')) {
          return item.querySelector('span')?.textContent.trim();
        }
      }
      return null;
    });
    assert.strictEqual(orderNumber, '13119', 'order number should be 13119');

    const orderTotal = await browser.execute(() => {
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
    const rows = await browser.$$('.checkout-cart-items tbody tr');
    assert.strictEqual(rows.length, 0, 'order table should have no rows');
  });
});
