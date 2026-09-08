'use client';

import { FormEvent, useState } from 'react';

import Link from 'next/link';

import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { useEventComments } from '@/hooks/events/useEventQueries';
import { useRefreshEvents } from '@/hooks/events/useRefreshEvents';
import { loginHref } from '@/lib/authRedirect';
import { parseEventTime } from '@/lib/eventTime';
import { getRelativeTime } from '@/lib/utils';
import { EventItem } from '@/services/events/eventTypes';
import {
  addComment,
  deleteComment,
  eventError,
} from '@/services/events/eventsApi';
import { IUser } from '@/services/models/user';
import { Button } from '@the-monkeys/ui/atoms/button';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

import Icon from '../icon';

export function EventComments({
  event,
  session,
}: {
  event: EventItem;
  session?: IUser | null;
}) {
  const { toast } = useToast();
  const refresh = useRefreshEvents(event.slug);
  const { data, isLoading } = useEventComments(event.slug);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const comments = data?.comments || [];

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      await addComment(event.slug, text.trim());
      setText('');
      refresh();
    } catch (err) {
      toast({ title: 'Could not post', description: eventError(err) });
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteComment(event.slug, id);
      refresh();
    } catch (err) {
      toast({ title: 'Could not delete', description: eventError(err) });
    }
  };

  return (
    <section className='space-y-4'>
      <h2 className='font-dm_sans font-semibold text-xl'>
        Comments {data?.total ? `(${data.total})` : ''}
      </h2>

      {session ? (
        <form onSubmit={onAdd} className='space-y-2'>
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Write a comment'
            maxLength={2000}
          />
          <Button
            type='submit'
            variant='brand'
            size='sm'
            disabled={busy || !text.trim()}
          >
            Post
          </Button>
        </form>
      ) : (
        <p className='font-inter text-sm text-gray-500'>
          <Link
            href={loginHref(`${EVENTS_ROUTE}/${event.slug}`)}
            className='text-brand-orange hover:underline'
          >
            Log in
          </Link>{' '}
          to comment.
        </p>
      )}

      {isLoading && <p className='text-sm text-gray-500'>Loading comments…</p>}

      <ul className='space-y-4'>
        {comments.map((c) => {
          const when = parseEventTime(c.created_at);
          const canDelete =
            session &&
            (session.account_id === c.account_id ||
              session.username === event.organizer_username ||
              event.co_host_usernames?.includes(session.username));

          return (
            <li
              key={c.id}
              className='border-b border-border-light/60 dark:border-border-dark/40 pb-3'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <Link
                    href={c.user_name ? `/${c.user_name}` : '#'}
                    className='font-inter text-sm font-medium hover:text-brand-orange'
                  >
                    @{c.user_name || 'user'}
                  </Link>
                  {when && (
                    <span className='ml-2 text-xs text-gray-500'>
                      {getRelativeTime(when.toISOString())}
                    </span>
                  )}
                  <p className='mt-1 font-inter text-sm whitespace-pre-wrap break-words'>
                    {c.comment_text}
                  </p>
                </div>
                {canDelete && (
                  <button
                    type='button'
                    onClick={() => onDelete(c.id)}
                    className='text-gray-400 hover:text-alert-red'
                    aria-label='Delete comment'
                  >
                    <Icon name='RiDeleteBin6' size={16} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
