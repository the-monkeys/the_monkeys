'use client';

import { FormEvent, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { queryKeys } from '@/lib/queryKeys';
import { EventItem } from '@/services/events/eventTypes';
import {
  addCoHost,
  eventError,
  removeCoHost,
} from '@/services/events/eventsApi';
import { IUser } from '@/services/models/user';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';
import { Input } from '@the-monkeys/ui/atoms/input';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export function EventCohosts({
  event,
  session,
  onChange,
}: {
  event: EventItem;
  session?: IUser | null;
  onChange: () => void | Promise<void>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const locked = useRef(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState<string | null>(null);
  // Retain the confirmation identity while Radix finishes its exit animation.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const leaving = target !== null && target === session?.username;

  const release = () => {
    locked.current = false;
    setBusy(false);
  };
  const success = (title: string) => {
    setMessage(title);
    toast({ title });
  };
  const refreshRoster = async () => {
    try {
      await onChange();
    } catch {
      // The mutation succeeded; a refresh failure must not invite a duplicate.
      setError('Co-hosts changed. Refresh the page to see the latest list.');
    }
  };

  const onAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (locked.current || dialogOpen) return;
    // React clears currentTarget after dispatch, so retain the form before await.
    const form = e.currentTarget;
    const username = String(new FormData(form).get('username') || '').trim();
    if (!username) return;
    locked.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await addCoHost(event.slug, username);
      form.reset();
      success('Co-host added');
      await refreshRoster();
    } catch (err) {
      setError(`Could not add co-host. ${eventError(err)}`);
    } finally {
      release();
    }
  };

  const onRemove = async () => {
    if (
      locked.current ||
      !dialogOpen ||
      !target ||
      target === event.organizer_username
    )
      return;
    locked.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await removeCoHost(event.slug, target);
    } catch (err) {
      setError(
        `Could not ${leaving ? 'leave' : 'remove co-host'}. ${eventError(err)}`
      );
      release();
      return;
    }
    setDialogOpen(false);
    success(leaving ? 'You left as a co-host' : 'Co-host removed');
    if (leaving) {
      // Cancel first so late host responses cannot restore revoked access.
      // Remove fresh data without refetching queries we can no longer read.
      const hostKeys = [
        queryKeys.events.detail(event.slug),
        queryKeys.events.attendees(event.slug),
        queryKeys.events.coupons(event.slug),
      ];
      await Promise.all(
        hostKeys.map((queryKey) => queryClient.cancelQueries({ queryKey }))
      );
      hostKeys.forEach((queryKey) => queryClient.removeQueries({ queryKey }));
      // Keep controls locked until navigation unmounts this component.
      router.replace(EVENTS_ROUTE);
      return;
    }
    await refreshRoster();
    release();
  };

  return (
    <section aria-label='Co-hosts' className='min-w-0 space-y-3'>
      <h2 className='font-dm_sans text-xl font-semibold'>Co-hosts</h2>
      <form
        onSubmit={onAdd}
        className='flex flex-col gap-2 sm:flex-row'
        aria-busy={busy}
      >
        <Input
          name='username'
          placeholder='username'
          aria-label='Co-host username'
          className='min-h-11 min-w-0'
          disabled={busy}
          required
        />
        <Button type='submit' className='min-h-11 shrink-0' disabled={busy}>
          {busy && !dialogOpen ? 'Please wait…' : 'Add co-host'}
        </Button>
      </form>
      {message && (
        <p role='status' className='break-words text-sm'>
          {message}
        </p>
      )}
      {error && !dialogOpen && (
        <p role='alert' className='break-words text-sm'>
          {error}
        </p>
      )}
      <ul className='space-y-2'>
        {(event.co_host_usernames || []).map((name) => (
          <li
            key={name}
            className='flex min-w-0 flex-wrap items-center justify-between gap-2 text-sm'
          >
            <span className='min-w-0 flex-1 break-words [overflow-wrap:anywhere]'>
              @{name}
            </span>
            {name === event.organizer_username ? (
              <span className='text-sm text-gray-500'>Organizer</span>
            ) : (
              <Button
                type='button'
                variant='ghost'
                className='min-h-11 shrink-0'
                disabled={busy}
                onClick={(e) => {
                  if (locked.current) return;
                  trigger.current = e.currentTarget;
                  setError('');
                  setMessage('');
                  setTarget(name);
                  setDialogOpen(true);
                }}
              >
                {name === session?.username ? 'Leave co-host' : 'Remove'}
              </Button>
            )}
          </li>
        ))}
      </ul>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open && !locked.current) {
            setDialogOpen(false);
            setError('');
          }
        }}
      >
        <DialogContent
          className='max-h-[90dvh] overflow-y-auto [&>button]:top-2 [&>button]:min-h-11 [&>button]:min-w-11'
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            trigger.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {leaving ? 'Leave as a co-host?' : 'Remove co-host?'}
            </DialogTitle>
            <DialogDescription className='break-words pr-8 [overflow-wrap:anywhere]'>
              {leaving
                ? 'You will lose access to manage this event. The organizer can add you again.'
                : `Remove @${target} as a co-host? They will lose access to manage this event.`}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p role='alert' className='break-words text-sm'>
              {error}
            </p>
          )}
          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              className='min-h-11'
              disabled={busy}
              onClick={() => {
                setDialogOpen(false);
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button
              type='button'
              variant='brand'
              className='min-h-11'
              disabled={busy}
              onClick={onRemove}
            >
              {leaving ? 'Leave co-host' : 'Remove co-host'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
