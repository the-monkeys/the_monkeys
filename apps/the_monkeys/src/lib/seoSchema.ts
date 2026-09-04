import { toIsoTime } from '@/lib/eventTime';
import {
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  breadcrumb,
  faqPage,
  publisherOrg,
  truncateMeta,
} from '@/lib/seo';
import { EventItem } from '@/services/events/eventTypes';
import { GroupItem } from '@/services/groups/groupsTypes';

export function eventsHubGraph(faqs: { question: string; answer: string }[]) {
  const url = absoluteUrl('/events');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Monkeys Events',
        url,
        description:
          'Public research meetups, talks, workshops, and community sessions hosted on Monkeys.',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        about: ['Research events', 'Academic meetups', 'Community workshops'],
      },
      faqPage(url, faqs),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
      ]),
    ],
  };
}

export function groupsHubGraph(faqs: { question: string; answer: string }[]) {
  const url = absoluteUrl('/groups');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Monkeys Groups',
        url,
        description:
          'Public research groups and writing communities on Monkeys.',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      },
      faqPage(url, faqs),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Groups', path: '/groups' },
      ]),
    ],
  };
}

export function studioHubGraph(opts: {
  path: string;
  name: string;
  description: string;
  faqs?: { question: string; answer: string }[];
  featureList: string[];
}) {
  const url = absoluteUrl(opts.path);
  const app = {
    '@type': 'WebApplication',
    name: opts.name,
    url,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: publisherOrg(),
    description: opts.description,
    featureList: opts.featureList,
    isAccessibleForFree: true,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      app,
      ...(opts.faqs?.length ? [faqPage(url, opts.faqs)] : []),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Studio', path: '/snapshot/new' },
      ]),
    ],
  };
}

export function eventJsonLd(event: EventItem) {
  const url = absoluteUrl(`/events/${event.slug}`);
  const attendanceMode =
    event.event_type === 'virtual'
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : event.event_type === 'hybrid'
        ? 'https://schema.org/MixedEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode';

  const status =
    event.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : event.status === 'completed'
        ? 'https://schema.org/EventScheduled'
        : 'https://schema.org/EventScheduled';

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: toIsoTime(event.start_time),
    endDate: toIsoTime(event.end_time),
    eventAttendanceMode: attendanceMode,
    eventStatus: status,
    url,
    image: [absoluteUrl(event.cover_image || OG_IMAGE)],
    organizer: event.organizer_username
      ? {
          '@type': 'Person',
          name: event.organizer_username,
          url: absoluteUrl(`/${event.organizer_username}`),
        }
      : publisherOrg(),
    performer: event.organizer_username
      ? {
          '@type': 'Person',
          name: event.organizer_username,
        }
      : undefined,
    eventSchedule: event.recurrence_text
      ? {
          '@type': 'Schedule',
          repeatFrequency: event.recurrence_text,
        }
      : undefined,
  };

  if (event.description) {
    jsonLd.description = truncateMeta(event.description, 500);
  }
  if (event.tags?.length) jsonLd.keywords = event.tags.join(', ');

  if (event.event_type !== 'virtual' && event.location) {
    const place: Record<string, unknown> = {
      '@type': 'Place',
      name: event.venue?.name || event.location,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.venue?.address_line1 || event.location,
        addressLocality: event.venue?.city,
        addressRegion: event.venue?.region,
        addressCountry: event.venue?.country,
        postalCode: event.venue?.postal_code,
      },
    };
    if (event.venue?.latitude && event.venue?.longitude) {
      place.geo = {
        '@type': 'GeoCoordinates',
        latitude: event.venue.latitude,
        longitude: event.venue.longitude,
      };
    }
    jsonLd.location = place;
  } else if (event.event_type === 'virtual') {
    jsonLd.location = {
      '@type': 'VirtualLocation',
      url: event.meeting_link || url,
    };
  } else if (event.event_type === 'hybrid') {
    jsonLd.location = [
      event.location
        ? {
            '@type': 'Place',
            name: event.location,
            address: event.location,
          }
        : undefined,
      {
        '@type': 'VirtualLocation',
        url: event.meeting_link || url,
      },
    ].filter(Boolean);
  }

  const tiers = event.ticket_tiers || [];
  const paid = tiers.filter((t) => Number(t.price) > 0);
  if (paid.length) {
    jsonLd.offers = paid.map((t) => ({
      '@type': 'Offer',
      name: t.name,
      price: Number(t.price).toFixed(2),
      priceCurrency: (t.currency || 'INR').toUpperCase(),
      url,
      availability: 'https://schema.org/InStock',
      validFrom: toIsoTime(event.rsvp_opens_at),
    }));
  } else {
    jsonLd.isAccessibleForFree = true;
    jsonLd.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      url,
      availability: 'https://schema.org/InStock',
    };
  }

  if (event.capacity) {
    jsonLd.maximumAttendeeCapacity = event.capacity;
    if (event.attendee_count != null) {
      jsonLd.remainingAttendeeCapacity = Math.max(
        0,
        event.capacity - event.attendee_count
      );
    }
  }

  jsonLd.mainEntityOfPage = { '@type': 'WebPage', '@id': url };

  return jsonLd;
}

export function groupJsonLd(group: GroupItem) {
  const url = absoluteUrl(`/groups/${group.slug}`);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': url,
    name: group.name,
    url,
    description: truncateMeta(group.description || '', 400),
    image: group.cover_image
      ? absoluteUrl(group.cover_image)
      : group.logo_image
        ? absoluteUrl(group.logo_image)
        : undefined,
    logo: group.logo_image ? absoluteUrl(group.logo_image) : undefined,
    parentOrganization: publisherOrg(),
    memberOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (group.member_count) {
    jsonLd.numberOfEmployees = {
      '@type': 'QuantitativeValue',
      value: group.member_count,
    };
  }
  if (group.topics?.length) jsonLd.knowsAbout = group.topics;
  if (group.organizer_username) {
    jsonLd.founder = {
      '@type': 'Person',
      name: group.organizer_username,
      url: absoluteUrl(`/${group.organizer_username}`),
    };
  }
  if (group.city || group.country) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      addressLocality: group.city,
      addressRegion: group.region,
      addressCountry: group.country,
    };
  }
  if (group.latitude && group.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: group.latitude,
      longitude: group.longitude,
    };
  }

  return jsonLd;
}
