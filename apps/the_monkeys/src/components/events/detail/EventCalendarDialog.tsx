'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import {
  CalendarScope,
  buildCalendarProviderUrl,
  getCalendarWindow,
} from '@/lib/eventCalendar';
import { EventItem } from '@/services/events/eventTypes';
import { downloadCalendar, eventError } from '@/services/events/eventsApi';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

const providers = [
  { id: 'google', name: 'Google Calendar', mark: 'G' },
  { id: 'outlook', name: 'Outlook', mark: 'O' },
  { id: 'apple', name: 'Apple Calendar', mark: 'A' },
] as const;

export function EventCalendarDialog({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [scope, setScope] = useState<CalendarScope>('this');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState('');
  const isSeries = !!event.series_id;
  const validDates = getCalendarWindow(event) !== null;
  const google = origin
    ? buildCalendarProviderUrl(event, 'google', origin)
    : null;
  const outlook = origin
    ? buildCalendarProviderUrl(event, 'outlook', origin)
    : null;

  const exportFile = async (provider: string) => {
    setError('');
    setDownloaded('');
    setBusy(provider);
    try {
      await downloadCalendar(event.slug, scope);
      setDownloaded(
        `Calendar file downloaded for ${provider}. Import it into your calendar to finish.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : eventError(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) {
          setOrigin(window.location.origin);
          setScope('this');
          setError('');
          setDownloaded('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='min-h-11'>
          <Icon name='RiDownload2' size={16} className='mr-1.5' />
          Add to calendar
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-border-light p-5 dark:border-border-dark sm:p-6 [&>button]:right-2 [&>button]:top-2 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center'>
        <DialogHeader className='pr-8 text-left'>
          <DialogTitle className='font-newsreader text-2xl font-semibold'>
            Add to calendar
          </DialogTitle>
          <DialogDescription className='font-inter text-sm text-gray-500 dark:text-gray-400'>
            Save the event in your preferred calendar. No account connection
            needed.
          </DialogDescription>
        </DialogHeader>
        <p className='break-words font-dm_sans font-medium'>{event.title}</p>
        {isSeries && (
          <fieldset className='space-y-2' disabled={busy !== null}>
            <legend className='mb-2 font-inter text-xs font-semibold uppercase tracking-wider text-gray-500'>
              Dates to add
            </legend>
            {(
              [
                [
                  'this',
                  'This occurrence',
                  'Only the date on this event page.',
                ],
                [
                  'series',
                  'Available series dates',
                  'Saved dates from this occurrence onward.',
                ],
              ] as const
            ).map(([value, title, hint]) => (
              <label
                key={value}
                className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border p-3 ${scope === value ? 'border-brand-orange bg-brand-orange/5' : 'border-border-light dark:border-border-dark'}`}
              >
                <input
                  type='radio'
                  name='calendar-scope'
                  value={value}
                  checked={scope === value}
                  onChange={() => {
                    setScope(value);
                    setError('');
                    setDownloaded('');
                  }}
                  className='mt-1 accent-brand-orange'
                />
                <span className='min-w-0 text-sm'>
                  <span className='block font-medium'>{title}</span>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {hint}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        )}
        {event.status === 'cancelled' && scope === 'this' && (
          <p className='rounded-xl bg-foreground-light/30 p-3 text-sm dark:bg-foreground-dark/30'>
            This occurrence was cancelled. Download its cancellation-aware
            calendar file to review the change. Import handling varies by
            calendar.
          </p>
        )}
        {!validDates && origin && (
          <p role='alert' className='text-sm text-red-600'>
            Calendar details are unavailable for this event. Please ask the host
            to check its start and end times.
          </p>
        )}
        <div className='space-y-2'>
          {providers.map((provider) => {
            const href =
              scope === 'this'
                ? provider.id === 'google'
                  ? google
                  : provider.id === 'outlook'
                    ? outlook
                    : null
                : null;
            const content = (
              <>
                <span
                  aria-hidden='true'
                  className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground-light/50 font-semibold dark:bg-foreground-dark/50'
                >
                  {provider.mark}
                </span>
                <span className='min-w-0 flex-1 text-left'>
                  <span className='block text-sm font-semibold'>
                    {provider.name}
                  </span>
                  <span className='block text-xs font-normal text-gray-500 dark:text-gray-400'>
                    {href
                      ? 'Opens an event for you to save'
                      : 'Download a calendar file (.ics)'}
                  </span>
                </span>
                <Icon name={href ? 'RiArrowRight' : 'RiDownload2'} size={16} />
              </>
            );
            return href ? (
              <a
                key={provider.id}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                referrerPolicy='no-referrer'
                className='flex min-h-16 items-center gap-3 rounded-xl border border-border-light p-3 hover:border-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:border-border-dark'
              >
                {content}
              </a>
            ) : (
              <button
                key={provider.id}
                type='button'
                disabled={!!busy || !validDates}
                onClick={() => exportFile(provider.name)}
                className='flex min-h-16 w-full items-center gap-3 rounded-xl border border-border-light p-3 hover:border-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange disabled:cursor-wait disabled:opacity-60 dark:border-border-dark'
              >
                {content}
              </button>
            );
          })}
        </div>
        {scope === 'series' && (
          <div className='space-y-2 rounded-xl bg-foreground-light/30 p-3 font-inter text-xs leading-relaxed dark:bg-foreground-dark/30'>
            <p>
              Includes available, visible dates and their saved times and
              locations. Future dates not yet published are not included.
            </p>
            <p>
              Google Calendar imports calendar files on a computer: Settings,
              Import &amp; export. Outlook: Add calendar, Upload from file.
              Apple Calendar: open the downloaded file.
            </p>
          </div>
        )}
        <div aria-live='polite' className='font-inter text-sm'>
          {busy && <p role='status'>Preparing calendar file...</p>}
          {downloaded && (
            <p role='status' className='text-green-700 dark:text-green-400'>
              {downloaded}
            </p>
          )}
          {error && (
            <p role='alert' className='text-red-600 dark:text-red-400'>
              {error}
            </p>
          )}
        </div>
        <p className='font-inter text-xs leading-relaxed text-gray-500 dark:text-gray-400'>
          Calendar copies do not update automatically. Check Monkeys for
          changes. Adding to a calendar does not RSVP or reserve a seat.
        </p>
      </DialogContent>
    </Dialog>
  );
}
