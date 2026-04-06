// import { test, expect } from '@playwright/test';
import { test, expect } from "../fixtures/fixtures.js";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");
  });

  test("should display the correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Home \|\| Embel \|\| Luxury by design/);
  });

  test("should render all main sections", async ({ page }) => {
    // Validate Header
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Validate Hero Section
    const hero = page.locator(
      "main > div.swiper.swiper-container.swiper-container-horizontal"
    );
    await expect(hero).toBeVisible();

    // Validate Collections Section
    const collections = page.locator("main > section.collections-grid");
    await expect(collections).toBeVisible();

    // Validate Best Selling Section
    const bestSelling = page.locator("main > section.products-carousel");
    await expect(bestSelling).toBeVisible();

    // Validate Lookbook Section
    const lookbook = page.locator("main > section.lookbook-products");
    await expect(lookbook).toBeVisible();

    // Validate Blogs Section
    const blogs = page.locator("main > section.blog-carousel");
    await expect(blogs).toBeVisible();

    // Validate Brands Section
    const brands = page.locator("main > section.brands-carousel");
    await expect(brands).toBeVisible();

    // Validate Instagram Section
    const instagram = page.locator("main > section.instagram");
    await expect(instagram).toBeVisible();

    // Validate Features Section
    const features = page.locator("main > section.service-promotion");
    await expect(features).toBeVisible();

    // Validate Footer
    const footer = page.locator("footer.footer");
    await expect(footer).toBeVisible();
  });

  test("should display slides in the hero", async ({ page }) => {
    const swiperSlides = page.locator(
      "div.swiper > div.swiper-wrapper > div.swiper-slide"
    );

    // Get the count of matching elements
    const count = await swiperSlides.count();

    // Assert that the count is greater than 0
    expect(count).toBeGreaterThan(0);
  });

  test("should navigate to product pages from Collections section", async ({
    page,
  }) => {
    const collectionItems = page.locator(
      "section.collections-grid div.collection-grid__item a[href]"
    );
    const firstCollectionItem = collectionItems.first();

    await expect(firstCollectionItem).toBeVisible();
    await firstCollectionItem.click();

    // Validate navigation
    await expect(page).toHaveURL(/.*\/shop\w*/);
  });

  // test('should navigate to blog posts from Blogs section', async ({ page }) => {
  //   const blogLinks = page.locator('main > section.blog-carousel .blog-grid__item-detail a');
  //   const firstBlogLink = blogLinks.first();

  //   await expect(firstBlogLink).toBeVisible();
  //   await firstBlogLink.click();

  //   // Validate navigation
  //   await expect(page).toHaveURL(/.*\/blog\/\w*/);
  // });

  test("should display Instagram posts", async ({ page }) => {
    const instagramPosts = page.locator(
      "main > section.instagram .instagram__tile"
    );
    const count = await instagramPosts.count();
    expect(count).toBeGreaterThan(0);
  });
});
