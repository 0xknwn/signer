import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("signer");

  await page.getByRole("link", { name: "login" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goBack();
  await page.getByRole("link", { name: "register" }).click();
  await expect(page).toHaveURL(/\/register$/);

  await page.goBack();
});
