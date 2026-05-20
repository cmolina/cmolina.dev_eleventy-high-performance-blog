import type { CollectionEntry } from 'astro:content';

export function getUniqueTags(posts: CollectionEntry<'posts'>[]): string[] {
  return [...new Set(posts.flatMap((p) => p.data.tags ?? []))].sort();
}
