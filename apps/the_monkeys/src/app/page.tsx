import { META_FEED_QUERY_KEY } from '@/hooks/blog/useGetMetaFeedBlogs';
import { fetcherV2 } from '@/services/fetcher';
import { getQueryClient } from '@/utils/get-query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import LandingPageClient from './LandingPageClient';

export default async function LandingPage() {
  const queryClient = getQueryClient();
  const limit = 30;

  await queryClient.prefetchQuery({
    queryKey: [META_FEED_QUERY_KEY, limit],
    queryFn: () => fetcherV2(`/blog/meta-feed?limit=${limit}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingPageClient />
    </HydrationBoundary>
  );
}
