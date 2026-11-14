import type { MetaBlog } from '@/services/blog/blogTypes';

export function normalizePublicPosts(value: unknown): MetaBlog[] {
  const blogs =
    value && typeof value === 'object' && 'blogs' in value
      ? (value as { blogs?: unknown }).blogs
      : null;
  if (!Array.isArray(blogs)) return [];

  return blogs.flatMap((raw): MetaBlog[] => {
    if (!raw || typeof raw !== 'object') return [];
    const post = raw as Partial<MetaBlog> & {
      is_draft?: unknown;
      is_archived?: unknown;
      is_scheduled?: unknown;
    };
    if (
      (post.audience && post.audience !== 'public') ||
      post.is_draft === true ||
      post.is_archived === true ||
      post.is_scheduled === true
    )
      return [];
    if (
      typeof post.blog_id !== 'string' ||
      !post.blog_id.trim() ||
      typeof post.title !== 'string' ||
      !post.title.trim()
    ) {
      return [];
    }
    return [
      {
        blog_id: post.blog_id,
        title: post.title.trim(),
        first_image:
          typeof post.first_image === 'string' ? post.first_image : '',
        first_paragraph:
          typeof post.first_paragraph === 'string' ? post.first_paragraph : '',
        owner_account_id:
          typeof post.owner_account_id === 'string'
            ? post.owner_account_id
            : '',
        published_time:
          typeof post.published_time === 'string' ? post.published_time : '',
        tags: Array.isArray(post.tags)
          ? post.tags.filter((tag): tag is string => typeof tag === 'string')
          : [],
        ...(typeof post.like_count === 'number'
          ? { like_count: post.like_count }
          : {}),
        ...(typeof post.bookmark_count === 'number'
          ? { bookmark_count: post.bookmark_count }
          : {}),
        ...(typeof post.content_type === 'string'
          ? { content_type: post.content_type }
          : {}),
        ...(post.audience === 'public' ? { audience: post.audience } : {}),
        ...(typeof post.group_slug === 'string'
          ? { group_slug: post.group_slug }
          : {}),
      },
    ];
  });
}
