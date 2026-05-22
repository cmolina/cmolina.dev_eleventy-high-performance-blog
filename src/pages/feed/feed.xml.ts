import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { isPublished, sortByDate } from '../../utils/posts';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('posts');
  const posts = sortByDate(allPosts.filter(isPublished));

  return rss({
    title: 'Carlos Molina',
    description: 'My personal blog of the things I am learning',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}`,
    })),
    customData: `<language>en</language>`,
  });
}
