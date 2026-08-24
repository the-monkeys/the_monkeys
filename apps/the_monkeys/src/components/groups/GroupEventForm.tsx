'use client';

import { FormEvent, useMemo, useState } from 'react';

import { defaultTimezone, fromLocalInput, toLocalInput } from '@/lib/eventTime';
import { EventItem, EventType } from '@/services/events/eventTypes';
import {
  GroupEventBody,
  GroupEventVisibility,
} from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';

type Props = {
  event?: EventItem;
  saving?: boolean;
  submitLabel: string;
  onSubmit: (body: GroupEventBody) => void;
};

const TYPES: { value: EventType; label: string }[] = [
  { value: 'virtual', label: 'Online' },
  { value: 'in_person', label: 'In person' },
  { value: 'hybrid', label: 'Hybrid' },
];

// Only the visibilities the group-event endpoint accepts. Ticket tiers and
// co-hosts are intentionally omitted: the group-event create contract does not
// accept them, so surfacing those inputs would be dead UI.
const VISIBILITIES: { value: GroupEventVisibility; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'group_members', label: 'Members only' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'private', label: 'Private' },
];

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Focused form for creating an event inside a group. It maps 1:1 to the
 * group-event API body (no tiers/co-hosts, plus a group-event visibility),
 * reusing the styling and field conventions of the standalone EventForm.
 */
export function GroupEventForm({
  event,
  saving,
  submitLabel,
  onSubmit,
}: Props) {
  const [eventType, setEventType] = useState<EventType>(
    event?.event_type || 'in_person'
  );
  const [visibility, setVisibility] = useState<GroupEventVisibility>(
    (event?.visibility as GroupEventVisibility) || 'public'
  );

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
    }),
    [event]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const start = fromLocalInput(String(form.get('start') || ''));
    const end = fromLocalInput(String(form.get('end') || ''));
    if (!start || !end) return;

    const body: GroupEventBody = {
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
      visibility,
    };
    if (!body.title) return;
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

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
              className={`rounded-full border-2 px-3 py-1.5 font-inter text-sm transition-colors ${
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

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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

      <fieldset>
        <legend className='mb-2 font-inter text-sm font-medium'>
          Who can see this event
        </legend>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
          {VISIBILITIES.map((v) => (
            <button
              key={v.value}
              type='button'
              onClick={() => setVisibility(v.value)}
              className={`rounded-lg border-2 px-3 py-2 font-inter text-sm transition-colors ${
                visibility === v.value
                  ? 'border-brand-orange bg-brand-orange/5'
                  : 'border-border-light dark:border-border-dark'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </fieldset>

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
