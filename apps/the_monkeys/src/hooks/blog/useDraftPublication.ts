import { useEffect, useState } from 'react';

import { isActiveGroupMember } from '@/lib/groupPerms';
import {
  BlogPublicationScope,
  BlogPublicationSelection,
  DraftPublicationScope,
  draftPublicationScope,
  draftScopeForSelection,
  effectiveBlogAudience,
} from '@/services/blog/blogPublication';
import { getGroup } from '@/services/groups/groupsApi';
import { useQuery } from '@tanstack/react-query';

export function useDraftPublication({
  draft,
  isNew,
  preferredGroupSlug,
  username,
}: {
  draft?: BlogPublicationScope;
  isNew: boolean;
  preferredGroupSlug: string;
  username?: string;
}) {
  const [scope, setScope] = useState<DraftPublicationScope | null>(() =>
    isNew ? draftPublicationScope(undefined, preferredGroupSlug) : null
  );

  useEffect(() => {
    if (draft)
      setScope(
        (current) => current ?? draftPublicationScope(draft, preferredGroupSlug)
      );
  }, [draft, preferredGroupSlug]);

  const slug = scope?.group_slug ?? '';
  const groupQuery = useQuery({
    // A public/anonymous detail cache must never stand in for viewer standing.
    queryKey: ['draft-publication-group', username, slug],
    queryFn: () => getGroup(slug),
    enabled: !!username && !!slug,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
  const group = groupQuery.data?.group;
  const active =
    !!username && group?.slug === slug && isActiveGroupMember(group);
  const selection: BlogPublicationSelection | null = !scope
    ? null
    : !slug
      ? { group: null, audience: 'public' }
      : active
        ? {
            group: group!,
            audience: effectiveBlogAudience(group!, scope.audience),
          }
        : null;
  const pending =
    !scope ||
    (!!slug && (!username || groupQuery.isPending || groupQuery.isFetching));
  const error =
    slug && !pending && (!active || groupQuery.isError)
      ? 'Could not verify active membership for this group. Try again or remove the group.'
      : null;

  return {
    // Retain the raw intent even when a lookup fails or membership has changed.
    draftScope: scope && selection ? draftScopeForSelection(selection) : scope,
    selection,
    groupSlug: slug,
    canPublish: !!selection && !pending && !error,
    pending,
    error,
    change: (next: BlogPublicationSelection) =>
      setScope(draftScopeForSelection(next)),
    retry: () => {
      void groupQuery.refetch();
    },
  };
}
