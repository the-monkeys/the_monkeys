import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';
import { fetchPublicTopics } from '@/lib/seoCatalog';
import { topicToSlug } from '@/utils/topicUtils';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const topics = await fetchPublicTopics();
  return topics.map((topic) => ({
    url: `${SITE_URL}/topics/${topicToSlug(topic)}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
}
