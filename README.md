# Carlos Molina's blog

> _Based on https://github.com/google/eleventy-high-performance-blog_

## 🚀 Quick start

1.  **Run dev server**

    Navigate into your new site’s directory and start it up.

    ```sh
    cd cmolina.dev/
    npm i

    npm run watch
    # Your site will be running at http://localhost:8080
    ```

1.  **Deploy ✨**

    The website is hosted with [Firebase](https://console.firebase.google.com/project/cmolina-blog/overview). You will need to install its CLI globally `npm install -g firebase-tools` and run `firebase login` once.

    ```sh
    # build and serve prod assets
    npm run build
    npx -y serve _site

    # Checkout http://localhost:5000/,
    # then stop the server and push to prod!
    npm run deploy

    # see it live https://cmolina.dev/
    ```

> Review the previous implementation at https://github.com/cmolina/cmolina.dev_gatsby-starter-blog

## Features

### Performance outcomes

- Perfect score in applicable lighthouse audits (including accessibility).
- Single HTTP request to [First Contentful Paint](https://web.dev/first-contentful-paint/).
- Very optimized [Largest Contentful Paint](https://web.dev/lcp/) (score depends on image usage, but images are optimized).
- 0 [Cumulative Layout Shift](https://web.dev/cls/).
- ~0 [First Input Delay](https://web.dev/fid/).

### Performance optimizations

#### Images

- Generates multiple sizes of each image and uses them in **`srcset`**.
- Generates a **blurry placeholder** for each image (without adding an HTML element or using JS).
- Transcodes images to [AVIF](<https://en.wikipedia.org/wiki/AV1#AV1_Image_File_Format_(AVIF)>) and [webp](https://developers.google.com/speed/webp) and generates `picture` element.
- Transcodes GIFs to muted looping autoplaying MP4 videos for greatly reduced file size.
- **Lazy loads** images (using [native `loading=lazy`](https://web.dev/native-lazy-loading/)).
- **Async decodes** images (using `decoding=async`).
- **Lazy layout** of images and placeholders using [`content-visibility: auto`](https://web.dev/content-visibility/#skipping-rendering-work-with-content-visibility).
- **Avoids CLS impact** of images by inferring and providing width and height (Supported in Chrome, Firefox and Safari 14+).
- Downloads remote images and stores/serves them locally.
- Immutable URLs.

#### CSS

- Defaults to the compact "classless" [Bahunya CSS framework](https://kimeiga.github.io/bahunya/).
- Inlines CSS.
- Dead-code-eliminates / tree-shakes / purges (pick your favorite word) unused CSS on a per-page basis with [PurgeCSS](https://purgecss.com/).
- Minified CSS with [csso](https://www.npmjs.com/package/csso).

#### Miscellaneous

- Immutable URLs for JS.
- Sets immutable caching headers for images, fonts, and JS (CSS is inlined). Currently implements for Netlify `_headers` file.
- Minifies HTML and optimizes it for compression. Uses [html-minifier](https://www.npmjs.com/package/html-minifier) with aggressive options.
- Uses [rollup](https://rollupjs.org/) to bundle JS and minifies it with [terser](https://terser.org/).
- Prefetches same-origin navigations when a navigation is likely.
- If an AMP files is present, [optimizes it](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp/).

#### Fonts

- Serves fonts from same origin.
- Makes fonts `display:optional`.

#### Analytics

- Supports locally serving Google Analytics's JS and proxying it's hit requests to a Netlify proxy (other proxies could be easily added).
- Supports sending [Core Web Vitals](https://web.dev/vitals/) metrics to Google Analytics as [events](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics).
- Support for noscript hit requests.
- Avoids blocking onload on analytics requests.
- To turn this on, specify `googleAnalyticsId` in `metadata.json`. (Note, that this is not compatible with the not-yet-commonly used version 4 of Google Analytics.)

### DX features

- Uses 🚨 as favicon during local development.
- Supports a range of default tests.
- Runs build and tests on `git push`.
- Sourcemap generated for JS.

### SEO & Social

- Share button preferring `navigator.share()` and falling back to Twitter. Using OS-like share-icon.
- Support for OGP metadata.
- Support for Twitter metadata.
- Support for schema.org JSON-LD.
- Sitemap.xml generation.

### Largely useless glitter

- Read time estimate.
- Animated scroll progress bar…
- …with an optimized implementation that should never cause a layout.

### Security

Generates a strong [Content-Security-Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) using HTTP headers.

- Default-src is self.
- Disallows plugins.
- Generates hash based CSP for the JS used on the site.
- To extend the CSP with new rules, see [CSP.js](https://github.com/google/eleventy-high-performance-blog/blob/main/_data/csp.js#L22)

### Build performance

- Downloaded remote images, and generated sizes are cached in the local filesystem…
- …and SHOULD be committed to git.
- `.persistimages.sh` helps with this.

## Disclaimer

This is not an officially supported Google product, but rather [Malte's](https://twitter.com/cramforce) private best-effort open-source project.

## How to bring updates from upstream
Originally, I added the original repo as a remote with

```sh
git remote add upstream git@github.com:google/eleventy-high-performance-blog.git
```

To do the merge, I run

```sh
git fetch upstream
git merge upstream/main main --allow-unrelated-histories --strategy-option=theirs --squash
git commit
```

In this case, I haven't modified the template yet so I can safely take the upstream changes. In the future, I will need to review the changes before committing.

## Apple M1 pre-requisites
- Install node v16; `nvm i lts/gallium`
- If you fail to install the dependencies due to `sharp` failing to build, ensure
  - `arch` returns `arm64`
  - you uninstall `libvips` with `brew uninstall vips`, or setup the `SHARP_IGNORE_GLOBAL_LIBVIPS` env variable
- Follow the steps under Quick Start
