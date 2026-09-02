'use client';

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Icon from '@/components/icon';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import useAuth from '@/hooks/auth/useAuth';
import { useUploadEventCover } from '@/hooks/events/useEventQueries';
import { useUserGroups } from '@/hooks/groups/useGroupQueries';
import { useSearchPeopleV2 } from '@/hooks/search/useSearchV2';
import { defaultTimezone, fromLocalInput, isEventEnded, toLocalInput } from '@/lib/eventTime';
import {
  EventBody,
  EventItem,
  EventType,
  EventVisibility,
  RecurrenceFreq,
} from '@/services/events/eventTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';

type Props = {
  event?: EventItem;
  saving?: boolean;
  submitLabel: string;
  onSubmit: (body: EventBody, coverFile?: File) => void;
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

// localNowInput returns the current instant formatted for a datetime-local
// input (YYYY-MM-DDTHH:mm) in the viewer's own timezone, so it can be used as a
// `min` to block selecting a past moment.
function localNowInput(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
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
  // Cover image and co-hosts are controlled so the upload picker and the
  // username search can drive them; both fall back to the event's saved values.
  const [coverImage, setCoverImage] = useState(event?.cover_image || '');
  // Before the event exists there is no slug to upload against, so we hold the
  // chosen file locally (with an object-URL preview) and upload it right after
  // creation. In edit mode uploads happen immediately, so these stay unset.
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [cohosts, setCohosts] = useState<string[]>(
    event?.co_host_usernames || []
  );
  // Track the chosen start so the end picker can forbid an earlier moment.
  const [startVal, setStartVal] = useState(toLocalInput(event?.start_time));
  const [endVal, setEndVal] = useState(toLocalInput(event?.end_time));
  const [dateError, setDateError] = useState('');
  const [repeatFreq, setRepeatFreq] = useState<RecurrenceFreq | 'off'>('off');
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [repeatEnd, setRepeatEnd] = useState<'never' | 'until' | 'count'>(
    'never'
  );
  const [repeatUntil, setRepeatUntil] = useState('');
  const [repeatCount, setRepeatCount] = useState(12);
  const ended = isEventEnded(event);
  // Recomputed once on mount; a stale minute is harmless and the browser plus
  // the submit guard both re-validate against the real clock.
  const minStart = useMemo(() => localNowInput(), []);

  // Release the object URL when the pending file changes or the form unmounts.
  useEffect(
    () => () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview]
  );

  // Pick a local cover before the event exists: preview it and defer the upload.
  const handleCoverFile = (file: File) => {
    setCoverImage('');
    setCoverFile(file);
    setCoverPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  // Typing a URL supersedes any locally-picked file.
  const handleCoverUrl = (v: string) => {
    setCoverImage(v);
    if (v && coverFile) {
      setCoverFile(null);
      setCoverPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return '';
      });
    }
  };

  const hasGroup = !!(event ? event.group_slug : groupSlug);

  const initial = useMemo(
    () => ({
      title: event?.title || '',
      description: event?.description || '',
      timezone: event?.timezone || defaultTimezone(),
      location: event?.location || '',
      meeting_link: event?.meeting_link || '',
      capacity: event?.capacity ? String(event.capacity) : '',
      tags: event?.tags?.join(', ') || '',
      tierName: 'General',
      tierPrice: '0',
      tierCapacity: '',
    }),
    [event]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const start = fromLocalInput(startVal);
    const end = fromLocalInput(endVal);
    if (!start || !end) return;

    // Block past starts and inverted ranges at the boundary. The browser's
    // `min` handles the common case, but a crafted value or a stale tab could
    // still submit one, and the backend also rejects it. Ended events keep
    // their original window, so skip the past-start check there.
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();
    const nowMs = Date.now();
    if (!ended && startMs < nowMs - 60_000) {
      setDateError('Start time cannot be in the past.');
      return;
    }
    if (endMs < startMs) {
      setDateError('End time must be after the start time.');
      return;
    }
    setDateError('');

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
      cover_image: coverImage.trim(),
      tags: splitList(String(form.get('tags') || '')),
    };

    // 'group_members' visibility is only valid for a group-attached event; the
    // backend rejects the mismatch, so guard it here for a clean UX.
    const linked = event ? !!event.group_slug : !!groupSlug;
    body.visibility =
      visibility === 'group_members' && !linked ? 'public' : visibility;

    if (!event) {
      if (groupSlug) body.group_slug = groupSlug;
      body.co_host_usernames = cohosts;
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
      if (repeatFreq !== 'off') {
        body.recurrence = {
          freq: repeatFreq,
          interval: Math.max(1, repeatInterval || 1),
          by_day:
            repeatFreq === 'weekly'
              ? repeatDays.length
                ? repeatDays
                : [weekdayFromLocal(startVal)]
              : undefined,
          count: repeatEnd === 'count' ? Math.max(1, repeatCount) : undefined,
          until:
            repeatEnd === 'until' && repeatUntil
              ? new Date(`${repeatUntil}T23:59:59`).toISOString()
              : undefined,
        };
      }
    }

    onSubmit(body, coverFile ?? undefined);
  };

  const showPlace = eventType !== 'virtual';
  const showLink = eventType !== 'in_person';

  const WEEKDAYS = [
    { id: 'MO', label: 'Mon' },
    { id: 'TU', label: 'Tue' },
    { id: 'WE', label: 'Wed' },
    { id: 'TH', label: 'Thu' },
    { id: 'FR', label: 'Fri' },
    { id: 'SA', label: 'Sat' },
    { id: 'SU', label: 'Sun' },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {ended && (
        <p className='rounded-md border border-border-light bg-foreground-light/40 px-3 py-2 font-inter text-sm text-gray-600 dark:border-border-dark/60 dark:bg-foreground-dark/30 dark:text-gray-400'>
          This meetup has ended. You can still update the writeup, cover, and
          tags.
        </p>
      )}
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
            min={ended ? undefined : minStart}
            readOnly={ended}
            value={startVal}
            onChange={(e) => {
              if (ended) return;
              setStartVal(e.target.value);
              if (endVal && e.target.value && endVal < e.target.value) {
                setEndVal(e.target.value);
              }
              if (dateError) setDateError('');
            }}
          />
        </Field>
        <Field label='Ends'>
          <Input
            name='end'
            type='datetime-local'
            required
            min={ended ? undefined : startVal || minStart}
            readOnly={ended}
            value={endVal}
            onChange={(e) => {
              if (ended) return;
              setEndVal(e.target.value);
              if (dateError) setDateError('');
            }}
          />
        </Field>
      </div>
      {dateError && (
        <p className='-mt-3 font-inter text-sm text-brand-orange'>
          {dateError}
        </p>
      )}

      <Field label='Timezone'>
        <Input
          name='timezone'
          defaultValue={initial.timezone}
          readOnly={ended}
        />
      </Field>

      {!event && (
        <div className='rounded-lg border border-border-light p-4 space-y-3 dark:border-border-dark/60'>
          <Field label='Repeat'>
            <select
              value={repeatFreq}
              onChange={(e) =>
                setRepeatFreq(e.target.value as RecurrenceFreq | 'off')
              }
              className='w-full rounded-md border-2 border-border-light bg-transparent px-3 py-2 font-inter text-sm dark:border-border-dark'
            >
              <option value='off'>Off — one-off event</option>
              <option value='daily'>Daily</option>
              <option value='weekly'>Weekly</option>
              <option value='monthly'>Monthly</option>
              <option value='yearly'>Yearly</option>
            </select>
          </Field>
          {repeatFreq !== 'off' && (
            <>
              <Field label='Every'>
                <div className='flex items-center gap-2'>
                  <Input
                    type='number'
                    min={1}
                    max={52}
                    value={repeatInterval}
                    onChange={(e) =>
                      setRepeatInterval(Math.max(1, Number(e.target.value) || 1))
                    }
                    className='w-24'
                  />
                  <span className='font-inter text-sm text-gray-500'>
                    {repeatFreq === 'daily'
                      ? 'day(s)'
                      : repeatFreq === 'weekly'
                        ? 'week(s)'
                        : repeatFreq === 'monthly'
                          ? 'month(s)'
                          : 'year(s)'}
                  </span>
                </div>
              </Field>
              {repeatFreq === 'weekly' && (
                <div className='flex flex-wrap gap-2'>
                  {WEEKDAYS.map((d) => {
                    const on = repeatDays.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type='button'
                        onClick={() =>
                          setRepeatDays((prev) =>
                            on
                              ? prev.filter((x) => x !== d.id)
                              : [...prev, d.id]
                          )
                        }
                        className={`rounded-full px-3 py-1.5 text-sm font-inter border-2 ${
                          on
                            ? 'border-brand-orange bg-brand-orange text-white'
                            : 'border-border-light dark:border-border-dark'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              )}
              <Field label='Ends'>
                <select
                  value={repeatEnd}
                  onChange={(e) =>
                    setRepeatEnd(e.target.value as typeof repeatEnd)
                  }
                  className='w-full rounded-md border-2 border-border-light bg-transparent px-3 py-2 font-inter text-sm dark:border-border-dark'
                >
                  <option value='never'>Never (next 12 dates)</option>
                  <option value='until'>On a date</option>
                  <option value='count'>After a number of events</option>
                </select>
              </Field>
              {repeatEnd === 'until' && (
                <Input
                  type='date'
                  value={repeatUntil}
                  onChange={(e) => setRepeatUntil(e.target.value)}
                />
              )}
              {repeatEnd === 'count' && (
                <Input
                  type='number'
                  min={1}
                  max={52}
                  value={repeatCount}
                  onChange={(e) =>
                    setRepeatCount(Math.max(1, Number(e.target.value) || 1))
                  }
                />
              )}
            </>
          )}
        </div>
      )}

      <fieldset>
        <legend className='mb-2 font-inter text-sm font-medium'>Type</legend>
        <div className='flex flex-wrap gap-2'>
          {TYPES.map((t) => (
            <button
              key={t.value}
              type='button'
              onClick={() => {
                if (!ended) setEventType(t.value);
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-inter border-2 transition-colors ${
                eventType === t.value
                  ? 'border-brand-orange bg-brand-orange text-white'
                  : 'border-border-light dark:border-border-dark'
              } ${ended ? 'opacity-60' : ''}`}
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
            readOnly={ended}
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
            readOnly={ended}
          />
        </Field>
      )}

      <Field label='Max people (0 = no limit)'>
        <Input
          name='capacity'
          type='number'
          min={0}
          defaultValue={initial.capacity}
          readOnly={ended}
        />
      </Field>

      <EventCoverField
        slug={event?.slug}
        value={coverImage}
        onChange={handleCoverUrl}
        onFileSelected={handleCoverFile}
        pendingPreview={coverPreview}
      />

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
          disabled={ended}
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
        <Field label='Co-hosts'>
          <CohostPicker
            value={cohosts}
            onChange={setCohosts}
            exclude={session?.username}
          />
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

function weekdayFromLocal(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'MO';
  return ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][d.getDay()];
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

// EventCoverField uploads a cover to storage once the event exists (and so has
// a slug) and writes the returned path back into the controlled value. Before
// the event exists it captures the file locally (previewed via pendingPreview)
// and defers the upload to the parent, which runs it right after creation.
function EventCoverField({
  slug,
  value,
  onChange,
  onFileSelected,
  pendingPreview,
}: {
  slug?: string;
  value: string;
  onChange: (v: string) => void;
  onFileSelected?: (file: File) => void;
  pendingPreview?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const upload = useUploadEventCover(slug || '');

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    if (slug) {
      // Event already exists: upload now and persist the returned path.
      upload.mutate(file, {
        onSuccess: (res) => res.url && onChange(res.url),
        onError: () => setError('Upload failed. Try a smaller image.'),
      });
      return;
    }
    // No slug yet: hand the file up so it uploads after the event is created.
    onFileSelected?.(file);
  };

  const previewSrc = pendingPreview || value;

  return (
    <div className='space-y-1.5'>
      <Label className='font-inter text-sm'>Cover image</Label>

      <div className='flex items-center gap-3'>
        {previewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt='Cover preview'
            className='h-16 w-28 rounded-lg border border-border-light object-cover dark:border-border-dark'
          />
        ) : (
          <div className='flex h-16 w-28 items-center justify-center rounded-lg border border-dashed border-border-light text-xs text-gray-400 dark:border-border-dark'>
            None
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={onPick}
          />
          <Button
            type='button'
            variant='secondary'
            disabled={upload.isPending}
            onClick={() => inputRef.current?.click()}
            className='min-h-[44px] gap-2'
          >
            <Icon name='RiUpload2' size={18} />
            {upload.isPending ? 'Uploading…' : 'Upload'}
          </Button>
          {!slug && (
            <span className='text-xs text-gray-400'>
              Uploads when you save the event.
            </span>
          )}
        </div>
      </div>

      <Input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='…or paste an image URL'
      />
      {error && <p className='text-xs text-brand-orange'>{error}</p>}
    </div>
  );
}

// CohostPicker adds co-hosts by @username, autocompleting against the people
// search endpoint (active users only) — the same pattern the groups surface
// uses to enroll members. Selected users show as removable chips; the parent
// receives the plain username list.
function CohostPicker({
  value,
  onChange,
  exclude,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  exclude?: string;
}) {
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(id);
  }, [term]);

  const { users, isLoading } = useSearchPeopleV2({
    query: debounced,
    limit: 6,
    enabled: open && debounced.length > 0,
  });

  const results = useMemo(
    () =>
      (users ?? []).filter(
        (u) => u.username !== exclude && !value.includes(u.username)
      ),
    [users, exclude, value]
  );

  const add = (username: string) => {
    if (!value.includes(username)) onChange([...value, username]);
    setTerm('');
    setDebounced('');
    setOpen(false);
  };

  const remove = (username: string) =>
    onChange(value.filter((u) => u !== username));

  return (
    <div className='space-y-2'>
      {value.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {value.map((u) => (
            <span
              key={u}
              className='inline-flex items-center gap-1 rounded-full bg-foreground-light/60 py-1 pl-3 pr-1 font-inter text-sm dark:bg-foreground-dark/40'
            >
              @{u}
              <button
                type='button'
                aria-label={`Remove @${u}`}
                onClick={() => remove(u)}
                className='flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10'
              >
                <Icon name='RiClose' size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className='relative'>
        <Input
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder='Search people by @username…'
          aria-label='Search people to add as co-hosts'
        />

        {open && debounced.length > 0 && (
          <div className='absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border-light bg-white shadow-lg dark:border-border-dark dark:bg-primary-monkeyBlack'>
            {isLoading ? (
              <p className='px-3 py-2 font-inter text-sm text-gray-500'>
                Searching…
              </p>
            ) : results.length === 0 ? (
              <p className='px-3 py-2 font-inter text-sm text-gray-500'>
                No matches
              </p>
            ) : (
              <ul className='max-h-64 overflow-y-auto'>
                {results.map((u) => (
                  <li key={u.account_id}>
                    <button
                      type='button'
                      onClick={() => add(u.username)}
                      className='flex min-h-[44px] w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800'
                    >
                      <ProfileFrame className='h-8 w-8'>
                        <ProfileImage username={u.username} />
                      </ProfileFrame>
                      <span className='min-w-0'>
                        <span className='block truncate font-dm_sans text-sm font-medium'>
                          @{u.username}
                        </span>
                        {(u.first_name || u.last_name) && (
                          <span className='block truncate font-inter text-xs text-gray-500'>
                            {`${u.first_name} ${u.last_name}`.trim()}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
