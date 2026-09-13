import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem } from '@/services/events/eventTypes';
import { describe, expect, it } from 'vitest';

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
});
