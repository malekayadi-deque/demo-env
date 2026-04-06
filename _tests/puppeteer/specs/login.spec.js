require('dotenv').config();
const puppeteer = require('puppeteer');
const { puppeteerConfig, PuppeteerController, wrapPuppeteerPage } = require('@axe-core/watcher/puppeteer');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Login and Register Page (Puppeteer)', () => {
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
    await page.goto(`${BASE_URL}/login_register`);
    await page.waitForSelector('#login-tab', { visible: true, timeout: 10000 });
    // Clear any auth state
    await page.evaluate(() => localStorage.clear());
  });

  it('should display login tab by default', async () => {
    const loginTabClass = await page.$eval('#login-tab', el => el.className);
    assert.ok(loginTabClass.includes('active'), 'login tab should be active');
    await page.waitForSelector('#tab-item-login', { visible: true, timeout: 5000 });
  });

  it('should switch to register tab', async () => {
    await page.click('#register-tab');
    await page.waitForFunction(
      () => document.querySelector('#register-tab')?.className.includes('active'),
      { timeout: 5000 }
    );
    const regTabClass = await page.$eval('#register-tab', el => el.className);
    assert.ok(regTabClass.includes('active'), 'register tab should be active');
    await page.waitForSelector('#tab-item-register', { visible: true, timeout: 5000 });
  });

  it('should login successfully with valid credentials', async () => {
    await page.type('input[name="login_email"]', 'test@example.com');
    await page.type('input[name="login_password"]', 'password123');
    const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.trim() === 'Log In');
      if (btn) btn.click();
    });
    await navPromise;
    assert.ok(page.url().includes('/account_dashboard'), 'should navigate to account dashboard');
  });

  it('should register successfully with valid details', async () => {
    await page.click('#register-tab');
    await page.waitForSelector('input[name="register_username"]', { visible: true, timeout: 5000 });
    await page.type('input[name="register_username"]', 'newuser');
    await page.type('input[name="register_email"]', 'newuser@example.com');
    await page.type('input[name="register_password"]', 'password123');
    const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.trim() === 'Register');
      if (btn) btn.click();
    });
    await navPromise;
    assert.ok(page.url().includes('/account_dashboard'), 'should navigate to account dashboard');
  });

  it('should validate required fields on login form', async () => {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.trim() === 'Log In');
      if (btn) btn.click();
    });
    const emailRequired = await page.$eval('input[name="login_email"]', el => el.required);
    const passRequired = await page.$eval('input[name="login_password"]', el => el.required);
    assert.ok(emailRequired, 'email input should be required');
    assert.ok(passRequired, 'password input should be required');
  });

  it('should validate required fields on register form', async () => {
    // inputs are always in the DOM (Bootstrap tabs hide via CSS, don't remove elements)
    const usernameRequired = await page.$eval('input[name="register_username"]', el => el.required);
    const emailRequired = await page.$eval('input[name="register_email"]', el => el.required);
    const passRequired = await page.$eval('input[name="register_password"]', el => el.required);
    assert.ok(usernameRequired, 'username input should be required');
    assert.ok(emailRequired, 'email input should be required');
    assert.ok(passRequired, 'password input should be required');
  });

  it('should navigate to reset password page', async () => {
    const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.evaluate(() => {
      const link = Array.from(document.querySelectorAll('a'))
        .find(a => a.textContent.includes('Lost password?'));
      if (link) link.click();
    });
    await navPromise;
    assert.ok(page.url().includes('/reset_password'), 'should navigate to reset password page');
  });
});
