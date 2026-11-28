import type { EventItem } from '@/services/events/eventTypes';
import { describe, expect, it } from 'vitest';

import { eventJsonLd, groupJsonLd } from './seoSchema';

describe('public event and group structured data', () => {
  it('includes the free tier alongside paid tickets in a mixed-price event', () => {
    const schema = eventJsonLd({
      id: 3,
      title: 'Community workshop',
      slug: 'community-workshop',
      event_type: 'in_person',
      status: 'published',
      visibility: 'public',
      ticket_tiers: [
        {
          id: 1,
          name: 'Community',
          price: 0,
          currency: 'INR',
          capacity: 10,
          booked: 2,
        },
        {
          id: 2,
          name: 'Supporter',
          price: 500,
          currency: 'INR',
          capacity: 10,
          booked: 1,
        },
      ],
    });
    expect(schema?.offers).toEqual([
      expect.objectContaining({ name: 'Community', price: '0.00' }),
      expect.objectContaining({ name: 'Supporter', price: '500.00' }),
    ]);
  });

  it('reports sold-out tiers accurately while retaining available unlimited tiers', () => {
    const schema = eventJsonLd({
      id: 4,
      title: 'Workshop',
      slug: 'workshop',
      event_type: 'virtual',
      status: 'published',
      ticket_tiers: [
        { id: 1, name: 'Reserved', price: 100, capacity: 10, booked: 10 },
        { id: 2, name: 'Online', price: 200, capacity: 0, booked: 100 },
      ],
    });
    expect(schema?.offers).toEqual([
      expect.objectContaining({ availability: 'https://schema.org/SoldOut' }),
      expect.objectContaining({ availability: 'https://schema.org/InStock' }),
    ]);
  });

  it('does not advertise free seats when the event capacity is exhausted', () => {
    const schema = eventJsonLd({
      id: 5,
      title: 'Full event',
      slug: 'full-event',
      event_type: 'virtual',
      status: 'published',
      capacity: 20,
      attendee_count: 20,
    });
    expect(schema?.offers).toMatchObject({
      availability: 'https://schema.org/SoldOut',
    });
  });

  it('never exposes an attendee-only meeting URL', () => {
    const schema = eventJsonLd({
      id: 1,
      title: 'Public Event',
      slug: 'public-event',
      event_type: 'virtual',
      status: 'published',
      meeting_link: 'https://meet.example.test/private-room',
    });

    expect(JSON.stringify(schema)).not.toContain(
      'https://meet.example.test/private-room'
    );
    expect(schema?.location).toEqual({
      '@type': 'VirtualLocation',
      url: 'https://monkeys.com.co/events/public-event',
    });
  });

  it('describes both locations for a hybrid event without exposing its meeting URL', () => {
    const schema = eventJsonLd({
      id: 2,
      title: 'Hybrid Event',
      slug: 'hybrid-event',
      event_type: 'hybrid',
      status: 'published',
      visibility: 'public',
      location: 'Bengaluru',
      meeting_link: 'https://meet.example.test/private-hybrid-room',
    });

    expect(schema?.location).toEqual([
      expect.objectContaining({ '@type': 'Place' }),
      {
        '@type': 'VirtualLocation',
        url: 'https://monkeys.com.co/events/hybrid-event',
      },
    ]);
    expect(JSON.stringify(schema)).not.toContain('private-hybrid-room');
  });

  it('represents community size without treating members as employees', () => {
    const schema = groupJsonLd({
      id: 1,
      name: 'AI Builders',
      slug: 'ai-builders',
      description: 'A public community for AI builders.',
      visibility: 'public',
      status: 'published',
      member_count: 42,
    });

    expect(schema).not.toHaveProperty('numberOfEmployees');
    expect(schema).not.toHaveProperty('parentOrganization');
    expect(schema?.['@id']).toBe(
      'https://monkeys.com.co/groups/ai-builders#group'
    );
    expect(schema?.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://monkeys.com.co/groups/ai-builders',
      isPartOf: { '@id': 'https://monkeys.com.co/#website' },
    });
    expect(schema?.interactionStatistic).toEqual({
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'JoinAction' },
      userInteractionCount: 42,
    });
  });
});

describe('event offer registration opening dates', () => {
  const base: EventItem = {
    id: 21,
    title: 'Local registration test',
    slug: 'local-registration-test',
    event_type: 'in_person',
    status: 'published',
    visibility: 'public',
    start_time: '2026-12-01T10:00:00Z',
    created_at: '2026-11-01T09:00:00Z',
  };
  const dates: Array<[string, EventItem['rsvp_opens_at'], string]> = [
    ['UTC', '2026-11-20T09:00:00Z', '2026-11-20T09:00:00.000Z'],
    [
      'timezone offset',
      '2026-11-20T14:30:00+05:30',
      '2026-11-20T09:00:00.000Z',
    ],
    [
      'protobuf timestamp',
      { seconds: Date.parse('2026-11-20T09:00:00Z') / 1000, nanos: 123000000 },
      '2026-11-20T09:00:00.123Z',
    ],
  ];
  it.each(dates)(
    'uses the actual %s opening date for a free event without tiers',
    (_name, date, expected) => {
      const schema = eventJsonLd({ ...base, rsvp_opens_at: date });
      expect(schema?.offers).toMatchObject({
        price: '0',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: expected,
      });
      expect(schema?.isAccessibleForFree).toBe(true);
    }
  );
  it('keeps the opening date on a sold-out event with free tiers', () => {
    const schema = eventJsonLd({
      ...base,
      rsvp_opens_at: '2026-11-20T09:00:00Z',
      ticket_tiers: [{ id: 1, name: 'Free', price: 0, capacity: 2, booked: 2 }],
    });
    expect(schema?.offers).toMatchObject({
      validFrom: '2026-11-20T09:00:00.000Z',
      availability: 'https://schema.org/SoldOut',
      price: '0',
    });
  });
  it('retains prices, availability and actual opening dates on paid and mixed tiers', () => {
    const schema = eventJsonLd({
      ...base,
      rsvp_opens_at: '2026-11-20T14:30:00+05:30',
      ticket_tiers: [
        { id: 1, name: 'Free', price: 0, capacity: 10 },
        { id: 2, name: 'Paid', price: 500, currency: 'INR', capacity: 10 },
      ],
    });
    expect(schema?.offers).toEqual([
      expect.objectContaining({
        name: 'Free',
        price: '0.00',
        validFrom: '2026-11-20T09:00:00.000Z',
      }),
      expect.objectContaining({
        name: 'Paid',
        price: '500.00',
        validFrom: '2026-11-20T09:00:00.000Z',
      }),
    ]);
  });
  it.each([
    undefined,
    '',
    'invalid-date',
    '2026-11-31T09:00:00Z',
    '2026-02-29T09:00:00+05:30',
    '2026-02-30T09:00:00Z',
    { seconds: 0 },
    { seconds: 'invalid' },
    { seconds: 1e30 },
  ])(
    'omits unknown or invalid opening dates without inventing a fallback: %j',
    (date) => {
      const schema = eventJsonLd({ ...base, rsvp_opens_at: date });
      expect(JSON.stringify(schema?.offers)).not.toContain('validFrom');
      expect(JSON.stringify(schema?.offers)).not.toContain('2026-12-01');
      expect(JSON.stringify(schema?.offers)).not.toContain('2026-11-01');
    }
  );
});
