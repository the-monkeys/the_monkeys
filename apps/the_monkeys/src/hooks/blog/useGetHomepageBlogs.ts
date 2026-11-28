import { useCallback, useSyncExternalStore } from 'react';

import {
  HOMEPAGE_POLICY_VERSION,
  hasHomepageAssessment,
} from '@/lib/homepageEligibility';
import {
  readLandingPolicy,
  useLandingPolicySource,
} from '@/lib/landingPolicyRead';
import {
  type HomepageBlogParams,
  homepageBlogQuery,
} from '@/services/blog/homepageApi';
import { isSensitive } from '@/services/moderation/moderationTypes';
import { hashKey, useQuery, useQueryClient } from '@tanstack/react-query';

const subscribe = () => () => {};
const browserSnapshot = () => false;
const serverSnapshot = () => true;

export default function useGetHomepageBlogs(
  params: HomepageBlogParams = {},
  { viewer, enabled = true }: { viewer?: string; enabled?: boolean } = {}
) {
  const client = useQueryClient();
  const options = homepageBlogQuery(params, viewer);
  const query = useQuery({
    ...options,
    enabled,
    queryFn: ({ signal }) =>
      readLandingPolicy(client, viewer, signal, () =>
        options.queryFn({ signal })
      ),
    structuralSharing: false,
    refetchOnWindowFocus: (query) =>
      query.state.data?.blogs.some(isSensitive)
        ? 'always'
        : options.refetchOnWindowFocus(query),
    // Public redacted HTML remains stable while the viewer's own catalog loads.
    // Authorised responses must never overwrite the anonymous hydration key.
    initialData: viewer
      ? () =>
          client.getQueryData<Awaited<ReturnType<typeof options.queryFn>>>(
            homepageBlogQuery(params).queryKey
          )
      : undefined,
    initialDataUpdatedAt: viewer ? 0 : undefined,
  });
  const { data, isLoading, isFetching, isError } = query;
  const policySource = useLandingPolicySource(
    client,
    viewer,
    options.queryKey,
    query,
    data?.blogs ?? [],
    enabled
  );
  const serverOrHydrating = useSyncExternalStore(
    subscribe,
    browserSnapshot,
    serverSnapshot
  );
  const queryHash = hashKey(options.queryKey);
  const invalidated = useSyncExternalStore(
    useCallback(
      (changed) =>
        client.getQueryCache().subscribe((event) => {
          if (event.query.queryHash === queryHash) changed();
        }),
      [client, queryHash]
    ),
    useCallback(
      () => client.getQueryCache().get(queryHash)?.state.isInvalidated === true,
      [client, queryHash]
    ),
    () => false
  );
  const validated =
    data?.homepage_policy_version === HOMEPAGE_POLICY_VERSION &&
    typeof data.has_more === 'boolean' &&
    Array.isArray(data.blogs) &&
    data.blogs.every(hasHomepageAssessment);
  // Routine focus revalidation keeps validated cards steady. Explicit write
  // invalidation still hides withdrawn/restricted entries until policy is checked.
  const checking =
    isLoading ||
    (!serverOrHydrating && (invalidated || (isFetching && !validated)));
  return {
    policySource,
    blogs: checking || isError ? undefined : data,
    isLoading: checking,
    isError,
  };
}
