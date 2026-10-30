'use client';

import { TrendingPosts } from '@/components/landing/LandingDiscoveryRail';
import { LandingEventsSection } from '@/components/landing/LandingEventsSection';
import { LandingFeaturedEvent } from '@/components/landing/LandingFeaturedEvent';
import useGetTrendingBlogs from '@/hooks/blog/useGetTrendingBlogs';
import { useEventList } from '@/hooks/events/useEventQueries';
import { LANDING_EVENT_FILTERS, selectLandingEvents } from '@/lib/landingPage';

export function DiscussionDiscoveryRail() {
  const events = useEventList(LANDING_EVENT_FILTERS);
  const trending = useGetTrendingBlogs();
  const slots = selectLandingEvents(events.data?.events ?? []);

  return (
    <aside aria-label='Discover more' className='min-w-0 space-y-4'>
      {!events.isError && slots.featured ? (
        <LandingFeaturedEvent event={slots.featured} />
      ) : null}
      <LandingEventsSection
        events={slots.upcoming}
        isLoading={events.isLoading}
        isError={events.isError}
        variant='compact'
      />
      <TrendingPosts
        posts={trending.blogs}
        isLoading={trending.isLoading}
        isError={trending.isError}
      />
    </aside>
  );
}
