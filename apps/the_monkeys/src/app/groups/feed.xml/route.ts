import { parseEventTime } from '@/lib/eventTime';
import { GROUPS_SEO, SITE_URL, truncateMeta } from '@/lib/seo';
import { fetchPublicGroups } from '@/lib/seoCatalog';
import { buildRssXml, rssResponse } from '@/lib/seoFeed';

export const revalidate = 300;

export async function GET() {
  const groups = await fetchPublicGroups(50);
  const xml = buildRssXml({
    title: GROUPS_SEO.title,
    description: GROUPS_SEO.description,
    path: '/groups',
    items: groups.map((group) => ({
      title: group.name,
      link: `${SITE_URL}/groups/${group.slug}`,
      guid: `${SITE_URL}/groups/${group.slug}`,
      pubDate:
        parseEventTime(group.updated_at) || parseEventTime(group.created_at),
      description: truncateMeta(group.description || '', 280),
    })),
  });
  return rssResponse(xml);
}
