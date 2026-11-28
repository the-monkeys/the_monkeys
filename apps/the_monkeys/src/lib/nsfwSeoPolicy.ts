import type { Blog } from '@/services/blog/blogTypes';

export interface BlogSeoOptions {
  indexRestricted?: boolean;
  crawler?: boolean;
}
export function canIndexRestricted(
  blog: Blog,
  options?: BlogSeoOptions
): boolean {
  const at = Date.parse(blog.published_time);
  return (
    options?.indexRestricted === true &&
    blog.seo_indexable === true &&
    blog.audience === 'public' &&
    !blog.is_draft &&
    !blog.content_unavailable &&
    Number.isFinite(at) &&
    at <= Date.now()
  );
}
