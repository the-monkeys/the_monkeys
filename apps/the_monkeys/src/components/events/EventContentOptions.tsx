'use client';

import { useContext } from 'react';

import { ContentOptions } from '@/components/moderation/ContentOptions';
import useAuth from '@/hooks/auth/useAuth';
import type { EventItem } from '@/services/events/eventTypes';
import { QueryClientContext } from '@tanstack/react-query';

type Props = { event: EventItem; className?: string };
export function EventContentOptions(props: Props) {
  const client = useContext(QueryClientContext);
  return client ? (
    <ViewerOptions {...props} />
  ) : (
    <ContentOptions
      target={{ kind: 'event', id: props.event.slug }}
      className={props.className}
    />
  );
}
function ViewerOptions({ event, className }: Props) {
  const { data: session } = useAuth();
  const owner =
    !!session &&
    ((!!session.account_id &&
      session.account_id === event.organizer_account_id) ||
      (!!session.username && session.username === event.organizer_username));
  return (
    <ContentOptions
      key={`${session?.account_id || session?.username || 'anonymous'}:${event.slug}`}
      target={{ kind: 'event', id: event.slug }}
      canLabel={owner}
      initialMarked={event.is_nsfw || event.content_rating?.is_nsfw}
      className={className}
    />
  );
}
