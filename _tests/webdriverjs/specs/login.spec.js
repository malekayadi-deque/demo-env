require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { Builder, until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Login and Register Page (WebdriverJS)', () => {
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
    await browser.get(`${BASE_URL}/login_register`);
    await browser.wait(until.elementLocated(By.id('login-tab')), 10000);
    await browser.executeScript(() => localStorage.clear());
  });

  it('should display login tab by default', async () => {
    const loginTab = await browser.findElement(By.id('login-tab'));
    const cls = await loginTab.getAttribute('class');
    assert.ok(cls.includes('active'), 'login tab should be active');
    await browser.wait(until.elementLocated(By.id('tab-item-login')), 5000);
  });

  it('should switch to register tab', async () => {
    await browser.executeScript("document.getElementById('register-tab').click()");
    await browser.wait(async () => {
      const tab = await browser.findElement(By.id('register-tab'));
      return (await tab.getAttribute('class')).includes('active');
    }, 5000);
    const regTab = await browser.findElement(By.id('register-tab'));
    assert.ok((await regTab.getAttribute('class')).includes('active'), 'register tab should be active');
    await browser.wait(until.elementLocated(By.id('tab-item-register')), 5000);
  });

  it('should login successfully with valid credentials', async () => {
    const emailInput = await browser.findElement(By.name('login_email'));
    const passInput = await browser.findElement(By.name('login_password'));
    await emailInput.sendKeys('test@example.com');
    await passInput.sendKeys('password123');
    const loginBtn = await browser.findElement(By.xpath('//button[normalize-space(.)="Log In"]'));
    await browser.executeScript('arguments[0].click()', loginBtn);
    await browser.wait(until.urlContains('/account_dashboard'), 15000);
    const url = await browser.getCurrentUrl();
    assert.ok(url.includes('/account_dashboard'), 'should navigate to account dashboard');
  });

  it('should register successfully with valid details', async () => {
    await browser.executeScript("document.getElementById('register-tab').click()");
    await browser.wait(until.elementLocated(By.name('register_username')), 5000);
    await browser.findElement(By.name('register_username')).then(el => el.sendKeys('newuser'));
    await browser.findElement(By.name('register_email')).then(el => el.sendKeys('newuser@example.com'));
    await browser.findElement(By.name('register_password')).then(el => el.sendKeys('password123'));
    await browser.executeScript(
      "document.querySelector('#tab-item-register button[type=\"submit\"]').click()"
    );
    await browser.wait(until.urlContains('/account_dashboard'), 15000);
    const url = await browser.getCurrentUrl();
    assert.ok(url.includes('/account_dashboard'), 'should navigate to account dashboard');
  });

  it('should validate required fields on login form', async () => {
    await browser.executeScript("document.querySelector('button[type=\"submit\"]').click()");
    const emailEl = await browser.findElement(By.name('login_email'));
    const passEl = await browser.findElement(By.name('login_password'));
    assert.ok(await emailEl.getAttribute('required') !== null, 'email should be required');
    assert.ok(await passEl.getAttribute('required') !== null, 'password should be required');
  });

  it('should validate required fields on register form', async () => {
    await browser.executeScript("document.getElementById('register-tab').click()");
    await browser.wait(until.elementLocated(By.name('register_username')), 5000);
    await browser.executeScript(
      "document.querySelector('#tab-item-register button[type=\"submit\"]').click()"
    );
    const usernameEl = await browser.findElement(By.name('register_username'));
    const emailEl = await browser.findElement(By.name('register_email'));
    const passEl = await browser.findElement(By.name('register_password'));
    assert.ok(await usernameEl.getAttribute('required') !== null, 'username should be required');
    assert.ok(await emailEl.getAttribute('required') !== null, 'email should be required');
    assert.ok(await passEl.getAttribute('required') !== null, 'password should be required');
  });

  it('should navigate to reset password page', async () => {
    await browser.executeScript("document.querySelector('a[href=\"/reset_password\"]').click()");
    await browser.wait(until.urlContains('/reset_password'), 10000);
    const url = await browser.getCurrentUrl();
    assert.ok(url.includes('/reset_password'), 'should navigate to reset password page');
  });
});
