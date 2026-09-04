import { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { API_URL } from '@/constants/api';
import {
  breadcrumb,
  indexRobots,
  noIndexRobots,
  pageMetadata,
  truncateMeta,
} from '@/lib/seo';
import { eventJsonLd } from '@/lib/seoSchema';
import { EventResp } from '@/services/events/eventTypes';

import EventDetailClient from './EventDetailClient';

async function loadEvent(slug: string): Promise<EventResp | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/events/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function isIndexable(status?: string) {
  return status === 'published' || status === 'live' || status === 'completed';
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await loadEvent(params.slug);
  const event = data?.event;
  if (!event || !isIndexable(event.status)) {
    return { title: 'Event not found', robots: noIndexRobots };
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
  const data = await loadEvent(params.slug);
  const event = data?.event;

  return (
    <>
      {event && isIndexable(event.status) && (
        <>
          <JsonLd data={eventJsonLd(event)} />
          <JsonLd
            data={breadcrumb([
              { name: 'Home', path: '/' },
              { name: 'Events', path: '/events' },
              { name: event.title, path: `/events/${event.slug}` },
            ])}
          />
        </>
      )}
      <EventDetailClient slug={params.slug} />
    </>
  );
}
