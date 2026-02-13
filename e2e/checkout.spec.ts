import { test, expect } from "@playwright/test";
import { loginAsUser, addProductToCart } from "./fixtures/helpers";

test.describe("Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, "test-customer@richmond.dev");
    await addProductToCart(page, "premium-widget");
  });

  test("completes checkout successfully", async ({ page }) => {
    await page.goto("/checkout");
    await page.fill("[data-testid=card-number]", "4242424242424242");
    await page.fill("[data-testid=card-expiry]", "12/27");
    await page.fill("[data-testid=card-cvc]", "123");
    await page.click("[data-testid=pay-button]");

    await expect(page.locator("[data-testid=order-confirmation]")).toBeVisible();
    await expect(page.locator("[data-testid=order-number]")).toHaveText(/ORD-/);
  });

  test("shows error on payment failure", async ({ page }) => {
    await page.goto("/checkout");
    await page.fill("[data-testid=card-number]", "4000000000000002"); // decline card
    await page.fill("[data-testid=card-expiry]", "12/27");
    await page.fill("[data-testid=card-cvc]", "123");
    await page.click("[data-testid=pay-button]");

    await expect(page.locator("[data-testid=payment-error]")).toBeVisible();
    await expect(page.locator("[data-testid=try-again-button]")).toBeVisible();
  });

  test("applies coupon code correctly", async ({ page }) => {
    await page.goto("/checkout");
    await page.click("[data-testid=add-coupon]");
    await page.fill("[data-testid=coupon-input]", "SAVE20");
    await page.click("[data-testid=apply-coupon]");

    await expect(page.locator("[data-testid=discount-amount]")).toHaveText("-$20.00");
  });
});
