import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test('renders author name and profile picture', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Carlos Molina');
    await expect(page.locator('img.profile-picture')).toBeVisible();
  });

  test('shows social network links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href*="instagram.com"]')).toBeVisible();
    await expect(page.locator('a[href*="facebook.com"]')).toBeVisible();
    await expect(page.locator('a[href*="youtube.com"]')).toBeVisible();
  });
});
