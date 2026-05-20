import { test, expect } from '@playwright/test';

// 2nd newest post — has both prev (older) and next (newer) navigation
const POST = '/posts/2023/12/faster-and-cost-effective-github-actions/';

test.describe('post detail', () => {
  test('renders title, read time, and publish date', async ({ page }) => {
    await page.goto(POST);
    await expect(page.locator('h1')).toContainText('GitHub Actions');
    await expect(page.locator('aside')).toContainText('min read');
    await expect(page.locator('time').first()).toBeVisible();
  });

  test('has prev and next navigation links', async ({ page }) => {
    await page.goto(POST);
    await expect(page.locator('a[rel="prev"]')).toBeVisible();
    await expect(page.locator('a[rel="next"]')).toBeVisible();
  });

  test('prev link navigates to an older post', async ({ page }) => {
    await page.goto(POST);
    const href = await page.locator('a[rel="prev"]').getAttribute('href');
    expect(href).toMatch(/^\/posts\//);
    await page.goto(href!);
    await expect(page.locator('header h1')).toBeVisible();
  });

  test('next link navigates to a newer post', async ({ page }) => {
    await page.goto(POST);
    const href = await page.locator('a[rel="next"]').getAttribute('href');
    expect(href).toMatch(/^\/posts\//);
    await page.goto(href!);
    await expect(page.locator('header h1')).toBeVisible();
  });
});
