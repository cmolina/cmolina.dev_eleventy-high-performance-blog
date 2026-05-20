import { test, expect } from '@playwright/test';

test.describe('blog index', () => {
  test('renders heading and at least one post', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('h1')).toHaveText('Blog');
    await expect(page.locator('#posts article').first()).toBeVisible();
  });

  test('each post card has a title link and a date', async ({ page }) => {
    await page.goto('/blog/');
    const first = page.locator('#posts article').first();
    await expect(first.locator('h2 a')).toBeVisible();
    await expect(first.locator('time')).toBeVisible();
  });

  test('post title link navigates to the post', async ({ page }) => {
    await page.goto('/blog/');
    const link = page.locator('#posts article h2 a').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/posts\//);
    await link.click();
    await expect(page).toHaveURL(href!);
  });
});
