require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { remote } = require('webdriverio');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Checkout Page (WebdriverIO)', () => {
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
    await browser.url(`${BASE_URL}/`);
    await browser.execute(() => localStorage.clear());
    await browser.url(`${BASE_URL}/product/249`);
    await browser.$('section.product-single .btn-addtocart').waitForDisplayed({ timeout: 10000 });
    await browser.execute(() => document.querySelector('section.product-single .btn-addtocart').click());
    await browser.url(`${BASE_URL}/shop_checkout`);
    await browser.$('#checkout_first_name').waitForDisplayed({ timeout: 10000 });
  });

  it('should display the billing details form', async () => {
    const firstNameInput = await browser.$('#checkout_first_name');
    const lastNameInput = await browser.$('#checkout_last_name');
    await firstNameInput.waitForDisplayed({ timeout: 10000 });
    await lastNameInput.waitForDisplayed({ timeout: 10000 });

    await firstNameInput.setValue('John');
    assert.strictEqual(await firstNameInput.getValue(), 'John');

    await lastNameInput.setValue('Doe');
    assert.strictEqual(await lastNameInput.getValue(), 'Doe');
  });

  it('should handle the country/region dropdown', async () => {
    await browser.$('#search-dropdown').waitForDisplayed({ timeout: 10000 });
    await browser.$('#search-dropdown').click();
    await browser.$('ul.search-suggestion').waitForDisplayed({ timeout: 10000 });
    await browser.execute(() => {
      const items = Array.from(document.querySelectorAll('ul.search-suggestion *'));
      const us = items.find(el => el.textContent.trim() === 'United States');
      if (us) us.click();
    });
    await browser.waitUntil(
      async () => (await browser.$('#search-dropdown').getValue()) === 'United States',
      { timeout: 5000 }
    );
    assert.strictEqual(await browser.$('#search-dropdown').getValue(), 'United States');
  });
});
