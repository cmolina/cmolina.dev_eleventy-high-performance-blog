import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type PageModule = { meta?: { title?: string; description?: string } };

function filePathToOgSlug(filePath: string): string {
  const withoutExt = filePath.replace(/\.astro$/, '');
  const withoutPrefix = withoutExt.replace(/^\.\.\//, '');
  const withoutTrailingIndex = withoutPrefix.replace(/\/index$/, '');
  return withoutTrailingIndex === 'index' ? 'home' : withoutTrailingIndex;
}

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const postPaths = posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, description: post.data.description },
  }));

  const pageModules = import.meta.glob<PageModule>('../**/*.astro', { eager: true });
  const pagePaths = Object.entries(pageModules)
    .filter(([filePath]) => !filePath.includes('['))
    .flatMap(([filePath, mod]) => {
      if (!mod.meta) return [];
      const { title, description } = mod.meta;
      if (!title) throw new Error(`${filePath} exports meta without a title`);
      return [{ params: { slug: filePathToOgSlug(filePath) }, props: { title, description } }];
    });

  return [...postPaths, ...pagePaths];
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description?: string };

  const fontExtraBold = readFileSync(resolve('./src/assets/Manrope-ExtraBold.woff'));
  const fontRegular   = readFileSync(resolve('./src/assets/Manrope-Regular.woff'));
  const authorImg     = readFileSync(resolve('./src/assets/img/about/me/carlos.jpg'));
  const authorImgSrc  = `data:image/jpeg;base64,${authorImg.toString('base64')}`;

  // Design tokens
  const BG       = '#fbf9f8';
  const INK      = '#1b1c1c';
  const MUTED    = '#444748';
  const ACCENT   = '#5c3cdc';
  const BORDER   = '#c4c7c7';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          backgroundColor: BG,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Manrope',
          boxSizing: 'border-box',
          position: 'relative',
        },
        children: [
          // Violet top accent bar
          {
            type: 'div',
            props: {
              style: {
                width: '1200px',
                height: '8px',
                backgroundColor: ACCENT,
                flexShrink: 0,
              },
            },
          },

          // Main content area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                padding: '64px 80px 60px',
              },
              children: [
                // Title + description
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', gap: '24px' },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: title.length > 50 ? '48px' : '60px',
                            fontWeight: 800,
                            color: INK,
                            margin: 0,
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            maxWidth: '960px',
                          },
                          children: title,
                        },
                      },
                      ...(description
                        ? [{
                            type: 'p',
                            props: {
                              style: {
                                fontSize: '24px',
                                fontWeight: 400,
                                color: MUTED,
                                margin: 0,
                                lineHeight: 1.5,
                                maxWidth: '800px',
                              },
                              children: description.length > 120
                                ? description.slice(0, 117) + '…'
                                : description,
                            },
                          }]
                        : []),
                    ],
                  },
                },

                // Footer row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: `1px solid ${BORDER}`,
                      paddingTop: '24px',
                    },
                    children: [
                      // Author
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '16px',
                          },
                          children: [
                            {
                              type: 'img',
                              props: {
                                src: authorImgSrc,
                                width: 52,
                                height: 52,
                                style: {
                                  borderRadius: '4px',
                                  objectFit: 'cover',

                                },
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '22px',
                                  fontWeight: 800,
                                  color: INK,
                                  letterSpacing: '-0.01em',
                                },
                                children: 'Carlos Molina',
                              },
                            },
                          ],
                        },
                      },
                      // Site URL
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontFamily: 'Manrope',
                            fontSize: '18px',
                            fontWeight: 400,
                            color: MUTED,
                            letterSpacing: '0.04em',
                          },
                          children: 'cmolina.dev',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Manrope', data: fontRegular,   weight: 400, style: 'normal' },
        { name: 'Manrope', data: fontExtraBold, weight: 800, style: 'normal' },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { 'Content-Type': 'image/png' },
  });
};
