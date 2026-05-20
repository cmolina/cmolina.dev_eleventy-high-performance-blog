import { test, expect } from '@playwright/test';

const POST = '/posts/2024/05/rock-with-acdc/';

test.describe('share button', () => {
  test('clipboard fallback copies URL and shows toast', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(POST);

    // Disable navigator.share so the clipboard fallback runs
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    });

    await page.locator('#share-link').click();

    const dialog = page.locator('#message');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('copied to clipboard');
  });
});
