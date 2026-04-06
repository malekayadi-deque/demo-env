require('dotenv').config();
const puppeteer = require('puppeteer');
const { puppeteerConfig, PuppeteerController, wrapPuppeteerPage } = require('@axe-core/watcher/puppeteer');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Accessibility monitoring — axe Watcher (Puppeteer)', () => {
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

  it('home page loads', async () => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForSelector('body');
    const body = await page.$('body');
    assert.ok(body, 'body element should exist');
  });

  it('shop page loads with product grid', async () => {
    await page.goto(`${BASE_URL}/shop`);
    await page.waitForSelector('section.shop-main');
    await page.waitForSelector('#products-grid');
    const productCards = await page.$$('#products-grid .product-card-wrapper');
    assert.ok(productCards.length > 0, 'product grid should have at least one product card');
  });

  it('shop cart page loads', async () => {
    await page.goto(`${BASE_URL}/shop_cart`);
    await page.waitForSelector('body');
    const body = await page.$('body');
    assert.ok(body, 'cart page body should exist');
  });

  it('login/register page loads with login tab active', async () => {
    await page.goto(`${BASE_URL}/login_register`);
    await page.waitForSelector('#login-tab');
    const loginTabClass = await page.$eval('#login-tab', (el) => el.className);
    assert.ok(loginTabClass.includes('active'), 'login tab should be active by default');
  });
});
