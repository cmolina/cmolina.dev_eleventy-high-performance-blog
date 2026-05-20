import { test, expect } from '@playwright/test';

test.describe('about pages', () => {
  test('/about/me/ renders heading', async ({ page }) => {
    await page.goto('/about/me/');
    await expect(page.locator('h1')).toContainText('About Me');
  });

  test('/about/services/ renders heading', async ({ page }) => {
    await page.goto('/about/services/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('/about/values/ renders heading', async ({ page }) => {
    await page.goto('/about/values/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
