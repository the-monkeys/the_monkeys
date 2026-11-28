import { postLinkTitleSlug } from '@/lib/postUrl';

export interface RestrictedPostLocation {
  path: string;
  published_time: string;
  content_modified_at?: string;
}
export function normalizeRestrictedPostLocations(
  value: unknown
): RestrictedPostLocation[] {
  if (
    !value ||
    typeof value !== 'object' ||
    !('blogs' in value) ||
    !Array.isArray(value.blogs)
  )
    return [];
  return value.blogs.flatMap((raw): RestrictedPostLocation[] => {
    if (!raw || typeof raw !== 'object') return [];
    const post = raw as Record<string, unknown>;
    const rating = post.content_rating as { is_nsfw?: boolean } | undefined;
    if (
      post.seo_indexable !== true ||
      !(post.is_nsfw === true || rating?.is_nsfw === true) ||
      post.audience !== 'public' ||
      typeof post.blog_id !== 'string' ||
      !/^[A-Za-z0-9_]+$/.test(post.blog_id) ||
      ['is_draft', 'is_archived', 'is_scheduled', 'content_unavailable'].some(
        (key) => post[key] === true
      )
    )
      return [];
    const published =
      typeof post.published_time === 'string' ? post.published_time : '';
    if (
      !Number.isFinite(Date.parse(published)) ||
      Date.parse(published) > Date.now()
    )
      return [];
    const slug = postLinkTitleSlug(
      'Post',
      post.blog_id,
      typeof post.slug === 'string' ? post.slug : undefined,
      typeof post.canonical_slug === 'string' ? post.canonical_slug : undefined
    );
    return [
      {
        path: '/blog/' + slug + '-' + post.blog_id,
        published_time: published,
        ...(typeof post.content_modified_at === 'string'
          ? { content_modified_at: post.content_modified_at }
          : {}),
      },
    ];
  });
}
