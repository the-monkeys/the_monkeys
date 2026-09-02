'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { useRefreshEvents } from '@/hooks/events/useRefreshEvents';
import {
  fromLocalInput,
  isEventEnded,
  parseEventTime,
  toLocalInput,
} from '@/lib/eventTime';
import { EventItem } from '@/services/events/eventTypes';
import {
  cloneEvent,
  downloadCalendar,
  eventError,
  getShareMeta,
  reportEvent,
} from '@/services/events/eventsApi';
import { IUser } from '@/services/models/user';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export function EventActions({
  event,
  session,
  canManage,
}: {
  event: EventItem;
  session?: IUser | null;
  canManage?: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const refresh = useRefreshEvents(event.slug);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [cloneOpen, setCloneOpen] = useState(false);
  const [cloneBusy, setCloneBusy] = useState(false);
  const ended = isEventEnded(event);
  const showClone = canManage && ended && !event.series_id;

  const cloneDefaults = useMemo(() => {
    const start = parseEventTime(event.start_time);
    const end = parseEventTime(event.end_time);
    const duration =
      start && end
        ? Math.max(end.getTime() - start.getTime(), 60 * 60 * 1000)
        : 60 * 60 * 1000;
    const next = new Date(Date.now() + 24 * 60 * 60 * 1000);
    next.setMinutes(0, 0, 0);
    return {
      start: toLocalInput(next.toISOString()),
      end: toLocalInput(new Date(next.getTime() + duration).toISOString()),
    };
  }, [event.start_time, event.end_time]);

  const [cloneStart, setCloneStart] = useState(cloneDefaults.start);
  const [cloneEnd, setCloneEnd] = useState(cloneDefaults.end);

  const copyLink = async () => {
    const url = `${window.location.origin}${EVENTS_ROUTE}/${event.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied' });
    } catch {
      toast({ title: 'Could not copy link' });
    }
  };

  const share = async () => {
    const url = `${window.location.origin}${EVENTS_ROUTE}/${event.slug}`;
    try {
      const meta = await getShareMeta(event.slug);
      if (navigator.share) {
        await navigator.share({
          title: meta.og_title || event.title,
          text: meta.og_description,
          url,
        });
        return;
      }
      await copyLink();
    } catch {
      copyLink();
    }
  };

  const onReport = async () => {
    if (!reason.trim()) return;
    try {
      await reportEvent(event.slug, reason.trim());
      toast({ title: 'Report sent' });
      setReportOpen(false);
      setReason('');
      refresh();
    } catch (err) {
      toast({ title: 'Could not report', description: eventError(err) });
    }
  };

  const onClone = async () => {
    const start = fromLocalInput(cloneStart);
    const end = fromLocalInput(cloneEnd);
    if (!start || !end) return;
    setCloneBusy(true);
    try {
      const res = await cloneEvent(event.slug, {
        start_time: start,
        end_time: end,
      });
      const slug = res.event?.slug;
      toast({ title: 'Draft created' });
      router.push(slug ? `${EVENTS_ROUTE}/${slug}/edit` : EVENTS_ROUTE);
    } catch (err) {
      toast({
        title: 'Could not schedule again',
        description: eventError(err),
      });
    } finally {
      setCloneBusy(false);
    }
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Button variant='outline' size='sm' onClick={share}>
        <Icon name='RiShare' size={16} className='mr-1' />
        Share
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          downloadCalendar(event.slug).catch((err) =>
            toast({
              title: 'Could not download calendar',
              description: eventError(err),
            })
          )
        }
      >
        <Icon name='RiDownload2' size={16} className='mr-1' />
        Calendar
      </Button>
      {canManage && (
        <>
          <Button asChild variant='outline' size='sm'>
            <Link href={`${EVENTS_ROUTE}/${event.slug}/edit`}>
              <Icon name='RiPencil' size={16} className='mr-1' />
              {ended ? 'Edit writeup' : 'Edit'}
            </Link>
          </Button>
          <Button asChild variant='brand' size='sm'>
            <Link href={`${EVENTS_ROUTE}/${event.slug}/manage`}>Manage</Link>
          </Button>
          {showClone && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCloneOpen((v) => !v)}
            >
              Schedule again
            </Button>
          )}
        </>
      )}
      {session && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setReportOpen((v) => !v)}
        >
          Report
        </Button>
      )}
      {cloneOpen && showClone && (
        <div className='flex w-full flex-col gap-2 rounded-lg border border-border-light p-3 dark:border-border-dark/60 sm:flex-row sm:items-end'>
          <label className='min-w-0 flex-1 font-inter text-xs text-gray-500'>
            Starts
            <Input
              type='datetime-local'
              value={cloneStart}
              onChange={(e) => setCloneStart(e.target.value)}
              className='mt-1'
            />
          </label>
          <label className='min-w-0 flex-1 font-inter text-xs text-gray-500'>
            Ends
            <Input
              type='datetime-local'
              value={cloneEnd}
              onChange={(e) => setCloneEnd(e.target.value)}
              className='mt-1'
            />
          </label>
          <Button
            size='sm'
            variant='brand'
            disabled={cloneBusy}
            onClick={onClone}
          >
            {cloneBusy ? 'Creating…' : 'Create draft'}
          </Button>
        </div>
      )}
      {reportOpen && (
        <div className='flex w-full gap-2'>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='Why are you reporting this?'
            className='h-9 flex-1 rounded-md border border-border-light bg-transparent px-3 text-sm dark:border-border-dark'
          />
          <Button size='sm' variant='destructive' onClick={onReport}>
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
