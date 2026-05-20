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
  - [x] ~~Port Google Analytics script~~ — dropped, GA unused
  - [x] Port dark mode CSS variables
  - [x] Port navigation header
  - [x] Delete `_includes/layouts/base.njk`
- [x] Create `src/layouts/Post.astro` from `_includes/layouts/post.njk`
  - [x] Port read time calculation (240 wpm)
  - [x] Port publish/update date display
  - [x] Port prev/next navigation
  - [x] Port share button (navigator.share + clipboard fallback — Twitter fallback dropped)
  - [x] Port GitHub source link in footer
  - [x] Delete `_includes/layouts/post.njk`
- [x] Create `src/layouts/Home.astro` from `_includes/layouts/home.njk` — delete after porting
- [x] Create `src/components/PostsList.astro` from `_includes/postslist.njk` — delete after porting
- [x] Create `src/components/Clap.astro` from `_includes/clap.njk` — delete after porting
- [x] Delete `_includes/layouts/` if empty
- [x] **Commit phase 3**

## Phase 4: Pages & Routing `[Checkpoint B → C]`

- [x] Create `src/pages/index.astro` from `index.njk` — delete `index.njk` after porting
- [x] Create `src/pages/blog/index.astro` from `archive.njk` — delete `archive.njk` after porting
- [x] Create `src/pages/blog/[...slug].astro` for post detail pages (rest param — IDs are `YYYY/MM/slug`)
- [x] Create `src/pages/tags/index.astro` from `tags-list.njk` — delete `tags-list.njk` after porting
- [x] Create `src/pages/tags/[tag].astro` from `tags.njk` with `getStaticPaths` — delete `tags.njk` after porting
- [x] Create `src/pages/404.astro` from `404.md` — delete `404.md` after porting
- [x] Implement prev/next post logic using sorted collection index
- [x] Create `src/pages/[slug].astro` for static pages collection (`/services`, `/me`, `/values`)
- [x] Verify all legacy URL paths still resolve — fixed `_redirects`: targets were `/posts/YYYY/MM/slug`, changed to `/blog/YYYY/MM/slug`
- [x] Delete `og-image.njk` (replaced in Phase 11)
- [x] **Commit phase 4**

## Phase 5: CSS & Styling `[Checkpoint D]`

- [x] Copy `css/` → `src/styles/` — delete `css/` after copy
- [x] Import global styles in `Base.astro`
- [x] Drop `purgecss`, `csso`, `clean-css` from `package.json` (Vite handles minification)
- [x] Drop `prism-coy-a11y.css` (replaced by rehype-pretty-code theme)
- [ ] Evaluate `astro-critters` for CSS inlining if CWV score requires it (deferred to Phase 15)
- [x] Verify dark mode still works
- [x] Verify code block styling (fix: add missing CSS vars --code-border-color/--constant-color from dropped prism CSS; update selectors to rehype-pretty-code attrs)
- [x] **Commit phase 5**

## Phase 6: Image Optimization `[Checkpoint D]`

- [x] Configure `astro:assets` with `image.domains` for any remote images
- [x] Replace custom `img-dim.js` srcset shortcode with `<Picture />` component — delete `img-dim.js` after porting (deleted `img-dim.js`, `blurry-placeholder.js`, `srcset.js`, `video-gif.js`; markdown images use public/ static serving)
- [x] Set `widths={[320, 640, 1280, 1920]}` — deferred: no component-level images use `<Picture />` yet; markdown images served from public/
- [x] Set `formats={['avif', 'webp']}` — deferred: same reason
- [ ] Implement blur placeholder (options: `@unpic/astro`, `thumbhash`, or custom Vite plugin) — deferred to Phase 15
- [x] Pre-process GIF → MP4 conversions using existing ffmpeg-static script — N/A: no GIFs in repo
- [x] Move `img/` → `public/img/` — delete `img/` after move
- [x] Move `fonts/` → `public/fonts/` — delete `fonts/` after move
- [x] **Commit phase 6**

## Phase 7: Feeds `[Checkpoint D]`

- [x] Install `@astrojs/rss`
- [x] Create `src/pages/feed/feed.xml.ts` (Atom/RSS feed)
- [x] Create `src/pages/feed/feed.json.ts` (JSON Feed — custom endpoint)
- [x] Remove `@11ty/eleventy-plugin-rss` from `package.json`
- [ ] Verify feed validates at validator.w3.org/feed/
- [x] **Commit phase 7**

## Phase 8: Utility Functions `[Checkpoint B]` (replaces Eleventy filters)

