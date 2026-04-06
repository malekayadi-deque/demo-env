require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { Builder, until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Shop Page (WebdriverJS)', () => {
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
    await browser.get(`${BASE_URL}/shop`);
    await browser.wait(until.elementLocated(By.css('section.shop-main')), 10000);
  });

  it('should render the shop page with a product grid', async () => {
    await browser.wait(until.elementLocated(By.css('#products-grid')), 10000);
    const productCards = await browser.findElements(By.css('#products-grid .product-card-wrapper'));
    assert.ok(productCards.length > 0, 'product grid should have at least one product card');
  });

  it('should allow sorting products', async () => {
    await browser.wait(until.elementLocated(By.css('select[aria-label="Sort Items"]')), 10000);
    await browser.executeScript(
      "document.querySelector('select[aria-label=\"Sort Items\"]').value = '5'"
    );
    const sortDropdown = await browser.findElement(By.css('select[aria-label="Sort Items"]'));
    const selectedValue = await sortDropdown.getAttribute('value');
    assert.strictEqual(selectedValue, '5', 'sort dropdown should show selected value');
  });

  it('should navigate to a product details page when clicking a product title', async () => {
    await browser.wait(
      until.elementLocated(By.css('.product-card .pc__info h6.pc__title a')),
      10000
    );
    await browser.executeScript(
      "document.querySelector('.product-card .pc__info h6.pc__title a').click()"
    );
    await browser.wait(until.urlMatches(/\/product\/\d+/), 5000);
    const currentUrl = await browser.getCurrentUrl();
    assert.match(currentUrl, /\/product\/\d+/, 'URL should match product detail pattern');
  });

  it('should display pagination controls', async () => {
    await browser.wait(until.elementLocated(By.css('.pagination')), 10000);
    const paginationLinks = await browser.findElements(By.css('.pagination a'));
    assert.ok(paginationLinks.length > 0, 'pagination should have links');
  });
});
