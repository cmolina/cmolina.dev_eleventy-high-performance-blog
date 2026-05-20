import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { isPublished, sortByDate } from '../../utils/posts';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('posts');
  const posts = sortByDate(allPosts.filter(isPublished));
  const siteUrl = context.site!.toString().replace(/\/$/, '');

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: 'Carlos Molina',
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed/feed.json`,
    description: 'A place to write things I am learning',
    author: {
      name: 'Carlos Andrés Molina Avendaño',
      url: siteUrl,
    },
    items: posts.map((post) => ({
      id: `${siteUrl}/blog/${post.id}`,
      url: `${siteUrl}/blog/${post.id}`,
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.date.toISOString(),
    })),
  };

  return new Response(JSON.stringify(feed), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  });
}
