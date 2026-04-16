# Eleventy → Astro 5 Migration Plan

## Strategy

Work incrementally in this repo (Eleventy and Astro coexist — Astro ignores `.eleventy.js`, `_site/`, etc.). After each checkpoint below, run `astro dev` and verify the output before continuing. Do not proceed to the next checkpoint until the current one renders correctly.

**Commits:** Create a git commit after each phase passes. Phases 1 + 2 may be committed together once Checkpoint A is confirmed. Delete source files from the old stack as part of the same commit that ports them — never leave orphan originals.

### Checkpoints

| # | Gate | Passes when |
|---|---|---|
| A | Scaffold + content collections | `astro dev` starts; `/blog` lists posts |
| B | One layout + one page route | a single post renders with correct HTML |
| C | All routes | full site is navigable (home, blog, tags, 404) |
| D | CSS / images / feeds / OG | parity with Eleventy output |

---

## Phase 1: Project Scaffold `[Checkpoint A]`

- [x] Run `npm create astro@latest` with minimal + TypeScript strict template
- [x] Configure `astro.config.mjs` with site URL, mdx, sitemap integrations
- [x] Add `rehype-pretty-code` for syntax highlighting (replaces Prism)
- [x] Add `remark-footnote` plugin
- [x] Set up `tsconfig.json`
- [x] Configure `.nvmrc` / Node version

## Phase 2: Content Collections `[Checkpoint A]`

- [x] Create `src/content.config.ts` with Zod schema for posts (title, description, date, draft, scheduled, tags) — Astro 6: moved to `src/content.config.ts` with glob loaders
- [x] Move `posts/YYYY/MM/slug.md` → `src/content/posts/` — delete `posts/` after move
- [x] Strip `layout` and `templateEngineOverride` from post front matter
- [x] Move `about/` pages → `src/content/pages/` — delete `about/` after move
- [x] Implement draft/scheduled filtering (replaces `posts.11tydata.js`) — delete `posts/posts.11tydata.js` after porting
- [x] Verify all posts render correctly with `getCollection('posts')`
- [x] **Commit phases 1+2** (after Checkpoint A passes)

## Phase 3: Layouts & Components `[Checkpoint B]`

- [x] Create `src/layouts/Base.astro` from `_includes/layouts/base.njk`
  - [x] Port OG/Twitter meta tags
  - [x] Port font preloading (`<link rel="preload">`)
  - [x] Port canonical URL using `Astro.url`
  - [x] Port RSS autodiscovery link
  - [ ] Port Google Analytics script (conditional on env var)
  - [ ] Port dark mode CSS variables
  - [x] Port navigation header
  - [x] Delete `_includes/layouts/base.njk`
- [x] Create `src/layouts/Post.astro` from `_includes/layouts/post.njk`
  - [x] Port read time calculation (240 wpm)
  - [x] Port publish/update date display
  - [x] Port prev/next navigation
  - [ ] Port share button (navigator.share + clipboard + Twitter fallback)
  - [x] Port GitHub source link in footer
  - [x] Delete `_includes/layouts/post.njk`
- [x] Create `src/layouts/Home.astro` from `_includes/layouts/home.njk` — delete after porting
- [x] Create `src/components/PostsList.astro` from `_includes/postslist.njk` — delete after porting
- [x] Create `src/components/Clap.astro` from `_includes/clap.njk` — delete after porting
- [x] Delete `_includes/layouts/` if empty
- [x] **Commit phase 3**

## Phase 4: Pages & Routing `[Checkpoint B → C]`

- [ ] Create `src/pages/index.astro` from `index.njk` — delete `index.njk` after porting
- [ ] Create `src/pages/blog/index.astro` from `archive.njk` — delete `archive.njk` after porting
- [ ] Create `src/pages/blog/[slug].astro` for post detail pages
- [ ] Create `src/pages/tags/index.astro` from `tags-list.njk` — delete `tags-list.njk` after porting
- [ ] Create `src/pages/tags/[tag].astro` from `tags.njk` with `getStaticPaths` — delete `tags.njk` after porting
- [ ] Create `src/pages/404.astro` from `404.md` — delete `404.md` after porting
- [ ] Implement prev/next post logic using sorted collection index
- [ ] Verify all legacy URL paths still resolve (check Firebase redirects)
- [ ] Delete `og-image.njk` (replaced in Phase 11)
- [ ] **Commit phase 4**

