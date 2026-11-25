'use client';

import { useContext } from 'react';

import { ContentOptions } from '@/components/moderation/ContentOptions';
import useAuth from '@/hooks/auth/useAuth';
import type { GroupItem } from '@/services/groups/groupsTypes';
import { QueryClientContext } from '@tanstack/react-query';

type Props = { group: GroupItem; className?: string };
export function GroupContentOptions(props: Props) {
  const client = useContext(QueryClientContext);
  return client ? (
    <ViewerOptions {...props} />
  ) : (
    <ContentOptions
      target={{ kind: 'group', id: props.group.slug }}
      className={props.className}
    />
  );
}
function ViewerOptions({ group, className }: Props) {
  const { data: session } = useAuth();
  const owner =
    !!session &&
    ((!!session.account_id &&
      session.account_id === group.organizer_account_id) ||
      (!!session.username && session.username === group.organizer_username));
  return (
    <ContentOptions
      key={`${session?.account_id || session?.username || 'anonymous'}:${group.slug}`}
      target={{ kind: 'group', id: group.slug }}
      canLabel={owner}
      initialMarked={group.is_nsfw || group.content_rating?.is_nsfw}
      className={className}
    />
  );
}
