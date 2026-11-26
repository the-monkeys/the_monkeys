import useAuth from '@/hooks/auth/useAuth';
import { hasKnownViewer } from '@/lib/authQuerySession';
import { queryKeys } from '@/lib/queryKeys';
import {
  landingDiscussionQuery,
  landingGroupQuery,
  readLandingDiscussions,
  readLandingGroups,
} from '@/services/landing/communityApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useLandingCommunity() {
  const auth = useAuth();
  const session = auth.data;
  const viewer = session?.account_id || session?.username || undefined;
  const client = useQueryClient();
  const discussions = useQuery({
    ...landingDiscussionQuery,
    enabled: hasKnownViewer(auth),
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
    enabled: hasKnownViewer(auth),
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
