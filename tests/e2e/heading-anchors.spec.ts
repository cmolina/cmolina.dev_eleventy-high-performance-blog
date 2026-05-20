import { test, expect } from '@playwright/test';

const POST = '/posts/2024/05/rock-with-acdc/';

test.describe('heading anchors', () => {
  test('every h2 has an id and a .direct-link anchor', async ({ page }) => {
    await page.goto(POST);

    const headings = page.locator('article h2');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const h2 = headings.nth(i);
      const id = await h2.getAttribute('id');
      expect(id, `h2[${i}] must have an id`).toBeTruthy();

      const anchor = h2.locator('a.direct-link');
      await expect(anchor).toHaveCount(1);
      await expect(anchor).toHaveAttribute('href', `#${id}`);
      await expect(anchor).toContainText('¶');
    }
  });

  test('direct-link href navigates to the heading', async ({ page }) => {
    await page.goto(POST);

    const firstAnchor = page.locator('article h2 a.direct-link').first();
    const href = await firstAnchor.getAttribute('href');
    expect(href).toMatch(/^#.+/);

    await page.goto(`${POST}${href}`);
    const targeted = page.locator(`[id="${href!.slice(1)}"]`);
    await expect(targeted).toBeVisible();
  });
});
