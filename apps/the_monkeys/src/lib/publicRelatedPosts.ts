import { normalizePublicPosts } from '@/lib/publicPostMetadata';
import type { MetaBlog } from '@/services/blog/blogTypes';

/** Call only with the anonymous public catalog; never an account or group feed. */
export function selectPublicRelatedPosts(
  value: unknown,
  blogId: string,
  topics: readonly string[]
): MetaBlog[] {
  const wanted = new Set(
    topics.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
  );
  const seen = new Set([blogId]);
  return normalizePublicPosts(value)
    .filter((post) => {
      if (
        seen.has(post.blog_id) ||
        Date.parse(post.published_time) > Date.now()
      )
        return false;
      if (!post.tags.some((tag) => wanted.has(tag.trim().toLowerCase())))
        return false;
      seen.add(post.blog_id);
      return true;
    })
    .slice(0, 6);
}
/** Stable initial HTML across the server/browser clock and timezone boundary. */
export function formatRelatedPostDate(value: string): string {
  if (!value) return '';
  const timestamp = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(
    value
  )
    ? value.replace(' ', 'T') + 'Z'
    : value;
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
