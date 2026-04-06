require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { Builder, until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Product Details Page (WebdriverJS)', () => {
  let browser;
  const product = { id: 249, title: 'End Grain Cutting Board', price: 120 };

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
    await browser.get(`${BASE_URL}/product/${product.id}`);
    await browser.wait(until.elementLocated(By.css('section.product-single')), 10000);
  });

  it('should display product details correctly', async () => {
    await browser.wait(until.elementLocated(By.css('h1.product-single__name')), 10000);
    const title = await browser.findElement(By.css('h1.product-single__name'));
    assert.strictEqual((await title.getText()).trim(), product.title);

    const price = await browser.findElement(By.css('.product-single__price .current-price'));
    assert.strictEqual((await price.getText()).trim(), `$${product.price}`);
  });

  it('should display product rating and reviews', async () => {
    await browser.wait(until.elementLocated(By.css('.product-single__rating .reviews-group')), 10000);
    const reviewText = await browser.findElement(By.css('.product-single__rating .reviews-note'));
    assert.ok((await reviewText.getText()).includes('8k+ reviews'), 'should show review count');
  });

  it('should update quantity when using the controls', async () => {
    await browser.wait(until.elementLocated(By.css('section.product-single input[name="quantity"]')), 10000);
    const qtyInput = await browser.findElement(By.css('section.product-single input[name="quantity"]'));
    assert.strictEqual(await qtyInput.getAttribute('value'), '1');

    await browser.executeScript(
      "document.querySelector('section.product-single .qty-control__increase').click()"
    );
    await browser.wait(async () => {
      const el = await browser.findElement(By.css('section.product-single input[name="quantity"]'));
      return (await el.getAttribute('value')) === '2';
    }, 5000);
    assert.strictEqual(await qtyInput.getAttribute('value'), '2');

    await browser.executeScript(
      "document.querySelector('section.product-single .qty-control__reduce').click()"
    );
    await browser.wait(async () => {
      const el = await browser.findElement(By.css('section.product-single input[name="quantity"]'));
      return (await el.getAttribute('value')) === '1';
    }, 5000);
    assert.strictEqual(await qtyInput.getAttribute('value'), '1');
  });

  it('should add the product to the cart', async () => {
    await browser.wait(until.elementLocated(By.css('section.product-single .btn-addtocart')), 10000);
    const addBtn = await browser.findElement(By.css('section.product-single .btn-addtocart'));
    assert.ok((await addBtn.getText()).toLowerCase().includes('add to cart'));

    await browser.executeScript(
      "document.querySelector('section.product-single .btn-addtocart').click()"
    );
    await browser.wait(async () => {
      const btn = await browser.findElement(By.css('section.product-single .btn-addtocart'));
      return (await btn.getText()).toLowerCase().includes('already added');
    }, 5000);
    assert.ok((await addBtn.getText()).toLowerCase().includes('already added'));
  });

  it('should switch between product tabs', async () => {
    await browser.executeScript("document.getElementById('tab-additional-info-tab').click()");
    await browser.wait(until.elementLocated(By.css('#tab-additional-info.active')), 5000);
    const infoContent = await browser.findElement(By.id('tab-additional-info'));
    assert.ok((await infoContent.getAttribute('class')).includes('active'));

    await browser.executeScript("document.getElementById('tab-reviews-tab').click()");
    await browser.wait(until.elementLocated(By.css('#tab-reviews.active')), 5000);
    const reviewsContent = await browser.findElement(By.id('tab-reviews'));
    assert.ok((await reviewsContent.getAttribute('class')).includes('active'));

    await browser.executeScript("document.getElementById('tab-description-tab').click()");
    await browser.wait(until.elementLocated(By.css('#tab-description.active')), 5000);
    const descContent = await browser.findElement(By.id('tab-description'));
    assert.ok((await descContent.getAttribute('class')).includes('active'));
  });

  it('should navigate to next and previous products', async () => {
    await browser.wait(until.elementLocated(By.css('.product-single__prev-next')), 10000);

    await browser.executeScript(() => {
      const links = Array.from(document.querySelectorAll('.product-single__prev-next a'));
      const prev = links.find(a => a.textContent.includes('Prev'));
      if (prev) prev.click();
    });
    await browser.wait(until.urlMatches(/\/product\/\d+/), 10000);
    assert.match(await browser.getCurrentUrl(), /\/product\/\d+/, 'prev should navigate to a product page');

    await browser.get(`${BASE_URL}/product/${product.id}`);
    await browser.wait(until.elementLocated(By.css('.product-single__prev-next')), 10000);

    await browser.executeScript(() => {
      const links = Array.from(document.querySelectorAll('.product-single__prev-next a'));
      const next = links.find(a => a.textContent.includes('Next'));
      if (next) next.click();
    });
    await browser.wait(until.urlMatches(/\/product\/\d+/), 10000);
    assert.match(await browser.getCurrentUrl(), /\/product\/\d+/, 'next should navigate to a product page');
  });
});
