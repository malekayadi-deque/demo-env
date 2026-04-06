import { test, expect } from "../fixtures/fixtures.js";

test.describe("Order Confirmation Page", () => {
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
    await page.goto("/order-confirmation");
  });

  test("should display order completion message", async ({ page }) => {
    const completionMessage = page.locator(".order-complete__message h3");
    const thankYouMessage = page.locator(".order-complete__message p");

    await expect(completionMessage).toHaveText("Your order is completed!");
    await expect(thankYouMessage).toHaveText(
      "Thank you. Your order has been received."
    );
  });

  test("should display order info details", async ({ page }) => {
    const orderNumber = page.locator(
      '.order-info__item:has(label:text("Order Number")) span'
    );
    const orderDate = page.locator(
      '.order-info__item:has(label:text("Date")) span'
    );
    const orderTotal = page.locator(
      '.order-info__item:has(label:text("Total")) span'
    );

    await expect(orderNumber).toHaveText("13119");
    await expect(orderDate).toHaveText(new Date().toLocaleDateString());
    await expect(orderTotal).toHaveText(`$0`);
  });

  test("should display order details table", async ({ page }) => {
    const cartRows = page.locator(".checkout-cart-items tbody tr");
    await expect(cartRows).toHaveCount(0);
  });
});
