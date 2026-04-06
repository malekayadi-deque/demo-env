import { test, expect } from "../fixtures/fixtures.js";

test.describe("Product Details Page", () => {
  // Mock product data to pass into the page
  const product = {
    id: 249,
    title: "End Grain Cutting Board",
    price: 120,
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the product details page
    await page.goto(`/product/${product.id}`);
  });

  test("should display product details correctly", async ({ page }) => {
    // Check product title
    const productTitle = page.locator("h1.product-single__name").first();
    await expect(productTitle).toHaveText(product.title);

    // Check product price
    const productPrice = page
      .locator(".product-single__price .current-price")
      .first();
    await expect(productPrice).toHaveText(`$${product.price}`);
  });

  test("should display product rating and reviews", async ({ page }) => {
    // Check the star rating component
    const starRating = page.locator(".product-single__rating .reviews-group");
    await expect(starRating).toBeVisible();

    // Check the review count text
    const reviewText = page.locator(".product-single__rating .reviews-note");
    await expect(reviewText).toHaveText(/8k\+ reviews/);
  });

  test("should update quantity when using the controls", async ({ page }) => {
    const quantityInput = page.locator(
      'section.product-single input[name="quantity"]'
    );
    const increaseButton = page.locator(
      "section.product-single .qty-control__increase"
    );
    const decreaseButton = page.locator(
      "section.product-single .qty-control__reduce"
    );

    // Check initial quantity
    await expect(quantityInput).toHaveValue("1");

    // Increase quantity
    await increaseButton.click();
    await expect(quantityInput).toHaveValue("2");

    // Decrease quantity
    await decreaseButton.click();
    await expect(quantityInput).toHaveValue("1");
  });

  test("should add the product to the cart", async ({ page }) => {
    const addToCartButton = page.locator(
      "section.product-single .btn-addtocart"
    );

    // Check the button text before adding to cart
    await expect(addToCartButton).toHaveText("Add to Cart");

    // Click the "Add to Cart" button
    await addToCartButton.click();

    // Check the button text after adding to cart
    await expect(addToCartButton).toHaveText("Already Added");
  });

  test("should switch between product tabs", async ({ page }) => {
    // Locate the tabs
    const descriptionTab = page.locator(
      "section.product-single #tab-description-tab"
    );
    const additionalInfoTab = page.locator(
      "section.product-single #tab-additional-info-tab"
    );
    const reviewsTab = page.locator("section.product-single #tab-reviews-tab");

    // Click on the "Additional Information" tab
    await additionalInfoTab.click();
    const additionalInfoContent = page.locator(
      "section.product-single #tab-additional-info"
    );
    await expect(additionalInfoContent).toHaveClass(/active/);

    // Click on the "Reviews" tab
    await reviewsTab.click();
    const reviewsContent = page.locator("section.product-single #tab-reviews");
    await expect(reviewsContent).toHaveClass(/active/);

    // Click back to the "Description" tab
    await descriptionTab.click();
    const descriptionContent = page.locator(
      "section.product-single #tab-description"
    );
    await expect(descriptionContent).toHaveClass(/active/);
  });

  test("should navigate to next and previous products", async ({ page }) => {
    const prevLink = page.locator(
      '.product-single__prev-next a:has-text("Prev")'
    );
    const nextLink = page.locator(
      '.product-single__prev-next a:has-text("Next")'
    );

    // Check the "Prev" link
    await expect(prevLink).toBeVisible();
    await prevLink.click();
    await expect(page).toHaveURL(/\/product\/\d+/);

    // Check the "Next" link
    await page.goto(`/product/${product.id}`);
    await expect(nextLink).toBeVisible();
    await nextLink.click();
    await expect(page).toHaveURL(/\/product\/\d+/);
  });
});
