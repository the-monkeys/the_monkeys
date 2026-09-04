import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

const BODY = `# Monkeys

> Research-first publishing platform: journals, events, groups, and a free social studio.

Monkeys (${SITE_URL}) is where researchers and writers publish journals and articles, host community events, run groups, and generate share-ready images.

## Products

- Research journals / blogs: ${SITE_URL}/feed
- Events (meetups, talks, workshops, RSVP): ${SITE_URL}/events
- Groups (research communities): ${SITE_URL}/groups
- Studio — image templates: ${SITE_URL}/snapshot/new
- Studio — X / Twitter screenshots: ${SITE_URL}/snapshot/new?view=x
- Studio — digital business cards: ${SITE_URL}/cards
- About: ${SITE_URL}/about

## Feeds

- Events RSS: ${SITE_URL}/events/feed.xml
- Groups RSS: ${SITE_URL}/groups/feed.xml

## Optional

- Sitemap: ${SITE_URL}/sitemap.xml
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
