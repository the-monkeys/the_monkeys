import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { EVENTS_SEO, pageMetadata } from '@/lib/seo';
import { eventsHubGraph } from '@/lib/seoSchema';

import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = pageMetadata({
  ...EVENTS_SEO,
  rss: '/events/feed.xml',
});

export default function EventsPage() {
  return (
    <>
      <JsonLd data={eventsHubGraph(EVENTS_SEO.faqs)} />
      <h1 className='hidden text-2xl font-bold'>
        Research events and meetups on Monkeys. Host or RSVP to talks,
        workshops, and community sessions
      </h1>
      <EventsPageClient />
    </>
  );
}
