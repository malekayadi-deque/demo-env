import { test, expect } from '../fixtures/fixtures.js';

test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the shop page
    await page.goto('/shop');
  });

  test('should render the shop page with a product grid', async ({ page }) => {
    // Assert that the shop page main section is visible
    const shopMain = page.locator('section.shop-main');
    await expect(shopMain).toBeVisible();

    // Assert the presence of the product grid
    const productGrid = page.locator('#products-grid');
    await expect(productGrid).toBeVisible();

    // Assert that at least one product card is rendered
    const productCards = productGrid.locator('.product-card-wrapper');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow sorting products', async ({ page }) => {
    // Locate the sorting dropdown
    const sortingDropdown = page.locator('select[aria-label="Sort Items"]');
    await expect(sortingDropdown).toBeVisible();

    // Select a sorting option
    await sortingDropdown.selectOption({ value: '5' });

    // Assert sorting selection
    const selectedOption = await sortingDropdown.inputValue();
    expect(selectedOption).toBe('5');
  });

  test('should change product grid layout based on selected columns', async ({ page }) => {
    // Locate buttons to change the number of columns
    const columnButtons = page.locator('.col-size button');
    await expect(columnButtons).toHaveCount(3);

    // Click the button to set 4 columns
    await columnButtons.nth(2).click();

    // Assert the product grid updates to the selected column layout
    const gridClass = await page.locator('#products-grid').getAttribute('class');
    expect(gridClass).toContain('row-cols-lg-4');
  });

  test('should add a product to the cart', async ({ page }) => {
    const productCard = page.locator('.product-card').first();
    await productCard.hover();
    const addToCartButton = productCard.locator('.pc__atc').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    await expect(addToCartButton).toHaveText('Already Added');
  });

  test('should navigate to a product details page when clicking a product image', async ({ page }) => {
    // Locate the first product image link
    const productLink = page.locator('.product-card .pc__info h6.pc__title a').first();
    await expect(productLink).toBeVisible();

    // Click the product image link
    await productLink.click();

    // Assert that the URL contains the product ID
    await expect(page).toHaveURL(/\/product\/\d+/);
  });

  test('should toggle wishlist status for a product', async ({ page }) => {
    // Locate the first product's "Add to Wishlist" button
    const wishlistButton = page.locator('.product-card .pc__btn-wl').first();
    await expect(wishlistButton).toBeVisible();

    // Click the button to add to the wishlist
    await wishlistButton.click();

    // Assert that the button becomes active
    await expect(wishlistButton).toHaveClass(/active/);

    // Click again to remove from the wishlist
    await wishlistButton.click();

    // Assert that the button is no longer active
    await expect(wishlistButton).not.toHaveClass(/active/);
  });

  test('should display pagination controls', async ({ page }) => {
    // Locate the pagination component
    const pagination = page.locator('.pagination');
    await expect(pagination).toBeVisible();

    // Assert that there are pagination buttons
    const paginationButtons = pagination.locator('a');
    const count = await paginationButtons.count();
    expect(count).toBeGreaterThan(0);
  });
});