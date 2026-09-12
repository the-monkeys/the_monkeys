import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem, ListFilters } from '@/services/events/eventTypes';

export const LANDING_EVENT_FILTERS = {
  limit: 3,
  status: 'published',
  date: 'upcoming',
  sort: 'soonest',
} as const satisfies ListFilters;

export const LANDING_THIS_WEEK_EVENT_FILTERS = {
  limit: 4,
  status: 'published',
  date: 'this-week',
  sort: 'soonest',
} as const satisfies ListFilters;

export interface LandingPostSlots {
  lead?: MetaBlog;
  supporting: MetaBlog[];
  feature?: MetaBlog;
  latest: MetaBlog[];
  community: MetaBlog[];
  trending: MetaBlog[];
}

export interface LandingEventSlots {
  featured?: EventItem;
  upcoming: EventItem[];
}

function dedupeValidPosts(posts: MetaBlog[]): MetaBlog[] {
  const seen = new Set<string>();

  return posts.filter((post) => {
    const id = post?.blog_id?.trim();
    const title = post?.title?.trim();
    if (!id || !title || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export function selectLandingPosts(posts: MetaBlog[]): LandingPostSlots {
  const eligible = dedupeValidPosts(posts);
  const lead =
    eligible.find(
      (post) => Boolean(post.first_image) && Boolean(post.tags?.length)
    ) ?? eligible[0];
  const remaining = eligible.filter((post) => post.blog_id !== lead?.blog_id);

  return {
    lead,
    supporting: remaining.slice(0, 2),
    feature: remaining[2],
    latest: remaining.slice(3, 7),
    community: remaining.slice(7, 11),
    trending: remaining.slice(11, 15),
  };
}

export function selectLandingEvents(events: EventItem[]): LandingEventSlots {
  const valid = events.filter(
    (event) =>
      Boolean(event?.id) &&
      Boolean(event?.title?.trim()) &&
      Boolean(event?.slug?.trim())
  );

  return {
    featured: valid[0],
    upcoming: valid.slice(1, 4),
  };
}
