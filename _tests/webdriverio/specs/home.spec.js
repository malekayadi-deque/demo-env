require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { remote } = require('webdriverio');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Home Page (WebdriverIO)', () => {
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
    await browser.$('header').waitForDisplayed({ timeout: 10000 });
  });

  it('should display the correct page title', async () => {
    const title = await browser.getTitle();
    assert.match(title, /Home \|\| Embel \|\| Luxury by design/);
  });

  it('should render all main sections', async () => {
    const selectors = [
      'main > div.swiper.swiper-container.swiper-container-horizontal',
      'main > section.collections-grid',
      'main > section.products-carousel',
      'main > section.lookbook-products',
      'main > section.blog-carousel',
      'main > section.brands-carousel',
      'main > section.instagram',
      'main > section.service-promotion',
      'footer.footer',
    ];
    for (const sel of selectors) {
      await browser.$(sel).waitForDisplayed({ timeout: 10000 });
    }
  });

  it('should display slides in the hero', async () => {
    await browser.$('div.swiper > div.swiper-wrapper > div.swiper-slide').waitForExist({ timeout: 10000 });
    const slides = await browser.$$('div.swiper > div.swiper-wrapper > div.swiper-slide');
    assert.ok(slides.length > 0, 'hero should have at least one slide');
  });

  it('should navigate to shop from Collections section', async () => {
    await browser.$('section.collections-grid div.collection-grid__item a[href]').waitForDisplayed({ timeout: 10000 });
    const link = await browser.$('section.collections-grid div.collection-grid__item a[href]');
    await link.click();
    await browser.waitUntil(
      async () => /\/shop/.test(await browser.getUrl()),
      { timeout: 10000 }
    );
    assert.match(await browser.getUrl(), /\/shop/, 'should navigate to a shop page');
  });

  it('should display Instagram posts', async () => {
    await browser.$('main > section.instagram .instagram__tile').waitForExist({ timeout: 10000 });
    const posts = await browser.$$('main > section.instagram .instagram__tile');
    assert.ok(posts.length > 0, 'should display at least one Instagram post');
  });
});
