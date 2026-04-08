require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { remote } = require('webdriverio');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Product Details Page (WebdriverIO)', () => {
  let browser;
  const product = { id: 249, title: 'End Grain Cutting Board', price: 120 };

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
    await browser.url(`${BASE_URL}/product/${product.id}`);
    await browser.$('section.product-single').waitForDisplayed({ timeout: 10000 });
  });

  it('should display product details correctly', async () => {
    await browser.$('section.product-single .product-single__name').waitForDisplayed({ timeout: 10000 });
    const title = await browser.$('section.product-single .product-single__name').getText();
    assert.strictEqual(title, product.title);

    const price = await browser.$('section.product-single .product-single__price .current-price').getText();
    assert.strictEqual(price, `$${product.price}`);
  });

  it('should display product rating and reviews', async () => {
    await browser.$('.product-single__rating .reviews-group').waitForDisplayed({ timeout: 10000 });
    const reviewText = await browser.$('.product-single__rating .reviews-note').getText();
    assert.ok(reviewText.includes('8k+ reviews'), 'should show review count');
  });

  it('should update quantity when using the controls', async () => {
    await browser.$('section.product-single input[name="quantity"]').waitForDisplayed({ timeout: 10000 });
    const initial = await browser.$('section.product-single input[name="quantity"]').getValue();
    assert.strictEqual(initial, '1');

    await browser.$('section.product-single .qty-control__increase').click();
    await browser.waitUntil(
      async () => (await browser.$('section.product-single input[name="quantity"]').getValue()) === '2',
      { timeout: 5000 }
    );
    assert.strictEqual(await browser.$('section.product-single input[name="quantity"]').getValue(), '2');

    await browser.$('section.product-single .qty-control__reduce').click();
    await browser.waitUntil(
      async () => (await browser.$('section.product-single input[name="quantity"]').getValue()) === '1',
      { timeout: 5000 }
    );
    assert.strictEqual(await browser.$('section.product-single input[name="quantity"]').getValue(), '1');
  });

  it('should add the product to the cart', async () => {
    await browser.$('section.product-single .btn-addtocart').waitForDisplayed({ timeout: 10000 });
    const btnText = await browser.$('section.product-single .btn-addtocart').getText();
    assert.ok(btnText.toLowerCase().includes('add to cart'), `expected "Add to Cart" button, got: "${btnText}"`);

    await browser.execute(() => document.querySelector('section.product-single .btn-addtocart').click());
    await browser.waitUntil(
      async () => (await browser.$('section.product-single .btn-addtocart').getText()).toLowerCase().includes('already added'),
      { timeout: 5000 }
    );
    const afterText = await browser.$('section.product-single .btn-addtocart').getText();
    assert.ok(afterText.toLowerCase().includes('already added'), `expected "Already Added" button, got: "${afterText}"`);
  });

  it('should switch between product tabs', async () => {
    await browser.$('#tab-additional-info-tab').click();
    await browser.waitUntil(
      async () => (await browser.$('#tab-additional-info').getAttribute('class')).includes('active'),
      { timeout: 5000 }
    );
    assert.ok((await browser.$('#tab-additional-info').getAttribute('class')).includes('active'));

    await browser.$('#tab-reviews-tab').click();
    await browser.waitUntil(
      async () => (await browser.$('#tab-reviews').getAttribute('class')).includes('active'),
      { timeout: 5000 }
    );
    assert.ok((await browser.$('#tab-reviews').getAttribute('class')).includes('active'));

    await browser.$('#tab-description-tab').click();
    await browser.waitUntil(
      async () => (await browser.$('#tab-description').getAttribute('class')).includes('active'),
      { timeout: 5000 }
    );
    assert.ok((await browser.$('#tab-description').getAttribute('class')).includes('active'));
  });

  it('should navigate to next and previous products', async () => {
    await browser.$('.product-single__prev-next').waitForDisplayed({ timeout: 10000 });

    await browser.execute(() => {
      const links = Array.from(document.querySelectorAll('.product-single__prev-next a'));
      const prev = links.find(a => a.textContent.includes('Prev'));
      if (prev) prev.click();
    });
    await browser.waitUntil(
      async () => /\/product\/\d+/.test(await browser.getUrl()),
      { timeout: 10000 }
    );
    assert.match(await browser.getUrl(), /\/product\/\d+/, 'prev should navigate to a product page');

    await browser.url(`${BASE_URL}/product/${product.id}`);
    await browser.$('.product-single__prev-next').waitForDisplayed({ timeout: 10000 });

    await browser.execute(() => {
      const links = Array.from(document.querySelectorAll('.product-single__prev-next a'));
      const next = links.find(a => a.textContent.includes('Next'));
      if (next) next.click();
    });
    await browser.waitUntil(
      async () => /\/product\/\d+/.test(await browser.getUrl()),
      { timeout: 10000 }
    );
    assert.match(await browser.getUrl(), /\/product\/\d+/, 'next should navigate to a product page');
  });
});
