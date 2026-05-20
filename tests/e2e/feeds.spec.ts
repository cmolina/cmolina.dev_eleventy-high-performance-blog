import { test, expect } from '@playwright/test';

test.describe('RSS feed', () => {
  test('returns valid XML with channel and items', async ({ request }) => {
    const response = await request.get('/feed/feed.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');
    const body = await response.text();
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
    expect(body).toContain('<item>');
  });
});

test.describe('JSON feed', () => {
  test('returns JSON Feed 1.0 with items', async ({ request }) => {
    const response = await request.get('/feed/feed.json');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('json');
    const body = await response.json();
    expect(body.version).toBe('https://jsonfeed.org/version/1');
    expect(body.title).toBeTruthy();
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
  });

  test('each feed item has id, url, title, and date_published', async ({ request }) => {
    const response = await request.get('/feed/feed.json');
    const body = await response.json();
    for (const item of body.items) {
      expect(item.id).toBeTruthy();
      expect(item.url).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
  });
});
