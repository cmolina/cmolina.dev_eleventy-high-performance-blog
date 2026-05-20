import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkFootnotes from 'remark-footnotes';
import { execSync } from 'child_process';

const SITE_URL = 'https://cmolina.dev';
const SITE_WIDE_UPDATE = new Date('2020-07-12');

function gitLastMod(filePath) {
  try {
    const iso = execSync(`git log -1 --format=%aI -- "${filePath}"`, { encoding: 'utf8' }).trim();
    return iso ? new Date(iso) : null;
  } catch {
    return null;
  }
}

function urlToFilePath(url) {
  const path = url.replace(SITE_URL, '').replace(/\/$/, '') || '/';
  const blogMatch = path.match(/^\/blog\/(\d{4}\/\d{2}\/.+)$/);
  if (blogMatch) return `src/content/posts/${blogMatch[1]}.md`;
  const map = {
    '/': 'src/pages/index.astro',
    '/blog': 'src/pages/blog/index.astro',
    '/tags': 'src/pages/tags/index.astro',
    '/me': 'src/pages/me.astro',
    '/services': 'src/pages/services.astro',
    '/values': 'src/pages/values.astro',
  };
  return map[path] ?? null;
}

function sitemapLastmod(url) {
  const filePath = urlToFilePath(url);
  const gitDate = filePath ? gitLastMod(filePath) : null;
  const candidates = [SITE_WIDE_UPDATE, gitDate].filter(Boolean);
  return candidates.reduce((a, b) => (a > b ? a : b)).toISOString();
}

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: 'github-dark',
};

export default defineConfig({
  site: SITE_URL,
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        return { ...item, lastmod: sitemapLastmod(item.url) };
      },
    }),
  ],
  image: {
    domains: [],
  },
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkFootnotes],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
});
