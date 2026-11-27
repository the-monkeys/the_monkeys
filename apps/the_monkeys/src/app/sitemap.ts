import type { MetadataRoute } from 'next';

import { postModificationTime } from '@/lib/postModificationTime';
import { canonicalPostTitleSlug } from '@/lib/postUrl';
import { isPublicContentSafe } from '@/lib/publicContentSafety';
import type { RestrictedPostLocation } from '@/lib/restrictedPostLocations';
import { nsfwSeoEnabled } from '@/lib/searchCrawler';
import { SITE_URL } from '@/lib/seo';
import { fetchSitemapPostCatalog } from '@/lib/seoCatalog';
import { MetaBlog } from '@/services/blog/blogTypes';

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/topics/explore', changeFrequency: 'daily', priority: 0.8 },
  { path: '/learn', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/events', changeFrequency: 'daily', priority: 0.8 },
  { path: '/groups', changeFrequency: 'daily', priority: 0.8 },
  { path: '/discussions', changeFrequency: 'daily', priority: 0.8 },
  { path: '/snapshot', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/snapshot/new', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/snapshot/new?view=x', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/cards', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact-us', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/support', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
];

function validDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function buildMainSitemap(
  posts: MetaBlog[],
  restricted: RestrictedPostLocation[] = []
): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((entry) => ({
    url: `${SITE_URL}${entry.path === '/' ? '/' : entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
  const postEntries = posts.filter(isPublicContentSafe).map((post) => ({
    url: `${SITE_URL}/blog/${canonicalPostTitleSlug(post.title, post.canonical_slug, post.blog_id)}-${post.blog_id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    lastModified: validDate(postModificationTime(post)),
  }));
  const protectedEntries = restricted.map((post) => ({
    url: SITE_URL + post.path,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    lastModified: validDate(post.content_modified_at || post.published_time),
  }));
  const seen = new Set<string>();
  return [...staticEntries, ...postEntries, ...protectedEntries].filter(
    (entry) => {
      if (seen.has(entry.url)) return false;
      seen.add(entry.url);
      return true;
    }
  );
}

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, restricted } = await fetchSitemapPostCatalog(nsfwSeoEnabled());
  return buildMainSitemap(posts, restricted);
}
