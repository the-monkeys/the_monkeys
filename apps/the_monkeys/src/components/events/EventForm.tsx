'use client';

import { FormEvent, useMemo, useState } from 'react';

import useAuth from '@/hooks/auth/useAuth';
import { useUserGroups } from '@/hooks/groups/useGroupQueries';
import { defaultTimezone, fromLocalInput, toLocalInput } from '@/lib/eventTime';
import {
  EventBody,
  EventItem,
  EventType,
  EventVisibility,
} from '@/services/events/eventTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';

type Props = {
  event?: EventItem;
  saving?: boolean;
  submitLabel: string;
  onSubmit: (body: EventBody) => void;
};

const TYPES: { value: EventType; label: string }[] = [
  { value: 'virtual', label: 'Online' },
  { value: 'in_person', label: 'In person' },
  { value: 'hybrid', label: 'Hybrid' },
];

// Only communities the viewer runs may host events; the backend enforces the
// same rule, so this list is a convenience, not the security boundary.
const ORGANIZER_ROLES = new Set(['organizer', 'co_organizer']);

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function EventForm({ event, saving, submitLabel, onSubmit }: Props) {
  const { data: session } = useAuth();
  const myGroups = useUserGroups(
    session?.username,
    { limit: 100 },
    !!session?.username
  );
  const organizerGroups = useMemo(
    () =>
      (myGroups.data?.groups || []).filter((g) =>
        ORGANIZER_ROLES.has(g.viewer_role || '')
      ),
    [myGroups.data]
  );

  const [eventType, setEventType] = useState<EventType>(
    event?.event_type || 'virtual'
  );
  const [includeTier, setIncludeTier] = useState(!event);
  // Group linkage is chosen at creation time; visibility is editable anytime.
  const [groupSlug, setGroupSlug] = useState(event?.group_slug || '');
  const [visibility, setVisibility] = useState<EventVisibility>(
    (event?.visibility as EventVisibility) || 'public'
  );

  const hasGroup = !!(event ? event.group_slug : groupSlug);

  const initial = useMemo(
    () => ({
      title: event?.title || '',
      description: event?.description || '',
      start: toLocalInput(event?.start_time),
      end: toLocalInput(event?.end_time),
      timezone: event?.timezone || defaultTimezone(),
      location: event?.location || '',
      meeting_link: event?.meeting_link || '',
      capacity: event?.capacity ? String(event.capacity) : '',
      cover_image: event?.cover_image || '',
      tags: event?.tags?.join(', ') || '',
      cohosts: event?.co_host_usernames?.join(', ') || '',
      tierName: 'General',
      tierPrice: '0',
      tierCapacity: '',
    }),
    [event]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const start = fromLocalInput(String(form.get('start') || ''));
    const end = fromLocalInput(String(form.get('end') || ''));
    if (!start || !end) return;

    const body: EventBody = {
      title: String(form.get('title') || '').trim(),
      description: String(form.get('description') || '').trim(),
      start_time: start,
      end_time: end,
      timezone: String(form.get('timezone') || defaultTimezone()),
      event_type: eventType,
      location: String(form.get('location') || '').trim(),
      meeting_link: String(form.get('meeting_link') || '').trim(),
      capacity: Number(form.get('capacity') || 0) || 0,
      cover_image: String(form.get('cover_image') || '').trim(),
      tags: splitList(String(form.get('tags') || '')),
    };

    // 'group_members' visibility is only valid for a group-attached event; the
    // backend rejects the mismatch, so guard it here for a clean UX.
    const linked = event ? !!event.group_slug : !!groupSlug;
    body.visibility =
      visibility === 'group_members' && !linked ? 'public' : visibility;

    if (!event) {
      if (groupSlug) body.group_slug = groupSlug;
      body.co_host_usernames = splitList(String(form.get('cohosts') || ''));
      if (includeTier) {
        body.ticket_tiers = [
          {
            name: String(form.get('tierName') || 'General').trim() || 'General',
            price: Number(form.get('tierPrice') || 0) || 0,
            capacity: Number(form.get('tierCapacity') || 0) || 0,
            currency: 'INR',
            sort_order: 0,
          },
        ];
      }
    }

    onSubmit(body);
  };

  const showPlace = eventType !== 'virtual';
  const showLink = eventType !== 'in_person';

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <Field label='Title'>
        <Input
          name='title'
          required
          defaultValue={initial.title}
          maxLength={120}
        />
      </Field>

      <Field label='About this event'>
        <TextArea
          name='description'
          defaultValue={initial.description}
          rows={5}
          className='min-h-32'
        />
      </Field>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Field label='Starts'>
          <Input
            name='start'
            type='datetime-local'
            required
            defaultValue={initial.start}
          />
        </Field>
        <Field label='Ends'>
          <Input
            name='end'
            type='datetime-local'
            required
            defaultValue={initial.end}
          />
        </Field>
      </div>

      <Field label='Timezone'>
        <Input name='timezone' defaultValue={initial.timezone} />
      </Field>

      <fieldset>
        <legend className='mb-2 font-inter text-sm font-medium'>Type</legend>
        <div className='flex flex-wrap gap-2'>
          {TYPES.map((t) => (
            <button
              key={t.value}
              type='button'
              onClick={() => setEventType(t.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-inter border-2 transition-colors ${
                eventType === t.value
                  ? 'border-brand-orange bg-brand-orange text-white'
                  : 'border-border-light dark:border-border-dark'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      {showPlace && (
        <Field label='Place'>
          <Input
            name='location'
            defaultValue={initial.location}
            placeholder='City or venue'
          />
        </Field>
      )}
      {showLink && (
        <Field label='Meeting link'>
          <Input
            name='meeting_link'
            type='url'
            defaultValue={initial.meeting_link}
            placeholder='https://'
          />
        </Field>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Field label='Max people (0 = no limit)'>
          <Input
            name='capacity'
            type='number'
            min={0}
            defaultValue={initial.capacity}
          />
        </Field>
        <Field label='Cover image URL'>
          <Input
            name='cover_image'
            type='url'
            defaultValue={initial.cover_image}
          />
        </Field>
      </div>

      <Field label='Tags (comma separated)'>
        <Input
          name='tags'
          defaultValue={initial.tags}
          placeholder='tech, meetup'
        />
      </Field>

      {!event
        ? organizerGroups.length > 0 && (
            <Field label='Host under a community (optional)'>
              <select
                value={groupSlug}
                onChange={(e) => setGroupSlug(e.target.value)}
                className='w-full rounded-md border-2 border-border-light dark:border-border-dark bg-transparent px-3 py-2 font-inter text-sm'
              >
                <option value=''>No community — standalone event</option>
                {organizerGroups.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name}
                  </option>
                ))}
              </select>
            </Field>
          )
        : event.group_slug && (
            <Field label='Community'>
              <p className='font-inter text-sm text-text-light/70 dark:text-text-dark/70'>
                Hosted under {event.group_name || event.group_slug}
              </p>
            </Field>
          )}

      <Field label='Visibility'>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as EventVisibility)}
          className='w-full rounded-md border-2 border-border-light dark:border-border-dark bg-transparent px-3 py-2 font-inter text-sm'
        >
          <option value='public'>Public — anyone can find it</option>
          <option value='unlisted'>Unlisted — only people with the link</option>
          <option value='private'>Private — invite only</option>
          {hasGroup && (
            <option value='group_members'>Members only — group members</option>
          )}
        </select>
      </Field>

      {!event && (
        <Field label='Co-hosts (usernames, comma separated)'>
          <Input name='cohosts' defaultValue={initial.cohosts} />
        </Field>
      )}

      {!event && (
        <div className='rounded-lg border border-border-light dark:border-border-dark/60 p-4 space-y-3'>
          <label className='flex items-center gap-2 font-inter text-sm'>
            <input
              type='checkbox'
              checked={includeTier}
              onChange={(e) => setIncludeTier(e.target.checked)}
            />
            Add a ticket
          </label>
          {includeTier && (
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              <Input
                name='tierName'
                defaultValue={initial.tierName}
                placeholder='Name'
              />
              <Input
                name='tierPrice'
                type='number'
                min={0}
                step='1'
                defaultValue={initial.tierPrice}
                placeholder='Price (0 = free)'
              />
              <Input
                name='tierCapacity'
                type='number'
                min={0}
                defaultValue={initial.tierCapacity}
                placeholder='Seats (0 = no limit)'
              />
            </div>
          )}
        </div>
      )}

      <Button
        type='submit'
        variant='brand'
        disabled={saving}
        className='w-full sm:w-auto'
      >
        {saving ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-1.5'>
      <Label className='font-inter text-sm'>{label}</Label>
      {children}
    </div>
  );
}
