'use client';

import { useState } from 'react';

import { LandingCapabilityNav } from '@/components/landing/LandingCapabilityNav';
import {
  LandingDiscussions,
  LandingGroups,
} from '@/components/landing/LandingCommunity';
import { LandingDiscoveryRail } from '@/components/landing/LandingDiscoveryRail';
import { LandingEditorialFeed } from '@/components/landing/LandingEditorialFeed';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingMorePosts } from '@/components/landing/LandingMorePosts';
import useAuth from '@/hooks/auth/useAuth';
import useGetHomepageBlogs from '@/hooks/blog/useGetHomepageBlogs';
import { useEventList } from '@/hooks/events/useEventQueries';
import { useLandingCommunity } from '@/hooks/landing/useLandingCommunity';
import { hasKnownViewer } from '@/lib/authQuerySession';
import {
  LANDING_EVENT_FILTERS,
  LANDING_POST_LIMIT,
  LANDING_THIS_WEEK_EVENT_FILTERS,
  selectLandingEvents,
  selectLandingPosts,
} from '@/lib/landingPage';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

function PostLoadingState() {
  return (
    <div aria-label='Loading posts' className='py-7 sm:py-9'>
      <div className='grid gap-5 sm:grid-cols-2'>
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className='h-48 animate-pulse rounded-xl border border-border-light/70 bg-gray-50 dark:border-border-dark/40 dark:bg-white/[0.025]'
          />
        ))}
      </div>
    </div>
  );
}

function LeadLoadingState({ failed = false }: { failed?: boolean }) {
  return (
    <div
      role='status'
      aria-label={
        failed ? 'Featured post unavailable' : 'Loading featured post'
      }
      className='flex min-h-[calc(56.25vw+13.5rem)] min-w-0 flex-col justify-center rounded-xl border border-border-light/70 bg-background-light p-4 dark:border-border-dark/40 dark:bg-background-dark sm:min-h-[254px]'
    >
      {failed ? (
        <p className='font-inter text-sm text-gray-500'>
          Posts are taking a little longer to load.
        </p>
      ) : (
        <div aria-hidden='true' className='space-y-4 motion-safe:animate-pulse'>
          <div className='h-32 rounded-lg bg-gray-100 dark:bg-gray-800' />
          <div className='h-6 w-4/5 rounded bg-gray-100 dark:bg-gray-800' />
          <div className='h-4 w-3/5 rounded bg-gray-100 dark:bg-gray-800' />
        </div>
      )}
    </div>
  );
}

function PostErrorState() {
  return (
    <div className='my-8 rounded-xl border border-border-light/70 px-5 py-5 dark:border-border-dark/40'>
      <p className='font-inter text-sm font-semibold text-text-light dark:text-text-dark'>
        Posts are taking a little longer to load.
      </p>
      <p className='mt-1 font-inter text-sm leading-6 text-gray-500 dark:text-gray-400'>
        Events and featured authors are still available.
      </p>
    </div>
  );
}

const LandingPageClient = () => {
  const [feedFilter, setFeedFilter] = useState<'all' | 'articles'>('all');
  const auth = useAuth();
  const catalog = {
    viewer: auth.data?.account_id || auth.data?.username,
    enabled: hasKnownViewer(auth),
  };
  const postQuery = useGetHomepageBlogs({ limit: LANDING_POST_LIMIT }, catalog);
  const community = useLandingCommunity();
  const trendingQuery = useGetHomepageBlogs(
    {
      limit: LANDING_POST_LIMIT,
      sort: 'trending',
    },
    catalog
  );
  const eventQuery = useEventList(LANDING_EVENT_FILTERS);
  const weeklyEventQuery = useEventList(LANDING_THIS_WEEK_EVENT_FILTERS);
  const postSlots = selectLandingPosts(postQuery.blogs?.blogs ?? []);
  const eventSlots = selectLandingEvents(eventQuery.data?.events ?? []);
  const weeklyEvents = (weeklyEventQuery.data?.events ?? [])
    .filter((event) => event.id !== eventSlots.featured?.id)
    .slice(0, 3);
  const discoveryEvents = weeklyEvents.length
    ? weeklyEvents
    : eventSlots.upcoming;
  const discoveryEventsTitle = weeklyEvents.length
    ? "This week's events"
    : 'Upcoming events';
  const devTest = useFeatureIsOn('gb-test');

  return (
    <div className='min-h-screen'>
      {devTest && (
        <div className='mb-3 rounded-md bg-alert-green/15 py-1 text-center font-inter text-xs text-alert-green'>
          GrowthBook Feature Testing Enabled
        </div>
      )}

      <LandingHero
        leadFallback={
          postQuery.isLoading || postQuery.isError ? (
            <LeadLoadingState failed={postQuery.isError} />
          ) : undefined
        }
        lead={
          !postQuery.isLoading && !postQuery.isError
            ? postSlots.lead
            : undefined
        }
        featuredEvent={
          !eventQuery.isLoading && !eventQuery.isError
            ? eventSlots.featured
            : undefined
        }
        communityContent={
          <LandingDiscussions discussions={community.discussions} />
        }
        groupsContent={<LandingGroups groups={community.groups} rail />}
        primaryContent={
          <>
            <LandingCapabilityNav
              upcomingCount={eventQuery.data?.total}
              activeFeedFilter={feedFilter}
              onFeedFilterChange={setFeedFilter}
            />
            <div className='min-w-0'>
              {postQuery.isLoading ? (
                <PostLoadingState />
              ) : postQuery.isError ? (
                <PostErrorState />
              ) : (
                <LandingEditorialFeed
                  posts={[
                    ...postSlots.supporting,
                    ...(postSlots.feature ? [postSlots.feature] : []),
                  ]}
                  events={feedFilter === 'articles' ? [] : eventSlots.upcoming}
                />
              )}
            </div>
          </>
        }
        secondaryContent={
          <LandingDiscoveryRail
            events={discoveryEvents}
            eventsTitle={discoveryEventsTitle}
            trending={trendingQuery.blogs?.blogs ?? []}
            eventsLoading={weeklyEventQuery.isLoading}
            eventsError={weeklyEventQuery.isError}
            trendingLoading={trendingQuery.isLoading}
            trendingError={trendingQuery.isError}
          />
        }
      />
      {!postQuery.isLoading && !postQuery.isError ? (
        <LandingMorePosts
          posts={[...postSlots.latest, ...postSlots.community]}
        />
      ) : null}
    </div>
  );
};

export default LandingPageClient;
