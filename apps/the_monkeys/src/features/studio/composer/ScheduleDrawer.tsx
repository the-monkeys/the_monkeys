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

const COMMON_TIMEZONES = [
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

const detectBrowserTimezone = (): string => {
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

const parseDateString = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const parseTimeString = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
};

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
  const [date, setDate] = useState(() => parseDateString(initialScheduledAt));
  const [time, setTime] = useState(() => parseTimeString(initialScheduledAt));
  const [timezone, setTimezone] = useState(() => initialTimezone || browserTz);
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
      const parsedDate = parseDateString(initialScheduledAt);
      const parsedTime = parseTimeString(initialScheduledAt);
      if (parsedDate) setDate(parsedDate);
      if (parsedTime) setTime(parsedTime);
    }
    if (initialTimezone) {
      setTimezone(initialTimezone);
    }
  }, [initialScheduledAt, initialTimezone]);

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

    const targetDate = new Date(`${date}T${time}`);
    if (isNaN(targetDate.getTime())) {
      setError('Please select a valid date and time.');
      return;
    }

    if (targetDate.getTime() <= Date.now()) {
      setError('Scheduled time must be in the future.');
      return;
    }

    setError(null);
    const scheduledAtIso = targetDate.toISOString();
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

      <form onSubmit={handleSubmit} className='space-y-4'>
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
            onClick={handleSubmit}
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
