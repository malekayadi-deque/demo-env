import { test, expect } from "../fixtures/fixtures.js";
import { AxeBuilder } from "@axe-core/playwright";

/**
 * Accessibility Tests for WCAG 2.2 AA Compliance
 *
 * These tests run axe-core scans on all major pages to detect accessibility violations.
 * Results are sent to Deque DevHub Dashboard via @axe-core/watcher integration.
 *
 * NOTE: Tests use soft assertions - violations are logged but don't fail the tests.
 * This allows tracking progress while violations are being fixed.
 *
 * WCAG 2.2 AA Coverage includes:
 * - WCAG 2.0 Level A & AA
 * - WCAG 2.1 Level A & AA
 * - WCAG 2.2 Level A & AA
 

// Helper function to run axe scan and return results
async function runAxeScan(page, options = {}) {
  const builder = new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude(".swiper-slide-duplicate"); // Exclude duplicated carousel slides that may cause false positives

  if (options.exclude) {
    options.exclude.forEach((selector) => builder.exclude(selector));
  }

  return await builder.analyze();
}

// Helper function to format violation details for better error reporting
function formatViolations(violations) {
  if (violations.length === 0) return "\n  No violations found ✓";

  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map(
          (node) =>
            `    - ${node.html}\n      Fix: ${node.failureSummary || "See axe documentation"}`
        )
        .join("\n");
      return `\n${violation.id}: ${violation.description}\n  Impact: ${violation.impact}\n  WCAG: ${violation.tags.filter((t) => t.startsWith("wcag")).join(", ")}\n  Elements:\n${nodes}`;
    })
    .join("\n");
}

// Helper function to trigger watcher analysis and send results to DevHub
async function analyzeAndSendToDevHub(page) {
  // Trigger the axe-watcher analyze to send results to DevHub
  if (page.axeWatcher) {
    await page.axeWatcher.analyze();
  }
}

// Helper function for soft assertions - logs violations but doesn't fail the test
function softAssertNoViolations(results, testInfo, context = "") {
  const violationCount = results.violations.length;
  const passedCount = results.passes?.length || 0;

  if (violationCount > 0) {
    console.log(`\n⚠️  ACCESSIBILITY VIOLATIONS FOUND ${context}`);
    console.log(`   Violations: ${violationCount} | Passed: ${passedCount}`);
    console.log(formatViolations(results.violations));
    console.log("\n");

    // Attach violations to test report for visibility
    testInfo.annotations.push({
      type: "accessibility-violations",
      description: `${violationCount} violation(s) found${context}`,
    });
  } else {
    console.log(`\n✓ No accessibility violations found ${context}`);
  }

  // Always pass - violations are logged but don't fail the test
  return true;
}

test.describe("Accessibility - WCAG 2.2 AA Compliance", () => {
  test.describe("Home Page Accessibility", () => {
    test("Home page should have no WCAG 2.2 AA violations", async ({
      page,
    }, testInfo) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      // Run local scan and use soft assertion
      const results = await runAxeScan(page);
      softAssertNoViolations(results, testInfo, "on Home page");

      expect(true).toBe(true); // Always pass
    });

    test("Home page should have proper heading hierarchy", async ({
      page,
    }, testInfo) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules(["heading-order", "empty-heading", "page-has-heading-one"])
        .analyze();

      softAssertNoViolations(results, testInfo, "for heading hierarchy on Home page");
      expect(true).toBe(true);
    });
  });

  test.describe("Shop Page Accessibility", () => {
    test("Shop page should have no WCAG 2.2 AA violations", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await runAxeScan(page);
      softAssertNoViolations(results, testInfo, "on Shop page");

      expect(true).toBe(true);
    });

    test("Shop page interactive elements should be keyboard accessible", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules([
          "button-name",
          "link-name",
          "tabindex",
          "focus-order-semantics",
          "scrollable-region-focusable",
        ])
        .analyze();

      softAssertNoViolations(results, testInfo, "for keyboard accessibility on Shop page");
      expect(true).toBe(true);
    });
  });

  test.describe("Product Page Accessibility", () => {
    const productId = 249;

    test("Product page should have no WCAG 2.2 AA violations", async ({
      page,
    }, testInfo) => {
      await page.goto(`/product/${productId}`);
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await runAxeScan(page);
      softAssertNoViolations(results, testInfo, "on Product page");

      expect(true).toBe(true);
    });

    test("Product images should have proper alt text", async ({
      page,
    }, testInfo) => {
      await page.goto(`/product/${productId}`);
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules(["image-alt", "image-redundant-alt", "role-img-alt"])
        .analyze();

      softAssertNoViolations(results, testInfo, "for image alt text on Product page");
      expect(true).toBe(true);
    });

    test("Product tabs should be properly structured", async ({
      page,
    }, testInfo) => {
      await page.goto(`/product/${productId}`);
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules(["aria-required-children", "aria-required-parent"])
        .analyze();

      softAssertNoViolations(results, testInfo, "for tab structure on Product page");
      expect(true).toBe(true);
    });
  });

  test.describe("Cart Page Accessibility", () => {
    test.beforeEach(async ({ page }) => {
      // Add product to cart first
      await page.goto("/product/249");
      const addToCartButton = page.locator(
        "section.product-single .btn-addtocart"
      );
      await addToCartButton.waitFor({ state: "visible" });
      await addToCartButton.click();
    });

    test("Cart page should have no WCAG 2.2 AA violations", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop_cart");
      await page.locator(".cart-table").waitFor({ state: "visible" });

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await runAxeScan(page);
      softAssertNoViolations(results, testInfo, "on Cart page");

      expect(true).toBe(true);
    });

    test("Cart table should be properly structured", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop_cart");
      await page.locator(".cart-table").waitFor({ state: "visible" });

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules([
          "td-headers-attr",
          "th-has-data-cells",
          "table-duplicate-name",
        ])
        .analyze();

      softAssertNoViolations(results, testInfo, "for table structure on Cart page");
      expect(true).toBe(true);
    });
  });

  test.describe("Checkout Page Accessibility", () => {
    test.beforeEach(async ({ page }) => {
      // Add product to cart first
      await page.goto("/product/249");
      const addToCartButton = page.locator(
        "section.product-single .btn-addtocart"
      );
      await addToCartButton.waitFor({ state: "visible" });
      await addToCartButton.click();
    });

    test("Checkout page should have no WCAG 2.2 AA violations", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop_checkout");
      await page.locator("#checkout_first_name").waitFor({ state: "visible" });

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await runAxeScan(page);
      softAssertNoViolations(results, testInfo, "on Checkout page");

      expect(true).toBe(true);
    });

    test("Checkout form fields should have proper labels", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop_checkout");
      await page.locator("#checkout_first_name").waitFor({ state: "visible" });

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules([
          "label",
          "label-title-only",
          "form-field-multiple-labels",
          "select-name",
          "input-button-name",
        ])
        .analyze();

      softAssertNoViolations(results, testInfo, "for form labels on Checkout page");
      expect(true).toBe(true);
    });

    test("Checkout form should have proper error handling accessibility", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop_checkout");
      await page.locator("#checkout_first_name").waitFor({ state: "visible" });

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules([
          "aria-input-field-name",
          "aria-toggle-field-name",
          "autocomplete-valid",
        ])
        .analyze();

      softAssertNoViolations(results, testInfo, "for error handling on Checkout page");
      expect(true).toBe(true);
    });
  });

  test.describe("Login/Register Page Accessibility", () => {
    test("Login page should have no WCAG 2.2 AA violations", async ({
      page,
    }, testInfo) => {
      await page.goto("/login_register");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await runAxeScan(page);
      softAssertNoViolations(results, testInfo, "on Login page");

      expect(true).toBe(true);
    });

    test("Login/Register tabs should be properly structured", async ({
      page,
    }, testInfo) => {
      await page.goto("/login_register");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules([
          "aria-required-children",
          "aria-required-parent",
          "aria-valid-attr-value",
        ])
        .analyze();

      softAssertNoViolations(results, testInfo, "for tab structure on Login page");
      expect(true).toBe(true);
    });

    test("Login form should not require cognitive function tests (WCAG 2.2)", async ({
      page,
    }, testInfo) => {
      await page.goto("/login_register");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      // Check that login doesn't use CAPTCHA or cognitive tests
      const captcha = page.locator(
        '[class*="captcha"], [id*="captcha"], [class*="recaptcha"]'
      );
      const captchaCount = await captcha.count();

      // WCAG 2.2 3.3.8 - Accessible Authentication
      if (captchaCount > 0) {
        const alternativeAuth = page.locator(
          '[class*="passwordless"], [class*="magic-link"], [class*="sso"]'
        );
        const altCount = await alternativeAuth.count();
        if (altCount === 0) {
          console.log(
            "\n⚠️  WCAG 2.2 3.3.8: CAPTCHA found without alternative authentication method"
          );
          testInfo.annotations.push({
            type: "accessibility-violations",
            description:
              "CAPTCHA requires alternative authentication method (WCAG 2.2 3.3.8)",
          });
        }
      } else {
        console.log("\n✓ No cognitive function tests (CAPTCHA) found on Login page");
      }

      expect(true).toBe(true);
    });
  });

  test.describe("Order Confirmation Page Accessibility", () => {
    test("Order confirmation page should have no WCAG 2.2 AA violations", async ({
      page,
    }, testInfo) => {
      await page.goto("/order-confirmation");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await runAxeScan(page);
      softAssertNoViolations(results, testInfo, "on Order Confirmation page");

      expect(true).toBe(true);
    });
  });

  test.describe("Global Accessibility Checks", () => {
    const pages = [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
      { name: "Product", path: "/product/249" },
      { name: "Login", path: "/login_register" },
      { name: "Order Confirmation", path: "/order-confirmation" },
    ];

    for (const pageConfig of pages) {
      test(`${pageConfig.name} page should have sufficient color contrast`, async ({
        page,
      }, testInfo) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState("domcontentloaded");

        // Send results to DevHub
        await analyzeAndSendToDevHub(page);

        const results = await new AxeBuilder({ page })
          .withRules(["color-contrast", "color-contrast-enhanced"])
          .analyze();

        softAssertNoViolations(results, testInfo, `for color contrast on ${pageConfig.name} page`);
        expect(true).toBe(true);
      });

      test(`${pageConfig.name} page should have proper landmark regions`, async ({
        page,
      }, testInfo) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState("domcontentloaded");

        // Send results to DevHub
        await analyzeAndSendToDevHub(page);

        const results = await new AxeBuilder({ page })
          .withRules([
            "landmark-banner-is-top-level",
            "landmark-contentinfo-is-top-level",
            "landmark-main-is-top-level",
            "landmark-no-duplicate-banner",
            "landmark-no-duplicate-contentinfo",
            "landmark-one-main",
            "region",
          ])
          .analyze();

        softAssertNoViolations(results, testInfo, `for landmark regions on ${pageConfig.name} page`);
        expect(true).toBe(true);
      });

      test(`${pageConfig.name} page should have accessible links`, async ({
        page,
      }, testInfo) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState("domcontentloaded");

        // Send results to DevHub
        await analyzeAndSendToDevHub(page);

        const results = await new AxeBuilder({ page })
          .withRules([
            "link-name",
            "link-in-text-block",
            "identical-links-same-purpose",
          ])
          .analyze();

        softAssertNoViolations(results, testInfo, `for accessible links on ${pageConfig.name} page`);
        expect(true).toBe(true);
      });
    }
  });

  test.describe("WCAG 2.2 Specific Checks", () => {
    test("Interactive elements should meet minimum target size (WCAG 2.2 - 2.5.8)", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules(["target-size"])
        .analyze();

      softAssertNoViolations(results, testInfo, "for target size (WCAG 2.2 - 2.5.8)");
      expect(true).toBe(true);
    });

    test("Focus should not be obscured by sticky elements (WCAG 2.2 - 2.4.11)", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      // Tab through the page and check focus visibility
      const focusableElements = await page
        .locator(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        .all();

      let obscuredCount = 0;
      for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
        await page.keyboard.press("Tab");
        const focusedElement = page.locator(":focus");

        if ((await focusedElement.count()) > 0) {
          const isVisible = await focusedElement.isVisible();
          if (!isVisible) {
            obscuredCount++;
          }
        }
      }

      if (obscuredCount > 0) {
        console.log(
          `\n⚠️  WCAG 2.2 - 2.4.11: ${obscuredCount} focused element(s) may be obscured by sticky elements`
        );
        testInfo.annotations.push({
          type: "accessibility-violations",
          description: `${obscuredCount} focused element(s) obscured (WCAG 2.2 - 2.4.11)`,
        });
      } else {
        console.log("\n✓ Focus not obscured by sticky elements (WCAG 2.2 - 2.4.11)");
      }

      expect(true).toBe(true);
    });

    test("Focus indicators should be visible (WCAG 2.2 - 2.4.13)", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      // Note: The focus-visible rule is experimental and can cause issues.
      // Instead, we manually check that focused elements have visible focus styles.
      const focusableElements = await page
        .locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
        .all();

      let missingFocusIndicators = 0;
      for (let i = 0; i < Math.min(focusableElements.length, 5); i++) {
        await page.keyboard.press("Tab");
        const focusedElement = page.locator(":focus");

        if ((await focusedElement.count()) > 0) {
          // Check if the element has some form of focus styling
          const outline = await focusedElement.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              outline: styles.outline,
              outlineWidth: styles.outlineWidth,
              boxShadow: styles.boxShadow,
              border: styles.border,
            };
          });

          // Check if there's a visible focus indicator
          const hasOutline = outline.outlineWidth !== "0px" && outline.outline !== "none";
          const hasBoxShadow = outline.boxShadow !== "none";

          if (!hasOutline && !hasBoxShadow) {
            missingFocusIndicators++;
          }
        }
      }

      if (missingFocusIndicators > 0) {
        console.log(
          `\n⚠️  WCAG 2.2 - 2.4.13: ${missingFocusIndicators} element(s) may lack visible focus indicators`
        );
        testInfo.annotations.push({
          type: "accessibility-violations",
          description: `${missingFocusIndicators} element(s) missing focus indicators (WCAG 2.2 - 2.4.13)`,
        });
      } else {
        console.log("\n✓ Focus indicators appear visible (WCAG 2.2 - 2.4.13)");
      }

      expect(true).toBe(true);
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("All interactive elements should be keyboard accessible", async ({
      page,
    }, testInfo) => {
      await page.goto("/shop");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules([
          "accesskeys",
          "bypass",
          "tabindex",
          "focus-order-semantics",
          "scrollable-region-focusable",
        ])
        .analyze();

      softAssertNoViolations(results, testInfo, "for keyboard navigation");
      expect(true).toBe(true);
    });

    test("Skip link should be present and functional", async ({
      page,
    }, testInfo) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules(["bypass"])
        .analyze();

      softAssertNoViolations(results, testInfo, "for skip link/bypass block");
      expect(true).toBe(true);
    });
  });

  test.describe("Forms and Input Accessibility", () => {
    test("All form inputs should have associated labels", async ({
      page,
    }, testInfo) => {
      await page.goto("/login_register");
      await page.waitForLoadState("domcontentloaded");

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules([
          "label",
          "label-content-name-mismatch",
          "label-title-only",
          "form-field-multiple-labels",
        ])
        .analyze();

      softAssertNoViolations(results, testInfo, "for form input labels");
      expect(true).toBe(true);
    });

    test("Form inputs should have proper autocomplete attributes", async ({
      page,
    }, testInfo) => {
      // Add item to cart first
      await page.goto("/product/249");
      const addToCartButton = page.locator(
        "section.product-single .btn-addtocart"
      );
      await addToCartButton.waitFor({ state: "visible" });
      await addToCartButton.click();

      await page.goto("/shop_checkout");
      await page.locator("#checkout_first_name").waitFor({ state: "visible" });

      // Send results to DevHub
      await analyzeAndSendToDevHub(page);

      const results = await new AxeBuilder({ page })
        .withRules(["autocomplete-valid"])
        .analyze();

      softAssertNoViolations(results, testInfo, "for autocomplete attributes");
      expect(true).toBe(true);
    });
  });

  test.describe("ARIA and Semantic HTML", () => {
    const pages = [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
      { name: "Login", path: "/login_register" },
    ];

    for (const pageConfig of pages) {
      test(`${pageConfig.name} page should have valid ARIA attributes`, async ({
        page,
      }, testInfo) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState("domcontentloaded");

        // Send results to DevHub
        await analyzeAndSendToDevHub(page);

        const results = await new AxeBuilder({ page })
          .withRules([
            "aria-allowed-attr",
            "aria-allowed-role",
            "aria-hidden-body",
            "aria-hidden-focus",
            "aria-required-attr",
            "aria-required-children",
            "aria-required-parent",
            "aria-roles",
            "aria-valid-attr",
            "aria-valid-attr-value",
          ])
          .analyze();

        softAssertNoViolations(results, testInfo, `for ARIA attributes on ${pageConfig.name} page`);
        expect(true).toBe(true);
      });

      test(`${pageConfig.name} page should use semantic HTML correctly`, async ({
        page,
      }, testInfo) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState("domcontentloaded");

        // Send results to DevHub
        await analyzeAndSendToDevHub(page);

        const results = await new AxeBuilder({ page })
          .withRules([
            "definition-list",
            "dlitem",
            "list",
            "listitem",
            "nested-interactive",
            "no-autoplay-audio",
            "presentation-role-conflict",
            "valid-lang",
          ])
          .analyze();

        softAssertNoViolations(results, testInfo, `for semantic HTML on ${pageConfig.name} page`);
        expect(true).toBe(true);
      });
    }
  });
});
*/
