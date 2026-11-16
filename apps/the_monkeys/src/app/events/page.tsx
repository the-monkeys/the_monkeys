import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import {
  loadDiscoveryEvents,
  loadDiscoveryGroups,
} from '@/lib/publicDiscovery';
import { EVENTS_SEO, pageMetadata } from '@/lib/seo';
import { eventsHubGraph } from '@/lib/seoSchema';

import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = pageMetadata({
  ...EVENTS_SEO,
  rss: '/events/feed.xml',
});

export default async function EventsPage() {
  const [initialEvents, initialGroups] = await Promise.all([
    loadDiscoveryEvents(),
    loadDiscoveryGroups(),
  ]);
  return (
    <>
      <JsonLd data={eventsHubGraph(EVENTS_SEO.faqs)} />
      <EventsPageClient
        initialEvents={initialEvents}
        initialGroups={initialGroups}
      />
    </>
  );
}
