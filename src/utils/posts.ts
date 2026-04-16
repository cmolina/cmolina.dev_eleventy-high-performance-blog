import type { CollectionEntry } from 'astro:content';

export function isPublished(post: CollectionEntry<'posts'>): boolean {
  if (import.meta.env.DEV) return true;
  if (post.data.draft) return false;
  if (post.data.scheduled && post.data.scheduled > new Date()) return false;
  return true;
}

export function sortByDate(posts: CollectionEntry<'posts'>[]): CollectionEntry<'posts'>[] {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
