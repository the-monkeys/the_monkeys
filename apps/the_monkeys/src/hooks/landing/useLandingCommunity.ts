import useAuth from '@/hooks/auth/useAuth';
import { hasKnownViewer } from '@/lib/authQuerySession';
import {
  readLandingPolicy,
  useLandingPolicySource,
} from '@/lib/landingPolicyRead';
import { queryKeys } from '@/lib/queryKeys';
import {
  landingDiscussionQuery,
  landingGroupQuery,
  readLandingDiscussions,
  readLandingGroups,
} from '@/services/landing/communityApi';
import { isSensitive } from '@/services/moderation/moderationTypes';
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
    queryFn: ({ signal }) =>
      readLandingPolicy(client, viewer, signal, () =>
        readLandingDiscussions(signal, !!viewer)
      ),
    structuralSharing: false,
    refetchOnWindowFocus: (query) =>
      query.state.data?.some(isSensitive) ? 'always' : true,
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
    queryFn: ({ signal }) =>
      readLandingPolicy(client, viewer, signal, () =>
        readLandingGroups(signal, !!viewer)
      ),
    structuralSharing: false,
    refetchOnWindowFocus: (query) =>
      query.state.data?.some(isSensitive) ? 'always' : true,
    initialData: () =>
      viewer
        ? client.getQueryData<Awaited<ReturnType<typeof readLandingGroups>>>(
            landingGroupQuery.queryKey
          )
        : undefined,
    initialDataUpdatedAt: viewer ? 0 : undefined,
  });
  const discussionSource = useLandingPolicySource(
    client,
    viewer,
    queryKeys.landing.discussions(viewer),
    discussions,
    discussions.data ?? [],
    hasKnownViewer(auth)
  );
  const groupSource = useLandingPolicySource(
    client,
    viewer,
    queryKeys.landing.groups(viewer),
    groups,
    groups.data ?? [],
    hasKnownViewer(auth)
  );
  return {
    discussions: { ...discussions, policySource: discussionSource },
    groups: { ...groups, policySource: groupSource },
  };
}
