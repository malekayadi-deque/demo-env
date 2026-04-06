require('dotenv').config();
const puppeteer = require('puppeteer');
const { puppeteerConfig, PuppeteerController, wrapPuppeteerPage } = require('@axe-core/watcher/puppeteer');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Product Details Page (Puppeteer)', () => {
  let browser, page, controller;
  const product = { id: 249, title: 'End Grain Cutting Board', price: 120 };

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
    await page.goto(`${BASE_URL}/product/${product.id}`);
    await page.waitForSelector('section.product-single', { visible: true, timeout: 10000 });
  });

  it('should display product details correctly', async () => {
    await page.waitForSelector('h1.product-single__name', { visible: true, timeout: 10000 });
    const title = await page.$eval('h1.product-single__name', el => el.textContent.trim());
    assert.strictEqual(title, product.title);

    const price = await page.$eval('.product-single__price .current-price', el => el.textContent.trim());
    assert.strictEqual(price, `$${product.price}`);
  });

  it('should display product rating and reviews', async () => {
    await page.waitForSelector('.product-single__rating .reviews-group', { visible: true, timeout: 10000 });
    const reviewText = await page.$eval('.product-single__rating .reviews-note', el => el.textContent.trim());
    assert.ok(reviewText.includes('8k+ reviews'), 'should show review count');
  });

  it('should update quantity when using the controls', async () => {
    await page.waitForSelector('section.product-single input[name="quantity"]', { visible: true, timeout: 10000 });
    const initial = await page.$eval('section.product-single input[name="quantity"]', el => el.value);
    assert.strictEqual(initial, '1');

    await page.click('section.product-single .qty-control__increase');
    await page.waitForFunction(
      () => document.querySelector('section.product-single input[name="quantity"]')?.value === '2',
      { timeout: 5000 }
    );
    const after = await page.$eval('section.product-single input[name="quantity"]', el => el.value);
    assert.strictEqual(after, '2');

    await page.click('section.product-single .qty-control__reduce');
    await page.waitForFunction(
      () => document.querySelector('section.product-single input[name="quantity"]')?.value === '1',
      { timeout: 5000 }
    );
    const final = await page.$eval('section.product-single input[name="quantity"]', el => el.value);
    assert.strictEqual(final, '1');
  });

  it('should add the product to the cart', async () => {
    await page.waitForSelector('section.product-single .btn-addtocart', { visible: true, timeout: 10000 });
    const btnText = await page.$eval('section.product-single .btn-addtocart', el => el.textContent.trim());
    assert.strictEqual(btnText, 'Add to Cart');

    await page.click('section.product-single .btn-addtocart');
    await page.waitForFunction(
      () => document.querySelector('section.product-single .btn-addtocart')?.textContent.trim() === 'Already Added',
      { timeout: 5000 }
    );
    const afterText = await page.$eval('section.product-single .btn-addtocart', el => el.textContent.trim());
    assert.strictEqual(afterText, 'Already Added');
  });

  it('should switch between product tabs', async () => {
    // Additional info tab
    await page.click('#tab-additional-info-tab');
    await page.waitForFunction(
      () => document.querySelector('#tab-additional-info')?.className.includes('active'),
      { timeout: 5000 }
    );
    const infoClass = await page.$eval('#tab-additional-info', el => el.className);
    assert.ok(infoClass.includes('active'), 'additional info tab should be active');

    // Reviews tab
    await page.click('#tab-reviews-tab');
    await page.waitForFunction(
      () => document.querySelector('#tab-reviews')?.className.includes('active'),
      { timeout: 5000 }
    );
    const reviewsClass = await page.$eval('#tab-reviews', el => el.className);
    assert.ok(reviewsClass.includes('active'), 'reviews tab should be active');

    // Description tab
    await page.click('#tab-description-tab');
    await page.waitForFunction(
      () => document.querySelector('#tab-description')?.className.includes('active'),
      { timeout: 5000 }
    );
    const descClass = await page.$eval('#tab-description', el => el.className);
    assert.ok(descClass.includes('active'), 'description tab should be active');
  });

  it('should display prev and next product navigation', async () => {
    await page.waitForSelector('section.product-single', { visible: true, timeout: 10000 });
    const prevText = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.product-single__prev-next a'));
      return links.find(a => a.textContent.includes('Prev'))?.textContent.trim() || null;
    });
    const nextText = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.product-single__prev-next a'));
      return links.find(a => a.textContent.includes('Next'))?.textContent.trim() || null;
    });
    assert.ok(prevText !== null, 'Prev link should be present');
    assert.ok(nextText !== null, 'Next link should be present');
  });
});
