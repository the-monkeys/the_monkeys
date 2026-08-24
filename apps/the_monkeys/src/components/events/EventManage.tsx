'use client';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { EVENTS_ROUTE } from '@/constants/routeConstants';
import {
  useEventAttendees,
  useEventCoupons,
} from '@/hooks/events/useEventQueries';
import { useRefreshEvents } from '@/hooks/events/useRefreshEvents';
import { formatPrice, isOrganizer } from '@/lib/eventTime';
import { EventItem, TicketTierInput } from '@/services/events/eventTypes';
import {
  addCoHost,
  cancelEvent,
  createCoupon,
  createTier,
  deleteCoupon,
  deleteEvent,
  deleteTier,
  eventError,
  exportAttendeesCsv,
  publishEvent,
  removeCoHost,
  updateAttendance,
  updateTier,
} from '@/services/events/eventsApi';
import { IUser } from '@/services/models/user';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export function EventManage({
  event,
  session,
}: {
  event: EventItem;
  session?: IUser | null;
}) {
  const { toast } = useToast();
  const refresh = useRefreshEvents(event.slug);
  const router = useRouter();
  const owner = isOrganizer(event, session?.username);
  const couponsQ = useEventCoupons(event.slug, true);
  const attendeesQ = useEventAttendees(event.slug, true);

  const act = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn();
      toast({ title: ok });
      refresh();
    } catch (err) {
      toast({ title: 'Failed', description: eventError(err) });
    }
  };

  return (
    <div className='space-y-10'>
      <section className='flex flex-wrap gap-2'>
        {event.status === 'draft' && (
          <Button
            variant='brand'
            onClick={() => act(() => publishEvent(event.slug), 'Published')}
          >
            Publish
          </Button>
        )}
        {event.status !== 'cancelled' && event.status !== 'draft' && (
          <Button
            variant='outline'
            onClick={() => act(() => cancelEvent(event.slug), 'Cancelled')}
          >
            Cancel event
          </Button>
        )}
        {owner && (
          <Button
            variant='destructive'
            onClick={() =>
              act(async () => {
                await deleteEvent(event.slug);
                router.replace(EVENTS_ROUTE);
              }, 'Deleted')
            }
          >
            Delete
          </Button>
        )}
      </section>

      <TiersBlock event={event} onChange={refresh} />
      <CouponsBlock
        slug={event.slug}
        coupons={couponsQ.data?.coupons || []}
        onChange={refresh}
      />
      <CohostsBlock event={event} onChange={refresh} />
      <AttendeesBlock
        slug={event.slug}
        attendees={attendeesQ.data?.attendees || []}
        total={attendeesQ.data?.total || 0}
        onChange={refresh}
      />
    </div>
  );
}

