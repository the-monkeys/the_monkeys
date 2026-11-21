import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { LANDING_EVENT_FILTERS, LANDING_POST_LIMIT } from '@/lib/landingPage';
import { landingEntityGraph, landingMetadata } from '@/lib/landingPageSeo';
import { publicEvent } from '@/lib/publicEvent';
import { queryKeys } from '@/lib/queryKeys';
import { homepageBlogQuery } from '@/services/blog/homepageApi';
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

  await Promise.all([
    queryClient.prefetchQuery(landingDiscussionQuery),
    queryClient.prefetchQuery(landingGroupQuery),
    queryClient.prefetchQuery(homepageBlogQuery({ limit })),
    queryClient.prefetchQuery(homepageBlogQuery({ limit, sort: 'trending' })),
    queryClient.prefetchQuery({
      queryKey: queryKeys.events.list(LANDING_EVENT_FILTERS),
      queryFn: async () => {
        const response = await listEvents(LANDING_EVENT_FILTERS);
        return { ...response, events: response.events?.map(publicEvent) };
      },
    }),
  ]);

  return (
    <>
      <JsonLd data={landingEntityGraph} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LandingPageClient />
      </HydrationBoundary>
    </>
  );
}
