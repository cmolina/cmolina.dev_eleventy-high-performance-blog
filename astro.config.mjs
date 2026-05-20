import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkFootnotes from 'remark-footnotes';

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: 'github-dark',
};

export default defineConfig({
  site: 'https://cmolina.dev',
  integrations: [
    mdx(),
    sitemap(),
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
