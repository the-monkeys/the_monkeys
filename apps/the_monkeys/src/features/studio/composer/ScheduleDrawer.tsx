'use client';

import { useEffect, useMemo, useState } from 'react';

export interface ScheduleDrawerProps {
  isOpen?: boolean;
  initialScheduledAt?: string;
  initialTimezone?: string;
  onSchedule?: (
    scheduledAtIso: string,
    timezone: string
  ) => void | Promise<void>;
  onConfirm?: (payload: {
    scheduledAt: string;
    timezone: string;
  }) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export const detectBrowserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

const getTodayDateString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const parseDateInTimezone = (
  iso?: string,
  timeZone?: string
): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || detectBrowserTimezone(),
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch {
    return d.toISOString().split('T')[0];
  }
};

export const parseTimeInTimezone = (
  iso?: string,
  timeZone?: string
): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: timeZone || detectBrowserTimezone(),
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatter.format(d);
  } catch {
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const min = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${min}`;
  }
};

function getTimezoneOffsetMs(date: Date, timeZone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? '0';

    const year = parseInt(getPart('year'), 10);
    const month = parseInt(getPart('month'), 10) - 1;
    const day = parseInt(getPart('day'), 10);
    let hour = parseInt(getPart('hour'), 10);
    if (hour === 24) hour = 0;
    const minute = parseInt(getPart('minute'), 10);
    const second = parseInt(getPart('second'), 10);

    const asUtc = Date.UTC(year, month, day, hour, minute, second);
    return asUtc - date.getTime();
  } catch {
    return 0;
  }
}

export function localDateTimeToUtcIso(
  dateStr: string,
  timeStr: string,
  timeZone: string
): string {
  const [year, month, day] = dateStr.split('-').map((v) => parseInt(v, 10));
  const [hour, minute] = timeStr.split(':').map((v) => parseInt(v, 10));

  const targetUtcEstimate = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = getTimezoneOffsetMs(new Date(targetUtcEstimate), timeZone);
  let actualUtc = targetUtcEstimate - offset;

  // Refine offset across daylight savings transitions
  const refinedOffset = getTimezoneOffsetMs(new Date(actualUtc), timeZone);
  if (refinedOffset !== offset) {
    actualUtc = targetUtcEstimate - refinedOffset;
  }
  return new Date(actualUtc).toISOString();
}

export default function ScheduleDrawer({
  isOpen = true,
  initialScheduledAt,
  initialTimezone,
  onSchedule,
  onConfirm,
  onCancel,
  isLoading = false,
  disabled = false,
}: ScheduleDrawerProps) {
  const browserTz = useMemo(() => detectBrowserTimezone(), []);
  const initialTz = initialTimezone || browserTz;

  const [date, setDate] = useState(() =>
    parseDateInTimezone(initialScheduledAt, initialTz)
  );
  const [time, setTime] = useState(() =>
    parseTimeInTimezone(initialScheduledAt, initialTz)
  );
  const [timezone, setTimezone] = useState(() => initialTz);
  const [error, setError] = useState<string | null>(null);

  const availableTimezones = useMemo(() => {
    const list = [...COMMON_TIMEZONES];
    if (browserTz && !list.includes(browserTz)) {
      list.unshift(browserTz);
    }
    if (initialTimezone && !list.includes(initialTimezone)) {
      list.unshift(initialTimezone);
    }
    return list;
  }, [browserTz, initialTimezone]);

  useEffect(() => {
    if (initialScheduledAt) {
      const tz = initialTimezone || browserTz;
      const parsedDate = parseDateInTimezone(initialScheduledAt, tz);
      const parsedTime = parseTimeInTimezone(initialScheduledAt, tz);
      if (parsedDate) setDate(parsedDate);
      if (parsedTime) setTime(parsedTime);
    }
    if (initialTimezone) {
      setTimezone(initialTimezone);
    }
  }, [initialScheduledAt, initialTimezone, browserTz]);

  if (!isOpen) {
    return null;
  }

  const minDate = getTodayDateString();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!date || !time) {
      setError('Please select both a date and time.');
      return;
    }

    let scheduledAtIso = '';
    try {
      scheduledAtIso = localDateTimeToUtcIso(date, time, timezone);
    } catch {
      setError('Please select a valid date and time.');
      return;
    }

    const targetDate = new Date(scheduledAtIso);
    if (isNaN(targetDate.getTime())) {
      setError('Please select a valid date and time.');
      return;
    }

    if (targetDate.getTime() <= Date.now()) {
      setError('Scheduled time must be in the future.');
      return;
    }

    setError(null);
    onSchedule?.(scheduledAtIso, timezone);
    onConfirm?.({ scheduledAt: scheduledAtIso, timezone });
  };

  return (
    <section
      aria-label='Schedule drawer'
      className='rounded-xl border border-brand-orange/30 bg-background-light p-5 shadow-sm dark:bg-background-dark'
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='font-newsreader text-xl font-medium'>
          {initialScheduledAt ? 'Reschedule Post' : 'Schedule Publication'}
        </h3>
        <button
          type='button'
          onClick={onCancel}
          className='text-sm text-foreground/50 hover:text-foreground'
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-3'>
          <div>
            <label
              htmlFor='schedule-date'
              className='mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70'
            >
              Date
            </label>
            <input
              id='schedule-date'
              aria-label='Schedule date'
              type='date'
              min={minDate}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError(null);
              }}
              className='w-full rounded-lg border bg-transparent p-2.5 text-sm outline-none ring-brand-orange focus:ring-2'
              required
            />
          </div>

          <div>
            <label
              htmlFor='schedule-time'
              className='mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70'
            >
              Time
            </label>
            <input
              id='schedule-time'
              aria-label='Schedule time'
              type='time'
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setError(null);
              }}
              className='w-full rounded-lg border bg-transparent p-2.5 text-sm outline-none ring-brand-orange focus:ring-2'
              required
            />
          </div>

          <div>
            <label
              htmlFor='schedule-timezone'
              className='mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70'
            >
              Timezone
            </label>
            <select
              id='schedule-timezone'
              aria-label='Schedule timezone'
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                setError(null);
              }}
              className='w-full rounded-lg border bg-transparent p-2.5 text-sm outline-none ring-brand-orange focus:ring-2'
            >
              {availableTimezones.map((tz) => (
                <option
                  key={tz}
                  value={tz}
                  className='bg-background-light dark:bg-background-dark'
                >
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p role='alert' className='text-sm text-alert-red'>
            {error}
          </p>
        )}

        <div className='flex justify-end gap-3 pt-2'>
          <button
            type='button'
            onClick={onCancel}
            className='rounded-lg border px-4 py-2 text-sm font-medium hover:bg-foreground/5'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading || disabled}
            className='rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50'
          >
            {isLoading ? 'Scheduling...' : 'Confirm schedule'}
          </button>
        </div>
      </form>
    </section>
  );
}
