require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { Builder, until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Home Page (WebdriverJS)', () => {
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
    await browser.get(`${BASE_URL}/`);
    await browser.wait(until.elementLocated(By.css('header')), 10000);
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
      await browser.wait(until.elementLocated(By.css(sel)), 10000);
    }
  });

  it('should display slides in the hero', async () => {
    await browser.wait(until.elementLocated(By.css('div.swiper > div.swiper-wrapper > div.swiper-slide')), 10000);
    const slides = await browser.findElements(By.css('div.swiper > div.swiper-wrapper > div.swiper-slide'));
    assert.ok(slides.length > 0, 'hero should have at least one slide');
  });

  it('should navigate to shop from Collections section', async () => {
    await browser.wait(until.elementLocated(By.css('section.collections-grid div.collection-grid__item a[href]')), 10000);
    await browser.executeScript(
      "document.querySelector('section.collections-grid div.collection-grid__item a[href]').click()"
    );
    await browser.wait(until.urlMatches(/\/shop/), 10000);
    const url = await browser.getCurrentUrl();
    assert.match(url, /\/shop/, 'should navigate to a shop page');
  });

  it('should display Instagram posts', async () => {
    await browser.wait(until.elementLocated(By.css('main > section.instagram .instagram__tile')), 10000);
    const posts = await browser.findElements(By.css('main > section.instagram .instagram__tile'));
    assert.ok(posts.length > 0, 'should display at least one Instagram post');
  });
});
