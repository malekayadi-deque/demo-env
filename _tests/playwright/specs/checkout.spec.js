import { test, expect } from "../fixtures/fixtures.js";

test.describe("Checkout Page", () => {
  const mockCartProducts = [
    {
      id: 249,
      category: "Kitchen",
      title: "End Grain Cutting Board",
      price: 120,
      imgSrc: "/assets/images/products/home/cutting-board.jpg",
      imgSrc2: "/assets/images/products/home/cutting-board.jpg",
      reviews: "8k+ reviews",
      rating: 5,
      quantity: 1,
    },
  ];
  const totalPrice = mockCartProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  test.beforeEach(async ({ page }) => {
    // Add product to cart first
    await page.goto("/product/249");
    const addToCartButton = page.locator(
      "section.product-single .btn-addtocart"
    );
    // Wait for the button to be visible before clicking
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    // Navigate to the checkout page
    await page.goto("/shop_checkout");
    // Wait for the checkout form to be visible instead of networkidle
    await page.locator("#checkout_first_name").waitFor({ state: "visible" });
  });

  test("should display the billing details form", async ({ page }) => {
    const firstNameInput = page.locator("#checkout_first_name");
    const lastNameInput = page.locator("#checkout_last_name");

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();

    await firstNameInput.fill("John");
    await lastNameInput.fill("Doe");

    await expect(firstNameInput).toHaveValue("John");
    await expect(lastNameInput).toHaveValue("Doe");
  });

  test("should handle the country/region dropdown", async ({ page }) => {
    const dropdown = page.locator("#search-dropdown");

    // Wait for dropdown to be visible before clicking
    await expect(dropdown).toBeVisible();

    // Open the dropdown
    await dropdown.click();

    const dropdownItems = page.locator("ul.search-suggestion");
    // Wait for dropdown items to be visible with explicit timeout
    await dropdownItems.waitFor({ state: "visible", timeout: 10000 });

    // Select a country
    const usOption = dropdownItems.locator("text=United States");
    await usOption.waitFor({ state: "visible" });
    await usOption.click();

    await expect(dropdown).toHaveValue("United States");
  });
});
