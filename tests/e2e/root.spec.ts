import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("signer");

  await page.getByRole("link", { name: "signin" }).click();
  await expect(page).toHaveURL(/\/signin$/);

  await page.goBack();
  await page.getByRole("link", { name: "signup" }).click();
  await expect(page).toHaveURL(/\/signup$/);

  await page.goBack();
});
