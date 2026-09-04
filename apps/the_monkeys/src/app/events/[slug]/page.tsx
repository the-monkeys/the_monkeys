import { Metadata } from 'next';

import {
  breadcrumb,
  indexRobots,
  noIndexRobots,
  pageMetadata,
  truncateMeta,
} from '@/lib/seo';
import { eventJsonLd } from '@/lib/seoSchema';

import EventDetailClient from './EventDetailClient';
import { loadEventForMetadata } from './eventMetadata';

function isIndexable(status?: string) {
  return status === 'published' || status === 'live' || status === 'completed';
}

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await loadEventForMetadata(params.slug);
  const event = data?.event;
  if (!event) {
    return { title: 'Event not found', robots: noIndexRobots };
  }

  if (!isIndexable(event.status)) {
    return { title: event.title, robots: noIndexRobots };
  }

  return {
    ...pageMetadata({
      title: event.title,
      description: truncateMeta(
        event.description ||
          `${event.title}. A Monkeys event. RSVP and join the session.`
      ),
      path: `/events/${event.slug}`,
      keywords: event.tags,
      image: event.cover_image,
    }),
    robots: indexRobots,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await loadEventForMetadata(params.slug);
  const event = data?.event;

  return (
    <>
      {event && isIndexable(event.status) && (
        <>
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(eventJsonLd(event)) }}
          />
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd(
                breadcrumb([
                  { name: 'Home', path: '/' },
                  { name: 'Events', path: '/events' },
                  { name: event.title, path: `/events/${event.slug}` },
                ])
              ),
            }}
          />
        </>
      )}
      <EventDetailClient slug={params.slug} />
    </>
  );
}
