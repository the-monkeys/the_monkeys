import { MetadataRoute } from 'next';

import { parseEventTime } from '@/lib/eventTime';
import { SITE_URL } from '@/lib/seo';
import { fetchPublicEvents } from '@/lib/seoCatalog';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await fetchPublicEvents(200);
  return events.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    lastModified:
      parseEventTime(event.updated_at) ||
      parseEventTime(event.start_time) ||
      undefined,
  }));
}
