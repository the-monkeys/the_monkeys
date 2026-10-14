import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

const BODY = `# Monkeys

> A content and community platform for thoughtful posts, topics, authors, events, and groups.

Monkeys (${SITE_URL}) is created and operated by Buddhicintaka (OPC) Pvt. Ltd. Public pages are available for people and search assistants to discover, read, and cite.

## Public collections

- Latest posts: ${SITE_URL}/feed
- Explore topics: ${SITE_URL}/topics/explore
- Events: ${SITE_URL}/events
- Groups: ${SITE_URL}/groups
- About Monkeys: ${SITE_URL}/about

## Public product tools

- Social image studio: ${SITE_URL}/snapshot/new
- X and Twitter screenshot generator: ${SITE_URL}/snapshot/new?view=x
- Digital business cards: ${SITE_URL}/cards

## Feeds

- Posts RSS: ${SITE_URL}/posts/feed.xml
- Events RSS: ${SITE_URL}/events/feed.xml
- Groups RSS: ${SITE_URL}/groups/feed.xml

## Sitemaps

- Main sitemap: ${SITE_URL}/sitemap.xml
- Topic sitemap: ${SITE_URL}/topics/sitemap.xml
- Event sitemap: ${SITE_URL}/events/sitemap.xml
- Group sitemap: ${SITE_URL}/groups/sitemap.xml
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
