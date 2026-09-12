import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { META_FEED_QUERY_KEY } from '@/hooks/blog/useGetMetaFeedBlogs';
import { LANDING_EVENT_FILTERS } from '@/lib/landingPage';
import { landingCollectionSchema, landingMetadata } from '@/lib/landingPageSeo';
import { queryKeys } from '@/lib/queryKeys';
import { listEvents } from '@/services/events/eventsApi';
import { fetcherV2 } from '@/services/fetcher';
import { getQueryClient } from '@/utils/get-query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import LandingPageClient from './LandingPageClient';

export const metadata: Metadata = landingMetadata;

export default async function LandingPage() {
  const queryClient = getQueryClient();
  const limit = 30;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [META_FEED_QUERY_KEY, limit],
      queryFn: () => fetcherV2(`/blog/meta-feed?limit=${limit}`),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.events.list(LANDING_EVENT_FILTERS),
      queryFn: () => listEvents(LANDING_EVENT_FILTERS),
    }),
  ]);

  return (
    <>
      <JsonLd data={landingCollectionSchema} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LandingPageClient />
      </HydrationBoundary>
    </>
  );
}
