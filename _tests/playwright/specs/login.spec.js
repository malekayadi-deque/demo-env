import { test, expect } from '../fixtures/fixtures.js';

test.describe('Login and Register Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the login/register page
        await page.goto('/login_register');
    });

    test('should display login tab by default', async ({ page }) => {
        const loginTab = page.locator('#login-tab');
        const loginForm = page.locator('#tab-item-login');

        // Verify login tab is active
        await expect(loginTab).toHaveClass(/active/);

        // Verify login form is visible
        await expect(loginForm).toBeVisible();
    });

    test('should switch to register tab', async ({ page }) => {
        const registerTab = page.locator('#register-tab');
        const registerForm = page.locator('#tab-item-register');

        // Click the register tab
        await registerTab.click();

        // Verify register tab is active
        await expect(registerTab).toHaveClass(/active/);

        // Verify register form is visible
        await expect(registerForm).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        const emailInput = page.locator('input[name="login_email"]');
        const passwordInput = page.locator('input[name="login_password"]');
        const loginButton = page.locator('button:text("Log In")').first();

        // Fill out the login form
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        // Click the login button
        await loginButton.click();

        // Verify redirection to the account dashboard
        await expect(page).toHaveURL('/account_dashboard');
    });

    test('should register successfully with valid details', async ({ page }) => {
        const registerTab = page.locator('#register-tab');
        const usernameInput = page.locator('input[name="register_username"]');
        const emailInput = page.locator('input[name="register_email"]');
        const passwordInput = page.locator('input[name="register_password"]');
        const registerButton = page.locator('button:text("Register")').first();

        // Switch to register tab
        await registerTab.click();

        // Fill out the registration form
        await usernameInput.fill('newuser');
        await emailInput.fill('newuser@example.com');
        await passwordInput.fill('password123');

        // Click the register button
        await registerButton.click();

        // Verify redirection to the account dashboard
        await expect(page).toHaveURL('/account_dashboard');
    });

    test('should validate required fields on login form', async ({ page }) => {
        const loginButton = page.locator('button:text("Log In")').first();

        // Attempt to log in without filling out the form
        await loginButton.click();

        // Verify required field validation messages
        const emailInput = page.locator('input[name="login_email"]');
        const passwordInput = page.locator('input[name="login_password"]');
        await expect(emailInput).toHaveAttribute('required', '');
        await expect(passwordInput).toHaveAttribute('required', '');
    });

    test('should validate required fields on register form', async ({ page }) => {
        const registerTab = page.locator('#register-tab');
        const registerButton = page.locator('button:text("Register")').first();

        // Switch to register tab
        await registerTab.click();

        // Attempt to register without filling out the form
        await registerButton.click();

        // Verify required field validation messages
        const usernameInput = page.locator('input[name="register_username"]');
        const emailInput = page.locator('input[name="register_email"]');
        const passwordInput = page.locator('input[name="register_password"]');
        await expect(usernameInput).toHaveAttribute('required', '');
        await expect(emailInput).toHaveAttribute('required', '');
        await expect(passwordInput).toHaveAttribute('required', '');
    });

    test('should navigate to reset password page', async ({ page }) => {
        const resetPasswordLink = page.locator('a:text("Lost password?")').first();

        // Click the reset password link
        await resetPasswordLink.click();

        // Verify navigation to the reset password page
        await expect(page).toHaveURL('/reset_password');
    });
});
