require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { remote } = require('webdriverio');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Shopping Cart Page (WebdriverIO)', () => {
  let browser;
  const totalPrice = 120;

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
    await browser.url(`${BASE_URL}/shop_cart`);
    await browser.$('.cart-table').waitForDisplayed({ timeout: 10000 });
  });

  it('should display cart items with correct details', async () => {
    const rows = await browser.$$('.cart-table tbody tr');
    assert.strictEqual(rows.length, 1, 'cart should have 1 item');

    const title = await browser.$('.cart-table tbody tr h4').getText();
    assert.strictEqual(title, 'End Grain Cutting Board');

    const price = await browser.$('.cart-table tbody tr .shopping-cart__product-price').getText();
    assert.strictEqual(price, `$${totalPrice}`);

    const qty = await browser.$('.cart-table tbody tr input[name="quantity"]').getValue();
    assert.strictEqual(qty, '1');

    const subtotal = await browser.$('.cart-table tbody tr .shopping-cart__subtotal').getText();
    assert.strictEqual(subtotal, `$${totalPrice}`);
  });

  it('should update quantity of a product', async () => {
    await browser.$('.qty-control__increase').waitForDisplayed({ timeout: 10000 });
    await browser.$('.qty-control__increase').click();
    await browser.waitUntil(
      async () => (await browser.$('input[name="quantity"]').getValue()) === '2',
      { timeout: 5000 }
    );
    assert.strictEqual(await browser.$('input[name="quantity"]').getValue(), '2');

    await browser.$('.qty-control__reduce').click();
    await browser.waitUntil(
      async () => (await browser.$('input[name="quantity"]').getValue()) === '1',
      { timeout: 5000 }
    );
    assert.strictEqual(await browser.$('input[name="quantity"]').getValue(), '1');
  });

  it('should remove a product from the cart', async () => {
    await browser.$('.remove-cart').waitForDisplayed({ timeout: 10000 });
    await browser.$('.remove-cart').click();
    await browser.waitUntil(
      async () => (await browser.$$('.cart-table tbody tr')).length === 0,
      { timeout: 5000 }
    );
    const rows = await browser.$$('.cart-table tbody tr');
    assert.strictEqual(rows.length, 0, 'cart should be empty after removal');
  });

  it('should display cart totals correctly', async () => {
    const totals = await browser.execute(() => {
      const result = {};
      for (const row of document.querySelectorAll('.cart-totals tr')) {
        const th = row.querySelector('th');
        const td = row.querySelector('td');
        if (th && td) result[th.textContent.trim()] = td.textContent.trim();
      }
      return result;
    });
    assert.strictEqual(totals['Subtotal'], '$120', 'subtotal should be $120');
    assert.strictEqual(totals['VAT'], '$19', 'VAT should be $19');
    assert.ok(totals['Total'], 'Total row should be present');
  });

  it('should proceed to checkout', async () => {
    await browser.$('.btn-checkout').waitForDisplayed({ timeout: 10000 });
    await browser.execute(() => document.querySelector('.btn-checkout').click());
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes('/shop_checkout'),
      { timeout: 10000 }
    );
    assert.ok((await browser.getUrl()).includes('/shop_checkout'), 'should navigate to checkout');
  });
});
