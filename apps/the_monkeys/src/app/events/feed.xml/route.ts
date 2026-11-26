import { parseEventTime } from '@/lib/eventTime';
import { EVENTS_SEO, SITE_URL, truncateMeta } from '@/lib/seo';
import { fetchPublicEvents } from '@/lib/seoCatalog';
import {
  buildRssXml,
  rssResponse,
  rssUnavailableResponse,
} from '@/lib/seoFeed';

// Fetch at request time: an unavailable API must not prevent deployment.
export const dynamic = 'force-dynamic';

export async function GET() {
  const events = await fetchPublicEvents(50).catch(() => null);
  if (!events) return rssUnavailableResponse();
  const xml = buildRssXml({
    title: EVENTS_SEO.title,
    description: EVENTS_SEO.description,
    path: '/events',
    items: events.map((event) => ({
      title: event.title,
      link: `${SITE_URL}/events/${event.slug}`,
      guid: `${SITE_URL}/events/${event.slug}`,
      pubDate:
        parseEventTime(event.start_time) || parseEventTime(event.created_at),
      description: truncateMeta(event.description || '', 280),
    })),
  });
  return rssResponse(xml);
}
