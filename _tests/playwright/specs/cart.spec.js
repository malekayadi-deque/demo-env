import { test, expect } from "../fixtures/fixtures.js";

test.describe("Shopping Cart Page", () => {
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
  //For push trigger of workflows
  const totalPrice = mockCartProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/product/249");
    const addToCartButton = page.locator(
      "section.product-single .btn-addtocart",
    );
    // Wait for the button to be visible before clicking
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    await page.goto("/shop_cart");
    // Wait for the cart table to be visible instead of networkidle
    await page.locator(".cart-table").waitFor({ state: "visible" });
  });

  test("should display cart items with correct details", async ({ page }) => {
    const cartTable = page.locator(".cart-table");
    await expect(cartTable).toBeVisible();

    // Check product details
    const productRows = cartTable.locator("tbody tr");
    await expect(productRows).toHaveCount(mockCartProducts.length);

    for (let i = 0; i < mockCartProducts.length; i++) {
      const product = mockCartProducts[i];
      const row = productRows.nth(i);

      await expect(row.locator("h4")).toHaveText(product.title);
      await expect(row.locator(".shopping-cart__product-price")).toHaveText(
        `$${product.price}`,
      );
      await expect(row.locator('input[name="quantity"]')).toHaveValue(
        `${product.quantity}`,
      );
      await expect(row.locator(".shopping-cart__subtotal")).toHaveText(
        `$${product.price * product.quantity}`,
      );
    }
  });

  test("should update quantity of a product", async ({ page }) => {
    // Wait for the cart table to be visible
    const cartTable = page.locator(".cart-table");
    await expect(cartTable).toBeVisible();

    const quantityInput = page.locator('input[name="quantity"]').first();
    const increaseButton = page.locator(".qty-control__increase").first();
    const decreaseButton = page.locator(".qty-control__reduce").first();

    // Wait for the quantity control elements to be visible
    await expect(quantityInput).toBeVisible();
    await expect(increaseButton).toBeVisible();
    await expect(increaseButton).toBeEnabled();

    // Increase quantity
    await increaseButton.click();
    await expect(quantityInput).toHaveValue("2");

    // Decrease quantity
    await decreaseButton.click();
    await expect(quantityInput).toHaveValue("1");
  });

  test("should remove a product from the cart", async ({ page }) => {
    const removeButton = page.locator(".remove-cart").first();
    // Wait for remove button to be visible
    await removeButton.waitFor({ state: "visible" });

    // Remove the first product
    await removeButton.click();

    // Check that the cart updates
    const cartTable = page.locator(".cart-table tbody tr");
    await expect(cartTable).toHaveCount(mockCartProducts.length - 1);
  });

  test("should display cart totals correctly", async ({ page }) => {
    const cartTotals = page.locator(".cart-totals");

    await expect(cartTotals).toBeVisible();

    const subtotalRow = cartTotals
      .locator('tr:has(th:has-text("Subtotal")) td')
      .first();
    await expect(subtotalRow).toHaveText(`$${totalPrice}`);

    const vatRow = cartTotals.locator('tr:has(th:has-text("VAT")) td').first();
    await expect(vatRow).toHaveText("$19");

    const totalRow = cartTotals
      .locator('tr:has(th:has-text("Total")) td')
      .first();
    await expect(totalRow).toHaveText(`$${totalPrice}`);
  });

  test("should proceed to checkout", async ({ page }) => {
    const checkoutButton = page.locator(".btn-checkout");

    await expect(checkoutButton).toBeVisible();

    // Click the checkout button
    await checkoutButton.click();

    // Assert navigation to the checkout page
    await expect(page).toHaveURL("/shop_checkout");
  });
});
