'use client';

import { useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { useRefreshEvents } from '@/hooks/events/useRefreshEvents';
import { EventItem } from '@/services/events/eventTypes';
import {
  downloadCalendar,
  eventError,
  getShareMeta,
  reportEvent,
} from '@/services/events/eventsApi';
import { IUser } from '@/services/models/user';
import { Button } from '@the-monkeys/ui/atoms/button';
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
  const refresh = useRefreshEvents(event.slug);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState('');

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
    // Share the current host's URL, not the backend canonical og_url.
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
              Edit
            </Link>
          </Button>
          <Button asChild variant='brand' size='sm'>
            <Link href={`${EVENTS_ROUTE}/${event.slug}/manage`}>Manage</Link>
          </Button>
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
      {reportOpen && (
        <div className='w-full flex gap-2'>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='Why are you reporting this?'
            className='h-9 flex-1 rounded-md border border-border-light dark:border-border-dark px-3 text-sm bg-transparent'
          />
          <Button size='sm' variant='destructive' onClick={onReport}>
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