- [x] Create `src/utils/dates.ts`
  - [x] `readableDate(date)` using `Intl.DateTimeFormat`
  - [x] `htmlDateString(date)` → `date.toISOString().split('T')[0]`
  - [x] `sitemapDateTimeString(date)`
- [x] Create `src/utils/readTime.ts` (word count / 240)
- [x] Create `src/utils/tags.ts` (get unique tags)
- [x] Create `src/utils/text.ts` (`firstWordsFrom`)
- [x] Drop `addHash` filter — N/A, Vite handles content hashing
- [x] Remove `luxon` from `package.json` (replaced by `Intl.DateTimeFormat`)
- [x] Implement `lastModifiedDate` using `child_process.execSync` in build scripts — done in Phase 12 via `gitLastMod()` in `astro.config.mjs`
- [x] **Commit phase 8**

## Phase 9: Client-Side JavaScript `[Checkpoint D]`

- [x] Move `src/main.js` → `src/scripts/main.ts` — delete `src/main.js` after porting
- [x] Import via `<script>` in `Base.astro` (Vite bundles and hashes)
- [x] Port URL param stripping
- [x] Port share button logic (in Post.astro)
- [x] Port link prefetching (mouseover + touchstart `<link rel=prefetch>`)
- [x] Port scroll progress bar
- [x] Port image placeholder fade-out
- [x] ~~Port GA tracking and event handlers~~ — dropped, GA unused
- [x] ~~Move `js/web-vitals.js` → `src/scripts/web-vitals.ts`~~ — `js/` already gone; web-vitals N/A without GA
- [x] Delete `js/` if empty — already done
- [x] Remove `rollup` + `rollup-plugin-terser` from `package.json` — already removed
- [x] **Commit phase 9**

## Phase 10: Security & Headers `[Checkpoint D]`

> **Deployment target: Cloudflare Pages** (not Firebase). Headers live in `public/_headers`; redirects in `public/_redirects` — both are copied to `dist/` by Astro.

- [x] Create `public/_headers` with unified `/*` CSP rule — no per-page hashes needed (Astro bundles all scripts externally, no `is:inline`)
- [x] Update `/js/*` → `/_astro/*` for Vite asset immutable caching
- [x] Port X-Frame-Options, X-Content-Type-Options, XSS, Report-To, NEL to `public/_headers`
- [x] Create `public/_redirects` from firebase.json redirects (Cloudflare format)
- [x] Strip headers/redirects from `firebase.json` (legacy, kept as stub until Phase 14 removes it)
- [x] Delete root-level `_headers` (Eleventy build artifact)
- [x] Delete `_11ty/apply-csp.js`
- [x] Delete `_data/csp.js`
- [x] Delete `_11ty/` if empty; delete `_data/` if empty — both deleted in Phase 14
- [x] **Commit phase 10**

## Phase 11: OG Images `[Checkpoint D]`

- [x] Install `satori` + `sharp`
- [x] Create `src/pages/og/[...slug].png.ts` endpoint (1200×630 PNG, static pre-rendered)
- [x] Design OG image template (title, description, author avatar, site name) — delete `og-image.njk` after porting
- [x] Wire OG image URLs into `Post.astro` meta tags via `ogImage` prop on `Base.astro`
- [x] Add `ogImage?: string` prop to `Base.astro` (falls back to legacy path for non-post pages)
- [x] Store Merriweather woff fonts in `src/assets/` (satori requires woff/ttf, not woff2)
- [ ] Validate OG images with social debuggers (Twitter, Facebook, LinkedIn)
- [x] **Commit phase 11**

## Phase 12: SEO & Structured Data `[Checkpoint D]`

- [x] Port JSON-LD Article schema into `Post.astro` using `<script type="application/ld+json">`
- [x] Verify `@astrojs/sitemap` generates correct sitemap with lastmod dates (serialize via git log -1)
- [x] Port favicon logic (dev vs prod, SVG favicon, theme color)
- [x] Verify all canonical URLs are correct (fixed trailing slash on post canonicals)
- [x] **Commit phase 12**

## ~~Phase 13: Analytics~~ — dropped, GA unused

## Phase 13: Convert Static Pages to HTML

Replace the `pages` content collection (markdown-based) with plain `.astro` pages that write HTML directly. Motivation: `me`, `services`, and `values` are hand-crafted pages, not prose content — no benefit from markdown parsing or collection schema.

- [x] Create `src/pages/me.astro`, `src/pages/services.astro`, `src/pages/values.astro` — port content from `src/content/pages/*.md` as HTML inside the Base layout
- [x] Delete `src/content/pages/` directory
- [x] Delete `src/pages/[slug].astro` (no longer needed)
- [x] Remove `pages` collection from `src/content.config.ts`
- [x] Verify `/me`, `/services`, `/values` routes still resolve
- [x] **Commit phase 13**