## Phase 5: CSS & Styling `[Checkpoint D]`

- [ ] Copy `css/` → `src/styles/` — delete `css/` after copy
- [ ] Import global styles in `Base.astro`
- [ ] Drop `purgecss`, `csso`, `clean-css` from `package.json` (Vite handles minification)
- [ ] Drop `prism-coy-a11y.css` (replaced by rehype-pretty-code theme)
- [ ] Evaluate `astro-critters` for CSS inlining if CWV score requires it
- [ ] Verify dark mode still works
- [ ] Verify code block styling
- [ ] **Commit phase 5**

## Phase 6: Image Optimization `[Checkpoint D]`

- [ ] Configure `astro:assets` with `image.domains` for any remote images
- [ ] Replace custom `img-dim.js` srcset shortcode with `<Picture />` component — delete `img-dim.js` after porting
- [ ] Set `widths={[320, 640, 1280, 1920]}`
- [ ] Set `formats={['avif', 'webp']}`
- [ ] Implement blur placeholder (options: `@unpic/astro`, `thumbhash`, or custom Vite plugin)
- [ ] Pre-process GIF → MP4 conversions using existing ffmpeg-static script
- [ ] Move `img/` → `public/img/` — delete `img/` after move
- [ ] Move `fonts/` → `public/fonts/` — delete `fonts/` after move
- [ ] **Commit phase 6**

## Phase 7: Feeds `[Checkpoint D]`

- [ ] Install `@astrojs/rss`
- [ ] Create `src/pages/feed/feed.xml.ts` (Atom/RSS feed)
- [ ] Create `src/pages/feed/feed.json.ts` (JSON Feed — custom endpoint)
- [ ] Remove `@11ty/eleventy-plugin-rss` from `package.json`
- [ ] Verify feed validates at validator.w3.org/feed/
- [ ] **Commit phase 7**

## Phase 8: Utility Functions `[Checkpoint B]` (replaces Eleventy filters)

- [ ] Create `src/utils/dates.ts`
  - [ ] `readableDate(date)` using `Intl.DateTimeFormat`
  - [ ] `htmlDateString(date)` → `date.toISOString().split('T')[0]`
  - [ ] `sitemapDateTimeString(date)`
- [ ] Create `src/utils/readTime.ts` (word count / 240)
- [ ] Create `src/utils/tags.ts` (get unique tags, filter nav/meta tags)
- [ ] Create `src/utils/text.ts` (`firstWordsFrom`, `encodeURIComponent` wrapper)
- [ ] Drop `addHash` filter — delete from `.eleventy.js` / Vite handles content hashing
- [ ] Remove `luxon` from `package.json` (replaced by `Intl.DateTimeFormat`)
- [ ] Implement `lastModifiedDate` using `child_process.execSync` in build scripts
- [ ] **Commit phase 8**

## Phase 9: Client-Side JavaScript `[Checkpoint D]`

- [ ] Move `src/main.js` → `src/scripts/main.ts` — delete `src/main.js` after porting
- [ ] Import via `<script>` in `Base.astro` (Vite bundles and hashes)
- [ ] Port URL param stripping
- [ ] Port share button logic
- [ ] Port link prefetching (or use `@astrojs/prefetch` integration)
- [ ] Port scroll progress bar
- [ ] Port image placeholder fade-out
- [ ] Port GA tracking and event handlers
- [ ] Move `js/web-vitals.js` → `src/scripts/web-vitals.ts` — delete `js/web-vitals.js` after porting
- [ ] Delete `js/` if empty
- [ ] Remove `rollup` + `rollup-plugin-terser` from `package.json` (replaced by Vite)
- [ ] **Commit phase 9**

## Phase 10: Security & Headers `[Checkpoint D]`

- [ ] Move CSP header rules to `firebase.json` `headers` array
- [ ] Pre-compute CSP hashes for known inline scripts and hardcode
- [ ] Evaluate nonce-based CSP with Astro middleware if hash approach is too brittle
- [ ] Port X-Frame-Options, X-Content-Type-Options, XSS headers to host config
- [ ] Delete `_11ty/apply-csp.js`
- [ ] Delete `_data/csp.js`
- [ ] Delete `_11ty/` if empty; delete `_data/` if empty
- [ ] **Commit phase 10**

