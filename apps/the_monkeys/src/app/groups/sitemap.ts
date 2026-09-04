import { MetadataRoute } from 'next';

import { parseEventTime } from '@/lib/eventTime';
import { SITE_URL } from '@/lib/seo';
import { fetchPublicGroups } from '@/lib/seoCatalog';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const groups = await fetchPublicGroups(200);
  return groups.map((group) => ({
    url: `${SITE_URL}/groups/${group.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
    lastModified:
      parseEventTime(group.updated_at) ||
      parseEventTime(group.created_at) ||
      undefined,
  }));
}
