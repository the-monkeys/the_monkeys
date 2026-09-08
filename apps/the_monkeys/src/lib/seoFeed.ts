import { SITE_NAME, SITE_URL, escapeXml } from '@/lib/seo';

export type RssItem = {
  title: string;
  link: string;
  guid: string;
  pubDate?: Date | null;
  description?: string;
};

export function buildRssXml({
  title,
  description,
  path,
  items,
}: {
  title: string;
  description: string;
  path: string;
  items: RssItem[];
}): string {
  const channelLink = `${SITE_URL}${path}`;
  const itemXml = items
    .map((item) => {
      const desc = escapeXml(item.description || '');
      const pub = item.pubDate
        ? `<pubDate>${item.pubDate.toUTCString()}</pubDate>`
        : '';
      return `<item>
        <title>${escapeXml(item.title)}</title>
        <link>${escapeXml(item.link)}</link>
        <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
        ${pub}
        <description><![CDATA[${desc}]]></description>
      </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <generator>${escapeXml(SITE_NAME)}</generator>
    ${itemXml}
  </channel>
</rss>`;
}

export function rssResponse(xml: string) {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
