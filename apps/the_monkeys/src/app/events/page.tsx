import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { directoryPageState } from '@/lib/directoryPageData';
import { EVENTS_SEO, pageMetadata } from '@/lib/seo';
import { eventsHubGraph } from '@/lib/seoSchema';
import { HydrationBoundary } from '@tanstack/react-query';

import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = pageMetadata({
  ...EVENTS_SEO,
  rss: '/events/feed.xml',
});

export default async function EventsPage() {
  const state = await directoryPageState(true);
  const graph = eventsHubGraph([]);
  graph['@graph'] = graph['@graph'].filter(
    (node) => node['@type'] !== 'FAQPage'
  );
  return (
    <>
      <JsonLd data={graph} />
      <h1 className='hidden text-2xl font-bold'>
        Research events and meetups on Monkeys. Host or RSVP to talks,
        workshops, and community sessions
      </h1>
      <HydrationBoundary state={state}>
        <EventsPageClient />
      </HydrationBoundary>
    </>
  );
}
