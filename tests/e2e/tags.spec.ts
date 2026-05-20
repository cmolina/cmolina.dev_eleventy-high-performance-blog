import { test, expect } from '@playwright/test';

test.describe('tags pages', () => {
  test('/tags/ renders Tags heading', async ({ page }) => {
    await page.goto('/tags/');
    await expect(page.locator('h1')).toHaveText('Tags');
  });
});