## Phase 14: Final Eleventy Removal

- [x] Remove remaining Eleventy dependencies from `package.json` (+ all other non-Astro deps)
- [x] Replace Eleventy scripts with `astro dev` / `astro build` / `astro preview`
- [x] Delete `.eleventy.js`
- [x] Delete `_includes/` — already empty from phase 3
- [x] Delete `_data/` (metadata.json, isdevelopment.js, baseHref.js)
- [x] Delete `_11ty/` (all ported or N/A scripts)
- [x] Delete `test/` (Eleventy-specific mocha tests, already broken)
- [x] Fix `astro.config.mjs` sitemap mapping for /me, /services, /values (point to .astro pages, not deleted .md)
- [x] Run `npm install` — 659 packages removed, lockfile clean
- [x] **Commit phase 14**

## Phase 15: Testing & QA

- [x] Lighthouse audit on all key pages — home 92 (CLS fixed), blog 100, post 100
- [x] Verify Core Web Vitals — CLS fixed (width/height on profile-picture), LCP prioritized (fetchpriority=high)
- [x] Validate RSS feed — all 13 posts, correct pubDate, valid XML structure
- [x] Validate JSON Feed — valid JSON Feed 1.0 structure, all posts present
- [x] Validate sitemap — all routes, lastmod dates, no feed/OG pollution
- [x] Test dark mode — @media (prefers-color-scheme: dark) block present in global.css; Merriweather 300 preloaded for dark mode
- [x] Test mobile layout — viewport meta tag correct (width=device-width, initial-scale=1.0); banner uses flex-direction: column-reverse on portrait
- [x] Test share button — navigator.share (mobile/Safari) and navigator.clipboard fallback (desktop) both wired in Post.astro; dialog toast present in Base.astro
- [x] Test all tag pages render correctly — no posts have tags, tag pages correctly absent; tags/index renders empty list
- [x] Test draft/scheduled filtering in prod build — no draft posts in repo
- [x] Test 404 page — returns HTTP 404, custom page renders
- [x] Check all legacy redirects still work — fixed `_redirects` bug (targets were /posts/…, now /blog/…)
- [x] Verify all routes return 200 — /, /blog/, /blog/[slug]/, /me/, /services/, /values/, /tags/, /feed/*, /sitemap-index.xml, /og/*.png all 200
- [x] Verify post page metadata — canonical URL, og:image, JSON-LD, read time all present

## Phase 16: Deploy (Cloudflare Pages)

- [x] Add `@astrojs/cloudflare` adapter (or keep static output — verify CF Pages supports `output: 'static'`) — CF Pages supports static output natively, no adapter needed
- [x] Update `astro.config.mjs` `outDir` if needed — default `dist/` matches CF Pages
- [ ] Update build command in CF Pages dashboard: `npm run build` → output dir `dist`
- [x] Update `package.json` build scripts to remove Eleventy-specific steps — already clean (`dev`, `build`, `preview` only)
- [x] Delete `firebase.json` (legacy stub, no longer needed)
- [x] Delete `netlify.toml` (legacy)
- [x] Run prod build and verify no errors — 20 pages built in ~6.5s
- [x] Verify `dist/_headers` and `dist/_redirects` are present in build output
- [ ] Deploy to CF Pages staging and smoke test
- [ ] Deploy to production
- [ ] **Commit phase 16 / tag release**

---

## Dependencies to Add

- [x] `astro`
- [x] `@astrojs/mdx`
- [x] `@astrojs/rss`
- [x] `@astrojs/sitemap`
- [x] `rehype-pretty-code`
- [x] `satori`
- [x] `zod` (bundled with Astro)
- [ ] `@unpic/astro` or `thumbhash` (blur placeholders — deferred post-launch)
- [x] `@astrojs/prefetch` — N/A, link prefetching ported as vanilla JS in `src/scripts/main.ts`

## Dependencies to Keep

- [x] `sharp`
- [x] `ffmpeg-static` — N/A, no GIFs in repo; removed with Eleventy cleanup
- [x] `markdown-it-footnote` — replaced by `remark-footnotes`

---

## Biggest Risks

| Risk | Mitigation |
|---|---|
| CSS inlining removed | Evaluate `astro-critters`; measure CWV before deciding |
| Blur placeholders | Prototype with `thumbhash` or custom Vite plugin early |
| CSP hash generation | Pre-compute hashes or switch to nonce-based CSP with middleware |
| OG image visual diff | Screenshot both versions and compare before launch |
| Git last-modified dates | Test `execSync` in Astro build context early in Phase 8 |
