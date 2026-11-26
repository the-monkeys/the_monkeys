import { useCallback, useSyncExternalStore } from 'react';

import {
  HOMEPAGE_POLICY_VERSION,
  hasHomepageAssessment,
} from '@/lib/homepageEligibility';
import {
  type HomepageBlogParams,
  homepageBlogQuery,
} from '@/services/blog/homepageApi';
import { hashKey, useQuery, useQueryClient } from '@tanstack/react-query';

const subscribe = () => () => {};
const browserSnapshot = () => false;
const serverSnapshot = () => true;

export default function useGetHomepageBlogs(params: HomepageBlogParams = {}) {
  const client = useQueryClient();
  const options = homepageBlogQuery(params);
  const { data, isLoading, isFetching, isError } = useQuery(options);
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
    blogs: checking || isError ? undefined : data,
    isLoading: checking,
    isError,
  };
}
