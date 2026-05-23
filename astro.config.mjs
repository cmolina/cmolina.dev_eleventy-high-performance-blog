import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkFootnotes from 'remark-footnotes';
import { execSync } from 'child_process';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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
  const postsMatch = path.match(/^\/posts\/(\d{4}\/\d{2}\/.+)$/);
  if (postsMatch) return `src/content/posts/${postsMatch[1]}.md`;
  const map = {
    '/': 'src/pages/index.astro',
    '/blog': 'src/pages/blog/index.astro',
    '/tags': 'src/pages/tags/index.astro',
    '/about/me': 'src/pages/about/me.astro',
    '/about/services': 'src/pages/about/services.astro',
    '/about/values': 'src/pages/about/values.astro',
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
  keepBackground: false,
};

export default defineConfig({
  site: SITE_URL,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/tags/'),
      serialize(item) {
        return { ...item, lastmod: sitemapLastmod(item.url) };
      },
    }),
  ],
  image: {
    domains: [],
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkFootnotes],
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions],
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'append',
        properties: { className: ['direct-link'], ariaHidden: 'true', tabIndex: -1 },
        content: { type: 'text', value: ' ¶' },
      }],
    ],
  },
});
