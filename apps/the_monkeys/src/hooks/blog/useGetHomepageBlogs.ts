import { useSyncExternalStore } from 'react';

import {
  type HomepageBlogParams,
  homepageBlogQuery,
} from '@/services/blog/homepageApi';
import { useQuery } from '@tanstack/react-query';

const subscribe = () => () => {};
const browserSnapshot = () => false;
const serverSnapshot = () => true;

export default function useGetHomepageBlogs(params: HomepageBlogParams = {}) {
  const { data, isLoading, isFetching, isError } = useQuery(
    homepageBlogQuery(params)
  );
  // React shares the server snapshot with the first hydration render. Once in
  // the browser, real revalidation must hide cached eligibility immediately.
  const serverOrHydrating = useSyncExternalStore(
    subscribe,
    browserSnapshot,
    serverSnapshot
  );
  const checking = isLoading || (isFetching && !serverOrHydrating);
  return {
    blogs: checking || isError ? undefined : data,
    isLoading: checking,
    isError,
  };
}
