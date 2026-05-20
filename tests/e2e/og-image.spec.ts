import { test, expect } from '@playwright/test';

test.describe('OG images — posts', () => {
  test('serves a PNG for a known post', async ({ request }) => {
    const response = await request.get('/og/2024/05/rock-with-acdc.png');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test('serves a PNG for the oldest post', async ({ request }) => {
    const response = await request.get('/og/2019/07/images-for-every-resolution.png');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });
});

test.describe('OG images — pages', () => {
  const pages = [
    { name: 'home', slug: 'home' },
    { name: 'blog', slug: 'blog' },
    { name: 'about/me', slug: 'about/me' },
    { name: 'about/services', slug: 'about/services' },
    { name: 'about/values', slug: 'about/values' },
  ];

  for (const { name, slug } of pages) {
    test(`serves a PNG for ${name}`, async ({ request }) => {
      const response = await request.get(`/og/${slug}.png`);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('image/png');
    });
  }
});
