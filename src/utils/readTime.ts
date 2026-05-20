export function readTime(body: string): number {
  return Math.round(body.split(/\s+/).length / 240) + 1;
}
