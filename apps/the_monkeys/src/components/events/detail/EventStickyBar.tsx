'use client';

import { useEffect, useState } from 'react';

import Icon from '@/components/icon';
import { eventPriceLabel, formatEventWhen, spotsLeft } from '@/lib/eventTime';
import { cn } from '@/lib/utils';
import { EventItem, RsvpStatus } from '@/services/events/eventTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

type Props = {
  event: EventItem;
  viewerStatus?: RsvpStatus;
  onShare?: () => void;
  onAttend?: () => void;
};

/**
 * Fixed registration bar pinned to the bottom of the viewport (desktop + mobile).
 * Presentational only — the "Attend" action scrolls to / opens the full RSVP
 * panel so we never duplicate the ticket / coupon / payment logic.
 */
export function EventStickyBar({
  event,
  viewerStatus,
  onShare,
  onAttend,
}: Props) {
  const [visible, setVisible] = useState(false);
  const left = spotsLeft(event);
  const closed = event.status === 'cancelled' || event.status === 'completed';
  const going =
    viewerStatus === 'confirmed' ||
    viewerStatus === 'waitlisted' ||
    viewerStatus === 'pending_payment';

  // Reveal the bar only after the user scrolls past the hero, using
  // IntersectionObserver when available and a scroll fallback otherwise.
  useEffect(() => {
    const sentinel = visibleRsvpAnchor();
    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '0px 0px -80% 0px' }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const handleAttend = () => {
    if (onAttend) return onAttend();
    visibleRsvpAnchor()?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border-light dark:border-border-dark/60',
        'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur',
        '[-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)]',
        'transition-transform duration-300 ease-out',
        'pb-[env(safe-area-inset-bottom)]',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
      role='region'
      aria-label='Event registration'
    >
      <div className='mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6'>
        <div className='min-w-0 flex-1'>
          <p className='truncate font-dm_sans font-semibold text-sm sm:text-base'>
            {event.title}
          </p>
          <p className='truncate font-inter text-xs text-gray-500 dark:text-gray-400'>
            {formatEventWhen(event.start_time, undefined, event.timezone)}
          </p>
        </div>

        <div className='hidden shrink-0 text-right sm:block'>
          <p className='font-dm_sans font-semibold text-sm'>
            {eventPriceLabel(event)}
          </p>
          {left !== null && left <= 20 && (
            <p className='font-inter text-xs text-brand-orange'>
              {left} spot{left === 1 ? '' : 's'} left
            </p>
          )}
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <button
            type='button'
            onClick={onShare}
            aria-label='Share event'
            className='inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-500 hover:text-brand-orange'
          >
            <Icon name='RiShareForward' size={20} />
          </button>
          <Button
            variant={going ? 'outline' : 'brand'}
            className='h-11 min-w-[112px] px-5'
            disabled={closed}
            onClick={handleAttend}
          >
            {closed
              ? eventStatusText(event.status)
              : going
                ? 'You’re in'
                : 'Attend'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function eventStatusText(status: EventItem['status']): string {
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'completed') return 'Ended';
  return 'Closed';
}
/**
 * Both layouts (mobile inline + desktop rail) render an RSVP anchor, but only
 * one is visible at a time. Pick the on-screen one (offsetParent is null when
 * an element or an ancestor is display:none).
 */
function visibleRsvpAnchor(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  const anchors = Array.from(
    document.querySelectorAll<HTMLElement>('[data-rsvp-anchor]')
  );
  return anchors.find((el) => el.offsetParent !== null) ?? anchors[0] ?? null;
}
