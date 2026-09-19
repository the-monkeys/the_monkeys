import type { MetadataRoute } from 'next';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { SITE_URL } from '@/lib/seo';
import { fetchPublicPosts } from '@/lib/seoCatalog';
import { MetaBlog } from '@/services/blog/blogTypes';

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/feed', changeFrequency: 'daily', priority: 0.9 },
  { path: '/topics/explore', changeFrequency: 'daily', priority: 0.8 },
  { path: '/events', changeFrequency: 'daily', priority: 0.8 },
  { path: '/groups', changeFrequency: 'daily', priority: 0.8 },
  { path: '/snapshot', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/snapshot/new', changeFrequency: 'weekly', priority: 0.8 },
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

export function buildMainSitemap(posts: MetaBlog[]): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((entry) => ({
    url: `${SITE_URL}${entry.path === '/' ? '/' : entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${generateSlug(post.title)}-${post.blog_id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    lastModified: validDate(post.published_time),
  }));
  return [...staticEntries, ...postEntries];
}

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildMainSitemap(await fetchPublicPosts());
}