function TiersBlock({
  event,
  onChange,
}: {
  event: EventItem;
  onChange: () => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const save = async (e: FormEvent<HTMLFormElement>, id?: number) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body: TicketTierInput = {
      name: String(form.get('name') || '').trim(),
      description: String(form.get('description') || '').trim(),
      price: Number(form.get('price') || 0) || 0,
      currency: 'INR',
      capacity: Number(form.get('capacity') || 0) || 0,
      sort_order: Number(form.get('sort_order') || 0) || 0,
    };
    try {
      if (id) await updateTier(event.slug, id, body);
      else await createTier(event.slug, body);
      toast({ title: id ? 'Ticket updated' : 'Ticket added' });
      setOpen(false);
      onChange();
    } catch (err) {
      toast({ title: 'Could not save ticket', description: eventError(err) });
    }
  };

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='font-dm_sans font-semibold text-xl'>Tickets</h2>
        <Button size='sm' variant='outline' onClick={() => setOpen((v) => !v)}>
          Add ticket
        </Button>
      </div>
      {open && <TierForm onSubmit={(e) => save(e)} />}
      <ul className='divide-y divide-border-light dark:divide-border-dark/40'>
        {(event.ticket_tiers || []).map((t) => (
          <li key={t.id} className='py-3 space-y-2'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='font-dm_sans font-medium'>{t.name}</p>
                <p className='text-xs text-gray-500'>
                  {formatPrice(t.price, t.currency)} · booked {t.booked || 0}
                  {t.capacity ? ` / ${t.capacity}` : ''}
                </p>
              </div>
              <Button
                size='sm'
                variant='ghost'
                onClick={() =>
                  deleteTier(event.slug, t.id)
                    .then(onChange)
                    .catch((err) =>
                      toast({
                        title: 'Could not delete',
                        description: eventError(err),
                      })
                    )
                }
              >
                Delete
              </Button>
            </div>
            <TierForm
              defaults={{
                name: t.name,
                description: t.description,
                price: String(t.price),
                capacity: String(t.capacity || ''),
              }}
              submitLabel='Update'
              onSubmit={(e) => save(e, t.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TierForm({
  defaults,
  submitLabel = 'Save',
  onSubmit,
}: {
  defaults?: {
    name?: string;
    description?: string;
    price?: string;
    capacity?: string;
  };
  submitLabel?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2'
    >
      <Input
        name='name'
        required
        placeholder='Name'
        defaultValue={defaults?.name}
      />
      <Input
        name='description'
        placeholder='Note'
        defaultValue={defaults?.description}
      />
      <Input
        name='price'
        type='number'
        min={0}
        placeholder='Price'
        defaultValue={defaults?.price}
      />
      <div className='flex gap-2'>
        <Input
          name='capacity'
          type='number'
          min={0}
          placeholder='Seats'
          defaultValue={defaults?.capacity}
        />
        <Button type='submit' size='sm'>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function CouponsBlock({
  slug,
  coupons,
  onChange,
}: {
  slug: string;
  coupons: {
    id: number;
    code: string;
    discount_percent: number;
    current_uses?: number;
    max_uses?: number;
  }[];
  onChange: () => void;
}) {
  const { toast } = useToast();

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await createCoupon(slug, {
        code: String(form.get('code') || '').trim(),
        discount_percent: Number(form.get('discount_percent') || 0),
        max_uses: Number(form.get('max_uses') || 0) || 0,
      });
      toast({ title: 'Coupon added' });
      e.currentTarget.reset();
      onChange();
    } catch (err) {
      toast({ title: 'Could not add coupon', description: eventError(err) });
    }
  };

  return (
    <section className='space-y-3'>
      <h2 className='font-dm_sans font-semibold text-xl'>Coupons</h2>
      <form
        onSubmit={onCreate}
        className='grid grid-cols-1 sm:grid-cols-4 gap-2'
      >
        <Input name='code' required placeholder='CODE' />
        <Input
          name='discount_percent'
          type='number'
          min={1}
          max={100}
          required
          placeholder='% off'
        />
        <Input name='max_uses' type='number' min={0} placeholder='Max uses' />
        <Button type='submit' size='sm'>
          Add
        </Button>
      </form>
      <ul className='space-y-2'>
        {coupons.map((c) => (
          <li key={c.id} className='flex items-center justify-between text-sm'>
            <span>
              <span className='font-medium'>{c.code}</span> ·{' '}
              {c.discount_percent}% · used {c.current_uses || 0}
              {c.max_uses ? ` / ${c.max_uses}` : ''}
            </span>
            <Button
              size='sm'
              variant='ghost'
              onClick={() =>
                deleteCoupon(slug, c.id)
                  .then(onChange)
                  .catch((err) =>
                    toast({
                      title: 'Could not delete',
                      description: eventError(err),
                    })
                  )
              }
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CohostsBlock({
  event,
  onChange,
}: {
  event: EventItem;
  onChange: () => void;
}) {
  const { toast } = useToast();

  const onAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = String(form.get('username') || '').trim();
    if (!username) return;
    try {
      await addCoHost(event.slug, username);
      toast({ title: 'Co-host added' });
      e.currentTarget.reset();
      onChange();
    } catch (err) {
      toast({ title: 'Could not add co-host', description: eventError(err) });
    }
  };

  return (
    <section className='space-y-3'>
      <h2 className='font-dm_sans font-semibold text-xl'>Co-hosts</h2>
      <form onSubmit={onAdd} className='flex gap-2'>
        <Input name='username' placeholder='username' />
        <Button type='submit' size='sm'>
          Add
        </Button>
      </form>
      <ul className='space-y-2'>
        {(event.co_host_usernames || []).map((name) => (
          <li key={name} className='flex items-center justify-between text-sm'>
            @{name}
            <Button
              size='sm'
              variant='ghost'
              onClick={() =>
                removeCoHost(event.slug, name)
                  .then(onChange)
                  .catch((err) =>
                    toast({
                      title: 'Could not remove',
                      description: eventError(err),
                    })
                  )
              }
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AttendeesBlock({
  slug,
  attendees,
  total,
  onChange,
}: {
  slug: string;
  attendees: {
    id: number;
    user_name?: string;
    user_email?: string;
    ticket_tier_name?: string;
    status?: string;
    checked_in?: boolean;
  }[];
  total: number;
  onChange: () => void;
}) {
  const { toast } = useToast();
  const [busyId, setBusyId] = useState<number | null>(null);
  const checkedInCount = attendees.filter((a) => a.checked_in).length;

  const setCheckedIn = async (id: number, checkedIn: boolean) => {
    setBusyId(id);
    try {
      await updateAttendance(slug, id, {
        attendance_status: checkedIn ? 'checked_in' : 'registered',
        checked_in: checkedIn,
      });
      onChange();
    } catch (err) {
      toast({ title: 'Could not update', description: eventError(err) });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='font-dm_sans font-semibold text-xl'>
          People ({total})
          {checkedInCount > 0 && (
            <span className='ml-2 text-sm font-normal text-gray-500'>
              {checkedInCount} checked in
            </span>
          )}
        </h2>
        <Button
          size='sm'
          variant='outline'
          onClick={() =>
            exportAttendeesCsv(slug).catch((err) =>
              toast({ title: 'Could not export', description: eventError(err) })
            )
          }
        >
          Export CSV
        </Button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm font-inter'>
          <thead>
            <tr className='text-left text-gray-500'>
              <th className='py-2 pr-3'>User</th>
              <th className='py-2 pr-3'>Email</th>
              <th className='py-2 pr-3'>Ticket</th>
              <th className='py-2 pr-3'>Status</th>
              <th className='py-2 text-right'>Check-in</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a) => (
              <tr
                key={a.id}
                className='border-t border-border-light/60 dark:border-border-dark/40'
              >
                <td className='py-2 pr-3'>@{a.user_name}</td>
                <td className='py-2 pr-3'>{a.user_email}</td>
                <td className='py-2 pr-3'>{a.ticket_tier_name}</td>
                <td className='py-2 pr-3'>{a.status}</td>
                <td className='py-2 text-right'>
                  <Button
                    size='sm'
                    variant={a.checked_in ? 'constructive' : 'outline'}
                    disabled={busyId === a.id}
                    onClick={() => setCheckedIn(a.id, !a.checked_in)}
                  >
                    {a.checked_in ? 'Checked in' : 'Check in'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
