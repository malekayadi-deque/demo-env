require('dotenv').config();
const puppeteer = require('puppeteer');
const { puppeteerConfig, PuppeteerController, wrapPuppeteerPage } = require('@axe-core/watcher/puppeteer');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Shop Page (Puppeteer)', () => {
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

  after(async () => {
    await browser.close();
  });

  afterEach(async () => {
    await controller.flush();
  });

  beforeEach(async () => {
    await page.goto(`${BASE_URL}/shop`);
    await page.waitForSelector('section.shop-main');
  });

  it('should render the shop page with a product grid', async () => {
    await page.waitForSelector('#products-grid');
    const productCards = await page.$$('#products-grid .product-card-wrapper');
    assert.ok(productCards.length > 0, 'product grid should have at least one product card');
  });

  it('should allow sorting products', async () => {
    await page.waitForSelector('select[aria-label="Sort Items"]');
    await page.select('select[aria-label="Sort Items"]', '5');
    const selectedValue = await page.$eval(
      'select[aria-label="Sort Items"]',
      (el) => el.value
    );
    assert.strictEqual(selectedValue, '5', 'sort dropdown should show selected value');
  });

  it('should navigate to a product details page when clicking a product title', async () => {
    await page.waitForSelector('.product-card .pc__info h6.pc__title a');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('.product-card .pc__info h6.pc__title a'),
    ]);
    assert.match(page.url(), /\/product\/\d+/, 'URL should match product detail pattern');
  });

  it('should display pagination controls', async () => {
    await page.waitForSelector('.pagination');
    const paginationLinks = await page.$$('.pagination a');
    assert.ok(paginationLinks.length > 0, 'pagination should have links');
  });
});
