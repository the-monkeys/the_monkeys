import { describe, expect, it } from 'vitest';

import { eventJsonLd, groupJsonLd } from './seoSchema';

describe('public event and group structured data', () => {
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
    expect(schema.location).toEqual({
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

    expect(schema.location).toEqual([
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
    expect(schema['@id']).toBe(
      'https://monkeys.com.co/groups/ai-builders#group'
    );
    expect(schema.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://monkeys.com.co/groups/ai-builders',
      isPartOf: { '@id': 'https://monkeys.com.co/#website' },
    });
    expect(schema.interactionStatistic).toEqual({
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'JoinAction' },
      userInteractionCount: 42,
    });
  });
});
