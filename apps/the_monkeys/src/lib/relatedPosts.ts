import { API_URL_V2 } from '@/constants/api';
import { isPublicContentSafe } from '@/lib/publicContentSafety';
import { selectPublicRelatedPosts } from '@/lib/publicRelatedPosts';
import type { Blog, MetaBlog } from '@/services/blog/blogTypes';

export async function loadPublicRelatedPosts(
  post: Pick<
    Blog,
    | 'blog_id'
    | 'tags'
    | 'is_draft'
    | 'audience'
    | 'is_nsfw'
    | 'content_rating'
    | 'content_unavailable'
  >
): Promise<MetaBlog[] | undefined> {
  if (
    !isPublicContentSafe(post) ||
    post.is_draft ||
    (post.audience && post.audience !== 'public')
  )
    return [];
  const tags = Array.isArray(post.tags)
    ? post.tags.filter((tag) => typeof tag === 'string' && tag.trim())
    : [];
  if (!tags.length) return [];
  if (!API_URL_V2) return undefined;
  try {
    // Never forward cookies or authorization from the article viewer.
    const response = await fetch(
      `${API_URL_V2}/blog/meta-feed?limit=12&offset=0`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags }),
        cache: 'no-store',
        signal: AbortSignal.timeout(2500),
      }
    );
    if (!response.ok) return undefined;
    const data: unknown = await response.json();
    if (
      !data ||
      typeof data !== 'object' ||
      !('blogs' in data) ||
      (data.blogs !== null && !Array.isArray(data.blogs))
    )
      return undefined;
    return selectPublicRelatedPosts(data, post.blog_id, tags);
  } catch {
    // Existing client-only callers can retry without blocking article rendering.
    return undefined;
  }
}
