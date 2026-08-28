import { Metadata } from 'next';

import { API_URL, LIVE_URL } from '@/constants/api';
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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await loadEvent(params.slug);
  const event = data?.event;
  if (!event) {
    return { title: 'Event not found' };
  }

  const base = LIVE_URL || 'https://monkeys.com.co';
  const title = event.title;
  const description = (event.description || '').slice(0, 160);
  const url = `${base}/events/${event.slug}`;
  const imageUrl =
    event.cover_image || `${base}/social-snapshot-placeholder.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Monkeys',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await loadEvent(params.slug);
  const jsonLd = data?.event ? buildEventJsonLd(data.event) : null;

  return (
    <>
      {jsonLd && (
        <script
          type='application/ld+json'
          // Server-rendered from our own API; the payload is JSON-serialized
          // (not raw user HTML), so this is safe structured metadata for crawlers.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <EventDetailClient slug={params.slug} />
    </>
  );
}

// Schema.org Event JSON-LD so search engines can surface the event with its
// title, time, place, image and host in rich results.
function buildEventJsonLd(event: NonNullable<EventResp['event']>) {
  const base = LIVE_URL || 'https://monkeys.com.co';
  const attendanceMode =
    event.event_type === 'virtual'
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : event.event_type === 'hybrid'
        ? 'https://schema.org/MixedEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode';

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.start_time,
    endDate: event.end_time,
    eventAttendanceMode: attendanceMode,
    eventStatus:
      event.status === 'cancelled'
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled',
    url: `${base}/events/${event.slug}`,
  };

  if (event.description) jsonLd.description = event.description.slice(0, 500);
  jsonLd.image = [
    event.cover_image || `${base}/social-snapshot-placeholder.png`,
  ];
  if (event.tags?.length) jsonLd.keywords = event.tags.join(', ');

  if (event.event_type !== 'virtual' && event.location) {
    jsonLd.location = {
      '@type': 'Place',
      name: event.location,
      address: event.location,
    };
  } else if (event.event_type === 'virtual' && event.meeting_link) {
    jsonLd.location = {
      '@type': 'VirtualLocation',
      url: event.meeting_link,
    };
  }

  if (event.organizer_username) {
    jsonLd.organizer = {
      '@type': 'Person',
      name: `@${event.organizer_username}`,
      url: `${base}/${event.organizer_username}`,
    };
  }

  return jsonLd;
}
