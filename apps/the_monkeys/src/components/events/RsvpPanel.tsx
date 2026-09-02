'use client';

import { useState } from 'react';

import Link from 'next/link';

import { LOGIN_ROUTE } from '@/constants/routeConstants';
import { useRefreshEvents } from '@/hooks/events/useRefreshEvents';
import { formatPrice, isEventEnded } from '@/lib/eventTime';
import { openRazorpay } from '@/lib/razorpayCheckout';
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

  const selected = tiers.find((t) => t.id === tierId) || tiers[0];
  const closed = isEventEnded(event);
  const going =
    viewerStatus === 'confirmed' ||
    viewerStatus === 'waitlisted' ||
    viewerStatus === 'pending_payment';

  const onRsvp = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await rsvpEvent(event.slug, {
        ticket_tier_id: selected.id,
        coupon_code: code.trim() || undefined,
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
          description: statusCopy(res.status),
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
      toast({ title: 'RSVP cancelled' });
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

  return (
    <aside className='rounded-lg border border-border-light dark:border-border-dark/60 p-5 space-y-4'>
      <h2 className='font-dm_sans font-semibold text-lg'>Tickets</h2>

      {going && (
        <p className='font-inter text-sm text-brand-orange'>
          Your status: {viewerStatus?.replace('_', ' ')}
        </p>
      )}

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
        <div className='flex gap-2'>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Coupon code'
          />
          <Button type='button' variant='outline' onClick={onCheckCoupon}>
            Apply
          </Button>
        </div>
      )}
      {discount !== null && selected && (
        <p className='font-inter text-sm'>
          Pay {formatPrice(discount, selected.currency)}
        </p>
      )}

      {!session ? (
        <Button asChild variant='brand' className='w-full'>
          <Link href={LOGIN_ROUTE}>Log in to RSVP</Link>
        </Button>
      ) : going ? (
        <Button
          variant='outline'
          className='w-full'
          disabled={busy}
          onClick={onCancel}
        >
          {busy ? 'Please wait…' : 'Cancel my RSVP'}
        </Button>
      ) : (
        <Button
          variant='brand'
          className='w-full'
          disabled={busy || !selected}
          onClick={onRsvp}
        >
          {busy
            ? 'Please wait…'
            : selected && selected.price > 0
              ? 'Get ticket'
              : 'RSVP'}
        </Button>
      )}
    </aside>
  );
}

function statusCopy(status?: string) {
  if (status === 'waitlisted')
    return 'The event is full. You are on the waitlist.';
  if (status === 'confirmed') return 'You are in.';
  if (status === 'pending_payment')
    return 'Finish payment to confirm your seat.';
  return '';
}
