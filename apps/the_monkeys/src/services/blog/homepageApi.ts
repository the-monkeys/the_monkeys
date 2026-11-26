import {
  HOMEPAGE_POLICY_VERSION,
  hasHomepageAssessment,
  isHomepageEligible,
} from '@/lib/homepageEligibility';
import { LIVE_LIST_STALE_MS } from '@/lib/queryFreshness';
import { queryKeys } from '@/lib/queryKeys';
import { fetcherV2 } from '@/services/fetcher';

import type { MetaBlog } from './blogTypes';

export interface HomepageBlogParams {
  limit?: number;
  offset?: number;
  sort?: 'latest' | 'trending';
}
export interface HomepageBlogsResponse {
  blogs: MetaBlog[];
  has_more: boolean;
  homepage_policy_version: 'homepage-v1';
}
export async function readHomepageBlogs({
  limit = 12,
  offset = 0,
  sort = 'latest',
}: HomepageBlogParams = {}): Promise<HomepageBlogsResponse> {
  const data = await fetcherV2(
    `/blog/homepage?limit=${limit}&offset=${offset}&sort=${sort}`
  );
  if (
    !data ||
    data.homepage_policy_version !== HOMEPAGE_POLICY_VERSION ||
    typeof data.has_more !== 'boolean' ||
    !Array.isArray(data.blogs) ||
    !data.blogs.every((post: MetaBlog) => hasHomepageAssessment(post))
  ) {
    throw new Error('Homepage policy response is unavailable.');
  }
  return { ...data, blogs: data.blogs.filter(isHomepageEligible) };
}

/** Writes refresh this homepage-only branch; ordinary and personalized caches stay separate. */
export function homepageBlogQuery(
  { limit = 12, offset = 0, sort = 'latest' }: HomepageBlogParams = {},
  viewer?: string
) {
  return {
    queryKey: queryKeys.blog.homepage(
      sort,
      limit,
      offset,
      HOMEPAGE_POLICY_VERSION,
      viewer
    ),
    queryFn: () => readHomepageBlogs({ limit, offset, sort }),
    staleTime: LIVE_LIST_STALE_MS,
    retry: false,
    // Keep mutation invalidation immediate; coalesce rapid focus-only checks.
    refetchOnWindowFocus: (query: {
      state: { isInvalidated: boolean; dataUpdatedAt: number };
    }) =>
      query.state.isInvalidated ||
      Date.now() - query.state.dataUpdatedAt >= 30_000,
  };
}
