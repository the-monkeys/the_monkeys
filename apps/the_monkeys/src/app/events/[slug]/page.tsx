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

  const title = event.title;
  const description = (event.description || '').slice(0, 160);
  const url = `${LIVE_URL || 'https://monkeys.com.co'}/events/${event.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: event.cover_image ? [{ url: event.cover_image }] : undefined,
    },
    twitter: {
      card: event.cover_image ? 'summary_large_image' : 'summary',
      title,
      description,
    },
  };
}

export default function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <EventDetailClient slug={params.slug} />;
}
