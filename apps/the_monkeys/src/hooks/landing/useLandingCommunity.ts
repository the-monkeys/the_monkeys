import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import {
  landingDiscussionQuery,
  landingGroupQuery,
  readLandingDiscussions,
  readLandingGroups,
} from '@/services/landing/communityApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useLandingCommunity() {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || undefined;
  const client = useQueryClient();
  const discussions = useQuery({
    ...landingDiscussionQuery,
    queryKey: queryKeys.landing.discussions(viewer),
    queryFn: ({ signal }) => readLandingDiscussions(signal, !!viewer),
    // Public hydration is safe to seed; personalised results never enter that key.
    initialData: () =>
      viewer
        ? client.getQueryData<
            Awaited<ReturnType<typeof readLandingDiscussions>>
          >(landingDiscussionQuery.queryKey)
        : undefined,
    initialDataUpdatedAt: viewer ? 0 : undefined,
  });
  const groups = useQuery({
    ...landingGroupQuery,
    queryKey: queryKeys.landing.groups(viewer),
    queryFn: ({ signal }) => readLandingGroups(signal, !!viewer),
    initialData: () =>
      viewer
        ? client.getQueryData<Awaited<ReturnType<typeof readLandingGroups>>>(
            landingGroupQuery.queryKey
          )
        : undefined,
    initialDataUpdatedAt: viewer ? 0 : undefined,
  });
  return { discussions, groups };
}
