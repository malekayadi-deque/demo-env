require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { Builder, until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Shopping Cart Page (WebdriverJS)', () => {
  let browser;
  const totalPrice = 120;

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
    await browser.get(`${BASE_URL}/`);
    await browser.executeScript(() => localStorage.clear());
    await browser.get(`${BASE_URL}/product/249`);
    await browser.wait(until.elementLocated(By.css('section.product-single .btn-addtocart')), 10000);
    await browser.executeScript(
      "document.querySelector('section.product-single .btn-addtocart').click()"
    );
    await browser.get(`${BASE_URL}/shop_cart`);
    await browser.wait(until.elementLocated(By.css('.cart-table')), 10000);
  });

  it('should display cart items with correct details', async () => {
    const rows = await browser.findElements(By.css('.cart-table tbody tr'));
    assert.strictEqual(rows.length, 1, 'cart should have 1 item');

    const title = await browser.findElement(By.css('.cart-table tbody tr h4'));
    assert.strictEqual((await title.getText()).trim(), 'End Grain Cutting Board');

    const price = await browser.findElement(By.css('.cart-table tbody tr .shopping-cart__product-price'));
    assert.strictEqual((await price.getText()).trim(), `$${totalPrice}`);

    const qty = await browser.findElement(By.css('.cart-table tbody tr input[name="quantity"]'));
    assert.strictEqual(await qty.getAttribute('value'), '1');

    const subtotal = await browser.findElement(By.css('.cart-table tbody tr .shopping-cart__subtotal'));
    assert.strictEqual((await subtotal.getText()).trim(), `$${totalPrice}`);
  });

  it('should update quantity of a product', async () => {
    await browser.wait(until.elementLocated(By.css('.qty-control__increase')), 10000);
    await browser.executeScript("document.querySelector('.qty-control__increase').click()");
    await browser.wait(async () => {
      const qty = await browser.findElement(By.css('input[name="quantity"]'));
      return (await qty.getAttribute('value')) === '2';
    }, 5000);
    const qtyEl = await browser.findElement(By.css('input[name="quantity"]'));
    assert.strictEqual(await qtyEl.getAttribute('value'), '2');

    await browser.executeScript("document.querySelector('.qty-control__reduce').click()");
    await browser.wait(async () => {
      const qty = await browser.findElement(By.css('input[name="quantity"]'));
      return (await qty.getAttribute('value')) === '1';
    }, 5000);
    const qtyFinal = await browser.findElement(By.css('input[name="quantity"]'));
    assert.strictEqual(await qtyFinal.getAttribute('value'), '1');
  });

  it('should remove a product from the cart', async () => {
    await browser.wait(until.elementLocated(By.css('.remove-cart')), 10000);
    await browser.executeScript("document.querySelector('.remove-cart').click()");
    await browser.wait(async () => {
      const rows = await browser.findElements(By.css('.cart-table tbody tr'));
      return rows.length === 0;
    }, 5000);
    const rows = await browser.findElements(By.css('.cart-table tbody tr'));
    assert.strictEqual(rows.length, 0, 'cart should be empty after removal');
  });

  it('should display cart totals correctly', async () => {
    const totals = await browser.executeScript(() => {
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
    await browser.wait(until.elementLocated(By.css('.btn-checkout')), 10000);
    await browser.executeScript("document.querySelector('.btn-checkout').click()");
    await browser.wait(until.urlContains('/shop_checkout'), 10000);
    const url = await browser.getCurrentUrl();
    assert.ok(url.includes('/shop_checkout'), 'should navigate to checkout');
  });
});
