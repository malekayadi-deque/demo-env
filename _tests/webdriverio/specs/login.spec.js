require('dotenv').config();
const chromeBinary = require('puppeteer').executablePath();
const { remote } = require('webdriverio');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

describe('Login and Register Page (WebdriverIO)', () => {
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
    await browser.url(`${BASE_URL}/login_register`);
    await browser.$('#login-tab').waitForDisplayed({ timeout: 10000 });
    await browser.execute(() => localStorage.clear());
  });

  it('should display login tab by default', async () => {
    const cls = await browser.$('#login-tab').getAttribute('class');
    assert.ok(cls.includes('active'), 'login tab should be active');
    await browser.$('#tab-item-login').waitForDisplayed({ timeout: 5000 });
  });

  it('should switch to register tab', async () => {
    await browser.$('#register-tab').click();
    await browser.waitUntil(
      async () => (await browser.$('#register-tab').getAttribute('class')).includes('active'),
      { timeout: 5000 }
    );
    const cls = await browser.$('#register-tab').getAttribute('class');
    assert.ok(cls.includes('active'), 'register tab should be active');
    await browser.$('#tab-item-register').waitForDisplayed({ timeout: 5000 });
  });

  it('should login successfully with valid credentials', async () => {
    await browser.$('input[name="login_email"]').setValue('test@example.com');
    await browser.$('input[name="login_password"]').setValue('password123');
    await browser.$('button=Log In').click();
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes('/account_dashboard'),
      { timeout: 15000 }
    );
    assert.ok((await browser.getUrl()).includes('/account_dashboard'), 'should navigate to account dashboard');
  });

  it('should register successfully with valid details', async () => {
    await browser.$('#register-tab').click();
    await browser.$('input[name="register_username"]').waitForDisplayed({ timeout: 5000 });
    await browser.$('input[name="register_username"]').setValue('newuser');
    await browser.$('input[name="register_email"]').setValue('newuser@example.com');
    await browser.$('input[name="register_password"]').setValue('password123');
    await browser.$('button=Register').click();
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes('/account_dashboard'),
      { timeout: 15000 }
    );
    assert.ok((await browser.getUrl()).includes('/account_dashboard'), 'should navigate to account dashboard');
  });

  it('should validate required fields on login form', async () => {
    await browser.$('button=Log In').click();
    const emailRequired = await browser.$('input[name="login_email"]').getAttribute('required');
    const passRequired = await browser.$('input[name="login_password"]').getAttribute('required');
    assert.ok(emailRequired !== null, 'email input should be required');
    assert.ok(passRequired !== null, 'password input should be required');
  });

  it('should validate required fields on register form', async () => {
    await browser.$('#register-tab').click();
    await browser.$('input[name="register_username"]').waitForDisplayed({ timeout: 5000 });
    await browser.$('button=Register').click();
    const usernameRequired = await browser.$('input[name="register_username"]').getAttribute('required');
    const emailRequired = await browser.$('input[name="register_email"]').getAttribute('required');
    const passRequired = await browser.$('input[name="register_password"]').getAttribute('required');
    assert.ok(usernameRequired !== null, 'username should be required');
    assert.ok(emailRequired !== null, 'email should be required');
    assert.ok(passRequired !== null, 'password should be required');
  });

  it('should navigate to reset password page', async () => {
    await browser.$('a=Lost password?').click();
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes('/reset_password'),
      { timeout: 10000 }
    );
    assert.ok((await browser.getUrl()).includes('/reset_password'), 'should navigate to reset password page');
  });
});
