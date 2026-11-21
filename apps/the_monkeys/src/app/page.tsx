import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import {
  LANDING_EVENT_FILTERS,
  LANDING_POST_LIMIT,
  LANDING_THIS_WEEK_EVENT_FILTERS,
} from '@/lib/landingPage';
import { landingEntityGraph, landingMetadata } from '@/lib/landingPageSeo';
import { publicEvent } from '@/lib/publicEvent';
import { prefetchPublicPageMetadata } from '@/lib/publicPagePrefetch';
import { queryKeys } from '@/lib/queryKeys';
import {
  type HomepageBlogsResponse,
  homepageBlogQuery,
} from '@/services/blog/homepageApi';
import type { ListEventsResp, ListFilters } from '@/services/events/eventTypes';
import { listEvents } from '@/services/events/eventsApi';
import {
  landingDiscussionQuery,
  landingGroupQuery,
} from '@/services/landing/communityApi';
import { getQueryClient } from '@/utils/get-query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import LandingPageClient from './LandingPageClient';

export const metadata: Metadata = landingMetadata;

export default async function LandingPage() {
  const queryClient = getQueryClient();
  const limit = LANDING_POST_LIMIT;
  const prefetchEvents = (filters: ListFilters) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.events.list(filters),
      queryFn: async () => {
        const response = await listEvents(filters);
        return { ...response, events: response.events?.map(publicEvent) };
      },
    });
  await Promise.all([
    queryClient.prefetchQuery(landingDiscussionQuery),
    queryClient.prefetchQuery(landingGroupQuery),
    queryClient.prefetchQuery(homepageBlogQuery({ limit })),
    queryClient.prefetchQuery(homepageBlogQuery({ limit, sort: 'trending' })),
    prefetchEvents(LANDING_EVENT_FILTERS),
    prefetchEvents(LANDING_THIS_WEEK_EVENT_FILTERS),
  ]);
  const posts = [
    ...(queryClient.getQueryData<HomepageBlogsResponse>(
      homepageBlogQuery({ limit }).queryKey
    )?.blogs || []),
    ...(queryClient.getQueryData<HomepageBlogsResponse>(
      homepageBlogQuery({ limit, sort: 'trending' }).queryKey
    )?.blogs || []),
  ];
  const events =
    queryClient.getQueryData<ListEventsResp>(
      queryKeys.events.list(LANDING_EVENT_FILTERS)
    )?.events || [];
  await prefetchPublicPageMetadata(queryClient, {
    authorIds: [
      ...posts.map((post) => post.owner_account_id),
      ...events.map((event) => event.organizer_account_id || ''),
    ],
    activeUsers: true,
  });
  return (
    <>
      <JsonLd data={landingEntityGraph} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LandingPageClient />
      </HydrationBoundary>
    </>
  );
}
