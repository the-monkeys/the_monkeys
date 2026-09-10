'use client';

import { useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { useRefreshEvents } from '@/hooks/events/useRefreshEvents';
import { loginHref } from '@/lib/authRedirect';
import { formatPrice, isEventEnded, isRsvpClosed } from '@/lib/eventTime';
import { openRazorpay } from '@/lib/razorpayCheckout';
import { hasOpenRsvp, rsvpStatusCopy } from '@/lib/rsvpStatus';
import { socialProofUrlError } from '@/lib/socialProofUrl';
import {
  EventItem,
  RsvpStatus,
  TicketTier,
} from '@/services/events/eventTypes';
import {
  cancelRsvp,
  eventError,
  rsvpEvent,
  validateCoupon,
} from '@/services/events/eventsApi';
import { IUser } from '@/services/models/user';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

type Props = {
  event: EventItem;
  viewerStatus?: RsvpStatus;
  session?: IUser | null;
};

function seatsLeft(tier: TicketTier): number | null {
  if (!tier.capacity) return null;
  return Math.max(0, tier.capacity - (tier.booked || 0));
}

export function RsvpPanel({ event, viewerStatus, session }: Props) {
  const { toast } = useToast();
  const refresh = useRefreshEvents(event.slug);
  const tiers = event.ticket_tiers || [];
  const [tierId, setTierId] = useState<number | undefined>(tiers[0]?.id);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [allUpcoming, setAllUpcoming] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [confirmLeave, setConfirmLeave] = useState(false);

  const selected = tiers.find((t) => t.id === tierId) || tiers[0];
  const closed = isEventEnded(event);
  const rsvpClosed = isRsvpClosed(event);
  const going = hasOpenRsvp(viewerStatus);
  const needsReview = !!event.requires_host_review;
  const waiting = viewerStatus === 'pending_host_review';
  const needsPay = viewerStatus === 'pending_payment';
  const selectedFree = !!selected && !(selected.price > 0);
  const canRsvpSeries =
    !!event.series_id && selectedFree && !going && !needsReview;

  const onRsvp = async () => {
    if (!selected) return;
    if (needsReview && !waiting && !needsPay) {
      const urlErr = socialProofUrlError(profileUrl);
      if (urlErr) {
        toast({ title: 'Profile link needed', description: urlErr });
        return;
      }
    }
    setBusy(true);
    try {
      const res = await rsvpEvent(event.slug, {
        ticket_tier_id: selected.id,
        coupon_code: code.trim() || undefined,
        scope: canRsvpSeries && allUpcoming ? 'series' : undefined,
        social_proof_url:
          needsReview && !needsPay ? profileUrl.trim() : undefined,
      });

      if (
        res.status === 'pending_payment' &&
        res.payment_order_id &&
        res.razorpay_key_id
      ) {
        const paid = await openRazorpay({
          key: res.razorpay_key_id,
          orderId: res.payment_order_id,
          amount: res.amount_due || selected.price,
          currency: res.currency || selected.currency || 'INR',
          name: event.title,
          email: session?.email,
          prefillName: session?.first_name,
        });
        if (!paid) {
          toast({
            title: 'Payment not finished',
            description: 'You can try again any time.',
          });
        }
      } else {
        toast({
          title: res.message || 'Saved',
          description: rsvpStatusCopy(res.status),
        });
      }
      refresh();
    } catch (err) {
      toast({ title: 'Could not RSVP', description: eventError(err) });
    } finally {
      setBusy(false);
    }
  };

  const onCancel = async () => {
    setBusy(true);
    try {
      await cancelRsvp(event.slug);
      setConfirmLeave(false);
      toast({
        title: waiting ? 'Application withdrawn' : 'RSVP cancelled',
        description: waiting
          ? 'The host will not see this request.'
          : 'Your spot was released.',
      });
      refresh();
    } catch (err) {
      toast({ title: 'Could not cancel', description: eventError(err) });
    } finally {
      setBusy(false);
    }
  };

  const onCheckCoupon = async () => {
    if (!code.trim() || !selected) return;
    try {
      const res = await validateCoupon(event.slug, code.trim(), selected.id);
      setDiscount(res.discounted_amount ?? null);
      toast({ title: 'Coupon is valid' });
    } catch (err) {
      setDiscount(null);
      toast({ title: 'Coupon not valid', description: eventError(err) });
    }
  };

  if (closed) {
    return (
      <aside className='rounded-lg border border-border-light dark:border-border-dark/60 p-5'>
        <p className='font-inter text-sm text-gray-500'>
          {event.status === 'cancelled'
            ? 'This event is cancelled.'
            : 'This meetup has ended.'}
        </p>
      </aside>
    );
  }

  if (rsvpClosed && !going) {
    return (
      <aside className='rounded-lg border border-border-light dark:border-border-dark/60 p-5'>
        <p className='font-inter text-sm text-gray-500'>
          RSVP for this meetup has closed.
        </p>
      </aside>
    );
  }

  if (waiting) {
    return (
      <aside className='min-w-0 overflow-hidden rounded-lg border border-border-light dark:border-border-dark/60 p-4 sm:p-5 space-y-4'>
        <h2 className='font-dm_sans font-semibold text-lg'>Tickets</h2>
        <PendingApplication
          tier={selected}
          busy={busy}
          confirmLeave={confirmLeave}
          onAskLeave={() => setConfirmLeave(true)}
          onKeep={() => setConfirmLeave(false)}
          onWithdraw={onCancel}
        />
      </aside>
    );
  }

  if (viewerStatus === 'confirmed') {
    return (
      <aside className='min-w-0 overflow-hidden rounded-lg border border-border-light dark:border-border-dark/60 p-4 sm:p-5 space-y-4'>
        <h2 className='font-dm_sans font-semibold text-lg'>Tickets</h2>
        <ConfirmedSpot
          event={event}
          tier={selected}
          busy={busy}
          confirmLeave={confirmLeave}
          onAskLeave={() => setConfirmLeave(true)}
          onKeep={() => setConfirmLeave(false)}
          onCancel={onCancel}
        />
      </aside>
    );
  }

  return (
    <aside className='min-w-0 overflow-hidden rounded-lg border border-border-light dark:border-border-dark/60 p-4 sm:p-5 space-y-4'>
      <h2 className='font-dm_sans font-semibold text-lg'>Tickets</h2>

      {going && (
        <p className='font-inter text-sm text-brand-orange'>
          {rsvpStatusCopy(viewerStatus) ||
            `Your status: ${viewerStatus?.replace(/_/g, ' ')}`}
        </p>
      )}

      {tiers.length === 0 ? (
        <p className='font-inter text-sm text-gray-500'>
          Tickets will show when this event is published.
        </p>
      ) : (
        <ul className='space-y-2'>
          {tiers.map((tier) => {
            const left = seatsLeft(tier);
            return (
              <li key={tier.id}>
                <label className='flex cursor-pointer items-start gap-3 rounded-md border border-border-light/70 dark:border-border-dark/50 p-3 has-[:checked]:border-brand-orange'>
                  <input
                    type='radio'
                    name='tier'
                    className='mt-1'
                    checked={selected?.id === tier.id}
                    onChange={() => {
                      setTierId(tier.id);
                      setDiscount(null);
                    }}
                  />
                  <span className='min-w-0 flex-1'>
                    <span className='flex items-center justify-between gap-2'>
                      <span className='font-dm_sans font-medium'>
                        {tier.name}
                      </span>
                      <span className='font-inter text-sm'>
                        {formatPrice(tier.price, tier.currency)}
                      </span>
                    </span>
                    {tier.description && (
                      <span className='mt-0.5 block text-xs text-gray-500'>
                        {tier.description}
                      </span>
                    )}
                    {left !== null && (
                      <span className='mt-0.5 block text-xs text-gray-500'>
                        {left} seats left
                      </span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {selected && selected.price > 0 && (
        <div className='flex min-w-0 flex-col gap-2'>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Coupon code'
          />
          <Button
            type='button'
            variant='outline'
            className='min-h-11 sm:w-auto'
            onClick={onCheckCoupon}
          >
            Apply
          </Button>
        </div>
      )}
      {discount !== null && selected && (
        <p className='font-inter text-sm'>
          Pay {formatPrice(discount, selected.currency)}
        </p>
      )}

      {canRsvpSeries && (
        <label className='flex items-start gap-2 font-inter text-sm'>
          <input
            type='checkbox'
            className='mt-1'
            checked={allUpcoming}
            onChange={(e) => setAllUpcoming(e.target.checked)}
          />
          <span>RSVP all upcoming in this series</span>
        </label>
      )}
      {needsReview && !going && (
        <div className='space-y-1.5'>
          <p className='font-inter text-sm text-gray-500'>
            The host reviews guests. Share a public profile link (LinkedIn,
            Instagram, GitHub, or your site).
          </p>
          <Input
            type='url'
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder='https://'
            required
          />
        </div>
      )}

      {!!event.series_id && needsReview && !going && (
        <p className='font-inter text-sm text-gray-500'>
          Apply to each date separately when the host reviews guests.
        </p>
      )}
      {!!event.series_id &&
        selected &&
        selected.price > 0 &&
        !going &&
        !needsReview && (
          <p className='font-inter text-sm text-gray-500'>
            RSVP each date separately for paid meetups.
          </p>
        )}

      {!session ? (
        <Button asChild variant='brand' className='w-full min-h-11'>
          <Link href={loginHref(`${EVENTS_ROUTE}/${event.slug}`)}>
            Log in to RSVP
          </Link>
        </Button>
      ) : (
        <div className='space-y-2'>
          {needsPay && (
            <Button
              variant='brand'
              className='w-full min-h-11'
              disabled={busy || !selected}
              onClick={onRsvp}
            >
              {busy ? 'Please wait…' : 'Complete payment'}
            </Button>
          )}
          {going ? (
            <LeaveSpotControls
              busy={busy}
              confirmLeave={confirmLeave}
              askLabel='Cancel my RSVP'
              keepLabel='Keep my spot'
              confirmLabel='Yes, cancel'
              title='Cancel your RSVP?'
              body='Are you sure you do not want to attend? Your spot will be released. You can RSVP again later if seats remain.'
              onAsk={() => setConfirmLeave(true)}
              onKeep={() => setConfirmLeave(false)}
              onConfirm={onCancel}
            />
          ) : (
            <Button
              variant='brand'
              className='w-full min-h-11'
              disabled={busy || !selected}
              onClick={onRsvp}
            >
              {busy
                ? 'Please wait…'
                : needsReview
                  ? 'Apply to join'
                  : selected && selected.price > 0
                    ? 'Get ticket'
                    : allUpcoming && canRsvpSeries
                      ? 'RSVP all upcoming'
                      : 'RSVP'}
            </Button>
          )}
        </div>
      )}
    </aside>
  );
}

function TicketSummary({ tier, note }: { tier?: TicketTier; note: string }) {
  if (!tier) return null;
  return (
    <div className='flex items-start gap-3 rounded-lg border border-border-light dark:border-border-dark/50 p-3 sm:p-4'>
      <Icon
        name='RiCoupon3'
        size={20}
        className='mt-0.5 shrink-0 text-gray-500'
      />
      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-3'>
          <p className='break-words font-dm_sans font-medium'>{tier.name}</p>
          <p className='shrink-0 font-inter text-sm'>
            {formatPrice(tier.price, tier.currency)}
          </p>
        </div>
        <p className='mt-1 font-inter text-sm text-gray-500'>{note}</p>
      </div>
    </div>
  );
}

function LeaveSpotControls({
  busy,
  confirmLeave,
  askLabel,
  keepLabel,
  confirmLabel,
  title,
  body,
  onAsk,
  onKeep,
  onConfirm,
}: {
  busy: boolean;
  confirmLeave: boolean;
  askLabel: string;
  keepLabel: string;
  confirmLabel: string;
  title: string;
  body: string;
  onAsk: () => void;
  onKeep: () => void;
  onConfirm: () => void;
}) {
  if (!confirmLeave) {
    return (
      <Button
        variant='outline'
        className='h-auto min-h-11 w-full gap-2 border-red-300 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40'
        disabled={busy}
        onClick={onAsk}
      >
        <Icon name='RiClose' size={16} className='shrink-0' />
        {busy ? 'Please wait…' : askLabel}
      </Button>
    );
  }

  return (
    <div className='min-w-0 space-y-3 rounded-lg border border-red-200 bg-red-50/70 px-3 py-3 dark:border-red-900/50 dark:bg-red-950/30'>
      <div className='min-w-0'>
        <p className='font-dm_sans font-medium'>{title}</p>
        <p className='mt-1 font-inter text-sm leading-5 text-gray-600 dark:text-gray-400'>
          {body}
        </p>
      </div>
      <div className='flex min-w-0 flex-col gap-2'>
        <Button
          variant='brand'
          className='h-auto min-h-11 w-full min-w-0 whitespace-normal px-3 py-2.5 text-center'
          disabled={busy}
          onClick={onKeep}
        >
          {keepLabel}
        </Button>
        <Button
          variant='outline'
          className='h-auto min-h-11 w-full min-w-0 whitespace-normal px-3 py-2.5 text-center border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400'
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? 'Please wait…' : confirmLabel}
        </Button>
      </div>
    </div>
  );
}

function PendingApplication({
  tier,
  busy,
  confirmLeave,
  onAskLeave,
  onKeep,
  onWithdraw,
}: {
  tier?: TicketTier;
  busy: boolean;
  confirmLeave: boolean;
  onAskLeave: () => void;
  onKeep: () => void;
  onWithdraw: () => void;
}) {
  return (
    <div className='space-y-3'>
      <div className='flex gap-3 rounded-lg border border-brand-orange/25 bg-brand-orange/5 px-3 py-3 sm:px-4 sm:py-4'>
        <Icon
          name='RiTime'
          size={20}
          className='mt-0.5 shrink-0 text-brand-orange'
        />
        <div className='min-w-0'>
          <p className='font-dm_sans font-medium'>Application pending</p>
          <p className='mt-1 font-inter text-sm leading-5 text-gray-600 dark:text-gray-400'>
            The host is reviewing your application. You&apos;ll be notified once
            a decision is made.
          </p>
        </div>
      </div>

      <TicketSummary tier={tier} note='Your application has been submitted.' />

      <LeaveSpotControls
        busy={busy}
        confirmLeave={confirmLeave}
        askLabel='Withdraw application'
        keepLabel='Keep application'
        confirmLabel='Yes, withdraw'
        title='Withdraw your application?'
        body='The host will not see this request. You can apply again later if RSVPs are still open.'
        onAsk={onAskLeave}
        onKeep={onKeep}
        onConfirm={onWithdraw}
      />
    </div>
  );
}

function ConfirmedSpot({
  event,
  tier,
  busy,
  confirmLeave,
  onAskLeave,
  onKeep,
  onCancel,
}: {
  event: EventItem;
  tier?: TicketTier;
  busy: boolean;
  confirmLeave: boolean;
  onAskLeave: () => void;
  onKeep: () => void;
  onCancel: () => void;
}) {
  return (
    <div className='space-y-3'>
      <div className='flex gap-3 rounded-lg border border-emerald-600/25 bg-emerald-600/10 px-3 py-3 sm:px-4 sm:py-4'>
        <Icon
          name='RiCheck'
          type='Fill'
          size={20}
          className='mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400'
        />
        <div className='min-w-0'>
          <p className='font-dm_sans font-medium text-emerald-800 dark:text-emerald-300'>
            You&apos;re going
          </p>
          <p className='mt-1 font-inter text-sm leading-5 text-gray-600 dark:text-gray-400'>
            Your spot is confirmed. We&apos;ll see you there.
          </p>
        </div>
      </div>

      {event.meeting_link && (
        <a
          href={event.meeting_link}
          target='_blank'
          rel='noreferrer'
          className='block font-inter text-sm text-brand-orange hover:underline break-all'
        >
          Join meeting
        </a>
      )}

      <TicketSummary tier={tier} note='This is your ticket for the meetup.' />

      <LeaveSpotControls
        busy={busy}
        confirmLeave={confirmLeave}
        askLabel='Cancel my RSVP'
        keepLabel='Keep my spot'
        confirmLabel='Yes, cancel'
        title='Cancel your RSVP?'
        body='Are you sure you do not want to attend? Your spot will be released. You can RSVP again later if seats remain.'
        onAsk={onAskLeave}
        onKeep={onKeep}
        onConfirm={onCancel}
      />
    </div>
  );
}