## Phase 11: OG Images `[Checkpoint D]`

- [ ] Install `satori` + `sharp`
- [ ] Create `src/pages/og/[slug].png.ts` endpoint
- [ ] Design OG image template component (replaces `og-image.njk`) — delete `og-image.njk` after porting
- [ ] Wire OG image URLs into `Post.astro` meta tags
- [ ] Validate OG images with social debuggers (Twitter, Facebook, LinkedIn)
- [ ] **Commit phase 11**

## Phase 12: SEO & Structured Data `[Checkpoint D]`

- [ ] Port JSON-LD Article schema into `Post.astro` using `<script type="application/ld+json">`
- [ ] Verify `@astrojs/sitemap` generates correct sitemap with lastmod dates
- [ ] Port favicon logic (dev vs prod, SVG favicon, theme color)
- [ ] Verify all canonical URLs are correct
- [ ] **Commit phase 12**

## Phase 13: Analytics `[Checkpoint D]`

- [ ] Port Google Analytics conditional loading (skip in dev)
- [ ] Configure Netlify/Firebase proxy for GA script if needed
- [ ] Port Core Web Vitals reporting
- [ ] Port noScript fallback
- [ ] **Commit phase 13**

## Phase 14: Final Eleventy Removal

- [ ] Remove remaining Eleventy dependencies from `package.json`:
  - [ ] `@11ty/eleventy`
  - [ ] `@11ty/eleventy-plugin-syntaxhighlight`
  - [ ] `@11ty/eleventy-navigation`
  - [ ] `eleventy-plugin-local-images`
  - [ ] `html-minifier`
  - [ ] `capture-website`
  - [ ] `nunjucks`
  - [ ] `@ampproject/toolbox-optimizer`
- [ ] Delete `.eleventy.js`
- [ ] Delete `_includes/` if empty
- [ ] Delete `_data/` if empty
- [ ] Delete `_11ty/` if empty
- [ ] Remove Eleventy-specific scripts from `package.json`
- [ ] Run `npm install` and verify clean lockfile
- [ ] **Commit phase 14**

## Phase 15: Testing & QA

- [ ] Lighthouse audit on all key pages (target 100s)
- [ ] Verify Core Web Vitals (CLS, LCP, FID/INP)
- [ ] Validate RSS feed
- [ ] Validate JSON Feed
- [ ] Validate sitemap
- [ ] Test dark mode
- [ ] Test mobile layout
- [ ] Test share button on mobile (navigator.share) and desktop (clipboard fallback)
- [ ] Test all tag pages render correctly
- [ ] Test draft/scheduled filtering in prod build
- [ ] Test 404 page
- [ ] Check all legacy redirects still work

## Phase 16: Deploy

- [ ] Update `firebase.json` for Astro static output directory
- [ ] Update build scripts in `package.json`
- [ ] Run prod build and verify no errors
- [ ] Deploy to staging and smoke test
- [ ] Deploy to production
- [ ] **Commit phase 16 / tag release**

---

## Dependencies to Add

- [ ] `astro`
- [ ] `@astrojs/mdx`
- [ ] `@astrojs/rss`
- [ ] `@astrojs/sitemap`
- [ ] `rehype-pretty-code`
- [ ] `satori`
- [ ] `zod` (bundled with Astro, verify version)
- [ ] `@unpic/astro` or `thumbhash` (blur placeholders — evaluate)
- [ ] `@astrojs/prefetch` (link prefetching — evaluate)

## Dependencies to Keep

- [ ] `sharp`
- [ ] `ffmpeg-static`
- [ ] `markdown-it-footnote` (as remark plugin equivalent)

---

## Biggest Risks

| Risk | Mitigation |
|---|---|
| CSS inlining removed | Evaluate `astro-critters`; measure CWV before deciding |
| Blur placeholders | Prototype with `thumbhash` or custom Vite plugin early |
| CSP hash generation | Pre-compute hashes or switch to nonce-based CSP with middleware |
| OG image visual diff | Screenshot both versions and compare before launch |
| Git last-modified dates | Test `execSync` in Astro build context early in Phase 8 |
