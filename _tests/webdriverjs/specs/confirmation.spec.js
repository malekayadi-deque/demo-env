require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { Builder, until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Order Confirmation Page (WebdriverJS)', () => {
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

  beforeEach(async () => {
    await browser.get(`${BASE_URL}/order-confirmation`);
    await browser.wait(until.elementLocated(By.css('.order-complete__message')), 10000);
  });

  it('should display order completion message', async () => {
    const heading = await browser.findElement(By.css('.order-complete__message h3'));
    assert.strictEqual((await heading.getText()).trim(), 'Your order is completed!');

    const para = await browser.findElement(By.css('.order-complete__message p'));
    assert.strictEqual((await para.getText()).trim(), 'Thank you. Your order has been received.');
  });

  it('should display order info details', async () => {
    const orderNumber = await browser.executeScript(() => {
      for (const item of document.querySelectorAll('.order-info__item')) {
        if (item.querySelector('label')?.textContent.includes('Order Number')) {
          return item.querySelector('span')?.textContent.trim();
        }
      }
      return null;
    });
    assert.strictEqual(orderNumber, '13119', 'order number should be 13119');

    const orderTotal = await browser.executeScript(() => {
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
    const rows = await browser.findElements(By.css('.checkout-cart-items tbody tr'));
    assert.strictEqual(rows.length, 0, 'order table should have no rows');
  });
});
