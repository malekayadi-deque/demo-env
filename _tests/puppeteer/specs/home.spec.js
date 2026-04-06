require('dotenv').config();
const puppeteer = require('puppeteer');
const { puppeteerConfig, PuppeteerController, wrapPuppeteerPage } = require('@axe-core/watcher/puppeteer');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Home Page (Puppeteer)', () => {
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

  after(async () => { await browser.close(); });
  afterEach(async () => { await controller.flush(); });

  beforeEach(async () => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('header', { timeout: 15000 });
  });

  it('should display the correct page title', async () => {
    const title = await page.title();
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
      await page.waitForSelector(sel, { visible: true, timeout: 10000 });
    }
  });

  it('should display slides in the hero', async () => {
    await page.waitForSelector('div.swiper > div.swiper-wrapper > div.swiper-slide', { timeout: 10000 });
    const slides = await page.$$('div.swiper > div.swiper-wrapper > div.swiper-slide');
    assert.ok(slides.length > 0, 'hero should have at least one slide');
  });

  it('should navigate to shop from Collections section', async () => {
    await page.waitForSelector('section.collections-grid div.collection-grid__item a[href]', { visible: true, timeout: 10000 });
    const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.click('section.collections-grid div.collection-grid__item a[href]');
    await navPromise;
    assert.match(page.url(), /\/shop/, 'URL should navigate to a shop page');
  });

  it('should display Instagram posts', async () => {
    await page.waitForSelector('main > section.instagram .instagram__tile', { timeout: 10000 });
    const posts = await page.$$('main > section.instagram .instagram__tile');
    assert.ok(posts.length > 0, 'should display at least one Instagram post');
  });
});
