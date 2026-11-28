import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem } from '@/services/events/eventTypes';
import { describe, expect, it } from 'vitest';

import { usableHomepageCover } from './homepageEligibility';
import {
  LANDING_EVENT_FILTERS,
  selectLandingEvents,
  selectLandingPosts,
} from './landingPage';

const post = (blogId: string, overrides: Partial<MetaBlog> = {}): MetaBlog => ({
  blog_id: blogId,
  title: `Post ${blogId}`,
  first_image: '',
  first_paragraph: `Summary for ${blogId}`,
  owner_account_id: `author-${blogId}`,
  published_time: '2026-09-11T09:00:00.000Z',
  tags: ['Community'],
  homepage_eligibility: {
    eligible: true,
    lead_eligible: true,
    word_count: 250,
    minimum_words: 250,
    reasons: [],
    version: 'homepage-v1',
  },
  ...overrides,
});

const event = (id: number, overrides: Partial<EventItem> = {}): EventItem => ({
  id,
  title: `Event ${id}`,
  slug: `event-${id}`,
  event_type: 'virtual',
  status: 'published',
  ...overrides,
});

describe('landing page content selection', () => {
  it('uses the exact public upcoming-event query contract', () => {
    expect(LANDING_EVENT_FILTERS).toEqual({
      limit: 3,
      status: 'published',
      date: 'upcoming',
      sort: 'soonest',
    });
  });

  it('prefers a media-rich lead while retaining valid text-only posts', () => {
    const slots = selectLandingPosts([
      post('text-only'),
      post('lead', { first_image: '/lead.jpg', tags: ['Design'] }),
      post('supporting'),
    ]);

    expect(slots.lead?.blog_id).toBe('lead');
    expect(slots.supporting.map((item) => item.blog_id)).toEqual([
      'text-only',
      'supporting',
    ]);
  });

  it('reserves unique posts for the trending list', () => {
    const slots = selectLandingPosts(
      Array.from({ length: 18 }, (_, index) =>
        post(`post-${index + 1}`, {
          first_image: index === 0 ? '/lead.jpg' : '',
        })
      )
    );
    const primaryIds = [
      slots.lead?.blog_id,
      ...slots.supporting.map((item) => item.blog_id),
      slots.feature?.blog_id,
      ...slots.latest.map((item) => item.blog_id),
      ...slots.community.map((item) => item.blog_id),
    ];

    expect(slots.trending).toHaveLength(4);
    expect(
      slots.trending.every((item) => !primaryIds.includes(item.blog_id))
    ).toBe(true);
  });

  it('uses the first valid event as the feature and keeps the rest compact', () => {
    const slots = selectLandingEvents([
      event(0, { title: '', slug: '' }),
      event(1),
      event(2),
      event(3),
    ]);

    expect(slots.featured?.id).toBe(1);
    expect(slots.upcoming.map((item) => item.id)).toEqual([2, 3]);
  });

  it('filters invalid and duplicate posts without repeating any content slot', () => {
    const posts = [
      post('lead', { first_image: '/lead.jpg' }),
      post('lead', { title: 'Duplicate lead' }),
      post(''),
      post('untitled', { title: '' }),
      ...Array.from({ length: 11 }, (_, index) => post(`post-${index + 1}`)),
    ];

    const slots = selectLandingPosts(posts);
    const allIds = [
      slots.lead?.blog_id,
      ...slots.supporting.map((item) => item.blog_id),
      slots.feature?.blog_id,
      ...slots.latest.map((item) => item.blog_id),
      ...slots.community.map((item) => item.blog_id),
      ...slots.trending.map((item) => item.blog_id),
    ].filter((id): id is string => Boolean(id));

    expect(allIds).not.toContain('');
    expect(allIds).not.toContain('untitled');
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('filters malformed API records instead of throwing while rendering', () => {
    const malformedPosts = [
      post('valid'),
      { ...post('bad-id'), blog_id: 42 },
      { ...post('bad-title'), title: { text: 'Wrong shape' } },
      null,
    ] as unknown as MetaBlog[];
    const malformedEvents = [
      event(1),
      { ...event(2), title: 42 },
      { ...event(3), slug: null },
    ] as unknown as EventItem[];

    expect(selectLandingPosts(malformedPosts).supporting[0]?.blog_id).toBe(
      'valid'
    );
    expect(selectLandingEvents(malformedEvents).featured?.id).toBe(1);
  });
});

describe('homepage policy placement', () => {
  it('does not promote a text-only article when no usable lead exists', () => {
    const slots = selectLandingPosts([post('text-only')]);
    expect(slots.lead).toBeUndefined();
    expect(slots.supporting.map((item) => item.blog_id)).toEqual(['text-only']);
  });

  it('requires explicit current-version eligibility in every homepage slot', () => {
    const unmarked = post('old', { homepage_eligibility: undefined });
    const rejected = post('rejected');
    rejected.homepage_eligibility!.eligible = false;
    const old = post('old-policy');
    old.homepage_eligibility!.version = 'homepage-v0' as any;
    const slots = selectLandingPosts([
      unmarked,
      rejected,
      old,
      post('qualified'),
    ]);
    expect(slots.lead).toBeUndefined();
    expect(slots.supporting.map((item) => item.blog_id)).toEqual(['qualified']);
  });

  it('does not use an invalid or placeholder cover even with a lead marker', () => {
    for (const first_image of [
      'blob:pending',
      'data:image/png;base64,a',
      '/image-placeholder.png',
      '//cdn.test/photo.jpg',
      'bad',
    ]) {
      expect(
        selectLandingPosts([post('bad-cover', { first_image })]).lead
      ).toBeUndefined();
    }
    const marked = post('no-lead', { first_image: '/real.jpg' });
    marked.homepage_eligibility!.lead_eligible = false;
    expect(selectLandingPosts([marked]).lead).toBeUndefined();
  });
});

describe('server-compatible persisted cover structure', () => {
  it.each([
    '/placeholder.png',
    '/a-guide-to-placeholders.jpg',
    '/opengraph-image.png',
    '/default-image.jpg',
    'https://images.example.org/placeholder-design.jpg',
    ' /authored-cover.jpg ',
  ])('allows the authored cover %s', (cover) => {
    expect(usableHomepageCover(cover)).toBe(true);
  });
  it.each([
    '/image-placeholder.png',
    '/placeholder-image.jpg',
    'https://example.org/image-placeholder.png',
    'blob:pending',
    'data:image/png;base64,a',
    'javascript:alert(1)',
    '//example.org/photo.jpg',
    '/',
    'https://example.org/',
    '/bad\\path.jpg',
    '/bad<image>.jpg',
    '/bad\timage.jpg',
  ])('rejects the unusable cover %s', (cover) => {
    expect(usableHomepageCover(cover)).toBe(false);
  });
});

describe('concealed homepage post placement', () => {
  it.each([{ is_nsfw: true }, { content_rating: { is_nsfw: true } }])(
    'retains an explicitly eligible lead after its cover is redacted: %j',
    (rating) => {
      const concealed = post('concealed-lead', {
        title: 'Sensitive content',
        first_image: '',
        first_paragraph: '',
        ...rating,
      });
      const slots = selectLandingPosts([
        concealed,
        post('next', { first_image: '/next.jpg' }),
      ]);
      expect(slots.lead?.blog_id).toBe('concealed-lead');
      expect(slots.supporting.map((item) => item.blog_id)).toEqual(['next']);
      expect(slots.lead?.first_image).toBe('');
    }
  );
  it('does not promote a restricted article without explicit lead eligibility', () => {
    const concealed = post('not-lead', { is_nsfw: true });
    concealed.homepage_eligibility!.lead_eligible = false;
    expect(selectLandingPosts([concealed]).lead).toBeUndefined();
  });
});
