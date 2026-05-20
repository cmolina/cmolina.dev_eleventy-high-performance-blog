import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
    },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description?: string };

  const fontRegular = readFileSync(resolve('./src/assets/Merriweather-Regular.woff'));
  const fontBold = readFileSync(resolve('./src/assets/Merriweather-Bold.woff'));
  const authorImg = readFileSync(resolve('./public/img/about/me/carlos.jpg'));
  const authorImgSrc = `data:image/jpeg;base64,${authorImg.toString('base64')}`;

  const topSection: object[] = [
    {
      type: 'h1',
      props: {
        style: {
          fontSize: '54px',
          fontWeight: 700,
          color: '#1a1a1a',
          margin: '0 0 28px 0',
          lineHeight: 1.2,
        },
        children: title,
      },
    },
  ];

  if (description) {
    topSection.push({
      type: 'p',
      props: {
        style: {
          fontSize: '26px',
          fontWeight: 400,
          color: '#555',
          margin: 0,
          lineHeight: 1.5,
        },
        children: description,
      },
    });
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'Merriweather',
          boxSizing: 'border-box',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: topSection,
            },
          },
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
                    width: 64,
                    height: 64,
                    style: {
                      borderRadius: '50%',
                      objectFit: 'cover',
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '24px', color: '#888' },
                    children: 'cmolina.dev',
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
        { name: 'Merriweather', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Merriweather', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { 'Content-Type': 'image/png' },
  });
};
