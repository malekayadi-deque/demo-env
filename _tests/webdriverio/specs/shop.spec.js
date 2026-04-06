require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { remote } = require('webdriverio');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Shop Page (WebdriverIO)', () => {
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
    await browser.url(`${BASE_URL}/shop`);
    await browser.$('section.shop-main').waitForDisplayed({ timeout: 10000 });
  });

  it('should render the shop page with a product grid', async () => {
    await browser.$('#products-grid').waitForDisplayed({ timeout: 10000 });
    const productCards = await browser.$$('#products-grid .product-card-wrapper');
    assert.ok(productCards.length > 0, 'product grid should have at least one product card');
  });

  it('should allow sorting products', async () => {
    const sortDropdown = await browser.$('select[aria-label="Sort Items"]');
    await sortDropdown.waitForDisplayed({ timeout: 10000 });
    await sortDropdown.selectByAttribute('value', '5');
    const selectedValue = await sortDropdown.getValue();
    assert.strictEqual(selectedValue, '5', 'sort dropdown should show selected value');
  });

  it('should navigate to a product details page when clicking a product title', async () => {
    await browser.$('.product-card .pc__info h6.pc__title a').waitForDisplayed({ timeout: 10000 });
    const productLink = await browser.$('.product-card .pc__info h6.pc__title a');
    await productLink.click();
    await browser.waitUntil(
      async () => /\/product\/\d+/.test(await browser.getUrl()),
      { timeout: 5000 }
    );
    assert.match(await browser.getUrl(), /\/product\/\d+/, 'URL should match product detail pattern');
  });

  it('should display pagination controls', async () => {
    await browser.$('.pagination').waitForDisplayed({ timeout: 10000 });
    const paginationLinks = await browser.$$('.pagination a');
    assert.ok(paginationLinks.length > 0, 'pagination should have links');
  });
});
