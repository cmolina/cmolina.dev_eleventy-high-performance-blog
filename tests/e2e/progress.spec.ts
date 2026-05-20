import { test, expect } from '@playwright/test';

const POST = '/posts/2023/12/faster-and-cost-effective-github-actions/';

test.describe('reading progress bar', () => {
  test('starts at -100vw and advances on scroll', async ({ page }) => {
    await page.goto(POST);

    // Wait for ResizeObserver + rAF to set initial state
    await page.waitForFunction(() => {
      const el = document.getElementById('reading-progress');
      return el && (el as HTMLElement).style.transform !== '';
    });

    const topTransform = await page.locator('#reading-progress').evaluate(
      (el) => (el as HTMLElement).style.transform,
    );
    expect(topTransform).toContain('translate(-100vw');

    // Scroll to bottom and wait for the transform to change
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(() => {
      const el = document.getElementById('reading-progress');
      return el && !(el as HTMLElement).style.transform.includes('translate(-100vw');
    });

    const bottomTransform = await page.locator('#reading-progress').evaluate(
      (el) => (el as HTMLElement).style.transform,
    );
    expect(bottomTransform).toContain('translate(');
    expect(bottomTransform).not.toContain('translate(-100vw');
  });
});
