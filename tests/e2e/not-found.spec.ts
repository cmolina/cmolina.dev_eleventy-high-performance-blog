import { test, expect } from '@playwright/test';

test.describe('404 page', () => {
  test('unknown route shows not-found content', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');
    await expect(page.locator('h1')).toContainText('not found');
    expect(response?.status()).toBe(404);
  });
});
