import { test, expect } from '@playwright/test';

test.describe('SEO meta tags', () => {
  test('home page has og:title, og:image, and canonical', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Carlos Molina/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /https:\/\/cmolina\.dev/);
  });

  test('post page has post title in og:title and OG image URL', async ({ page }) => {
    await page.goto('/posts/2024/05/rock-with-acdc/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /AC.DC/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\//);
  });

  test('post page has JSON-LD Article schema', async ({ page }) => {
    await page.goto('/posts/2024/05/rock-with-acdc/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const schema = JSON.parse(jsonLd!);
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBeTruthy();
    expect(schema.datePublished).toBeTruthy();
  });
});
