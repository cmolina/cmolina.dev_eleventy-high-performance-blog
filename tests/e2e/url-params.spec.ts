import { test, expect } from '@playwright/test';

test.describe('URL parameter stripping', () => {
  test('strips tracking params on page load', async ({ page }) => {
    await page.goto('/blog/?utm_source=newsletter&utm_medium=email');
    await page.waitForURL('/blog/');
    await expect(page).toHaveURL('/blog/');
  });

  test('strips params on home page', async ({ page }) => {
    await page.goto('/?ref=twitter');
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});
