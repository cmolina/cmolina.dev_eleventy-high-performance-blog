import { test, expect } from '@playwright/test';

test.describe('tags', () => {
  test('blog index links to /tags/', async ({ page }) => {
    await page.goto('/blog/');
    const link = page.getByRole('link', { name: /browse by tag/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/tags/');
  });

  test.describe('/tags/', () => {
    test('renders heading', async ({ page }) => {
      await page.goto('/tags/');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tags');
    });

    test('lists at least one tag link', async ({ page }) => {
      await page.goto('/tags/');
      const links = page.locator('a.post-tag');
      await expect(links.first()).toBeVisible();
    });

    test('tag link navigates to its tag page', async ({ page }) => {
      await page.goto('/tags/');
      const link = page.locator('a.post-tag').first();
      const tag = await link.textContent();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`/tags/${tag}/`));
      await expect(page.getByRole('heading', { level: 1 })).toContainText(tag!);
    });
  });

  test.describe('/tags/[tag]/', () => {
    test('shows at least one post for the tag', async ({ page }) => {
      await page.goto('/tags/');
      await page.locator('a.post-tag').first().click();
      await expect(page.locator('article').first()).toBeVisible();
    });

    test('has a link back to /tags/', async ({ page }) => {
      await page.goto('/tags/');
      await page.locator('a.post-tag').first().click();
      const backLink = page.getByRole('link', { name: /all tags/i });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/tags/');
    });
  });
});
