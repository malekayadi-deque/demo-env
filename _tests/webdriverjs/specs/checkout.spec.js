require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { Builder, until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Checkout Page (WebdriverJS)', () => {
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

  after(async () => { if (browser) await browser.quit(); await new Promise(r => setTimeout(r, 5000)); });

  beforeEach(async () => {
    await browser.get(`${BASE_URL}/`);
    await browser.executeScript(() => localStorage.clear());
    await browser.get(`${BASE_URL}/product/249`);
    await browser.wait(until.elementLocated(By.css('section.product-single .btn-addtocart')), 10000);
    await browser.executeScript(
      "document.querySelector('section.product-single .btn-addtocart').click()"
    );
    await browser.get(`${BASE_URL}/shop_checkout`);
    await browser.wait(until.elementLocated(By.id('checkout_first_name')), 10000);
  });

  it('should display the billing details form', async () => {
    await browser.wait(until.elementLocated(By.id('checkout_first_name')), 10000);
    await browser.wait(until.elementLocated(By.id('checkout_last_name')), 10000);

    const firstName = await browser.findElement(By.id('checkout_first_name'));
    await firstName.clear();
    await firstName.sendKeys('John');
    assert.strictEqual(await firstName.getAttribute('value'), 'John');

    const lastName = await browser.findElement(By.id('checkout_last_name'));
    await lastName.clear();
    await lastName.sendKeys('Doe');
    assert.strictEqual(await lastName.getAttribute('value'), 'Doe');
  });

  it('should handle the country/region dropdown', async () => {
    await browser.wait(until.elementLocated(By.id('search-dropdown')), 10000);
    await browser.findElement(By.id('search-dropdown')).then(el => el.click());
    await browser.wait(until.elementLocated(By.css('ul.search-suggestion')), 10000);
    await browser.executeScript(() => {
      const items = Array.from(document.querySelectorAll('ul.search-suggestion *'));
      const us = items.find(el => el.textContent.trim() === 'United States');
      if (us) us.click();
    });
    await browser.wait(async () => {
      const el = await browser.findElement(By.id('search-dropdown'));
      return (await el.getAttribute('value')) === 'United States';
    }, 5000);
    const dropdown = await browser.findElement(By.id('search-dropdown'));
    assert.strictEqual(await dropdown.getAttribute('value'), 'United States');
  });
});
