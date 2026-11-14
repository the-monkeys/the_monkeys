import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';
import { fetchPublicPosts, fetchPublicTopics } from '@/lib/seoCatalog';
import type { MetaBlog } from '@/services/blog/blogTypes';
import { topicToSlug } from '@/utils/topicUtils';

export const revalidate = 300;

export function buildTopicSitemap(
  topics: string[],
  posts: MetaBlog[]
): MetadataRoute.Sitemap {
  const activeSlugs = new Set(
    posts.flatMap((post) => post.tags.map(topicToSlug)).filter(Boolean)
  );
  const slugs = Array.from(new Set(topics.map(topicToSlug))).filter(
    (slug) => slug && activeSlugs.has(slug)
  );
  return slugs.map((slug) => ({
    url: `${SITE_URL}/topics/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Reuse the public catalog, rather than issuing one request per topic.
  const [topics, posts] = await Promise.all([
    fetchPublicTopics(),
    fetchPublicPosts(),
  ]);
  return buildTopicSitemap(topics, posts);
}
