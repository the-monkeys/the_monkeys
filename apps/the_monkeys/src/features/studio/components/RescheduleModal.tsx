'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  COMMON_TIMEZONES,
  detectBrowserTimezone,
  localDateTimeToUtcIso,
  parseDateInTimezone,
  parseTimeInTimezone,
} from '@/features/studio/composer/ScheduleDrawer';
import type { SocialPost } from '@/features/studio/types';
import { useSocialPostMutations } from '@/hooks/studio/useSocialPosts';

export interface RescheduleModalProps {
  isOpen: boolean;
  post: SocialPost;
  onClose: () => void;
  onSuccess?: () => void;
}

const getTodayDateString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function RescheduleModal({
  isOpen,
  post,
  onClose,
  onSuccess,
}: RescheduleModalProps) {
  const mutations = useSocialPostMutations();
  const schedule = mutations?.schedule;

  const browserTz = useMemo(() => detectBrowserTimezone(), []);
  const initialTz = post.schedule_timezone || browserTz || 'UTC';

  const [date, setDate] = useState(() =>
    parseDateInTimezone(post.scheduled_at, initialTz)
  );
  const [time, setTime] = useState(() =>
    parseTimeInTimezone(post.scheduled_at, initialTz)
  );
  const [timezone, setTimezone] = useState(() => initialTz);
  const [error, setError] = useState<string | null>(null);

  const availableTimezones = useMemo(() => {
    const list = [...(COMMON_TIMEZONES || ['UTC'])];
    if (browserTz && !list.includes(browserTz)) {
      list.unshift(browserTz);
    }
    if (post.schedule_timezone && !list.includes(post.schedule_timezone)) {
      list.unshift(post.schedule_timezone);
    }
    return list;
  }, [browserTz, post.schedule_timezone]);

  useEffect(() => {
    if (isOpen) {
      const tz = post.schedule_timezone || browserTz || 'UTC';
      setTimezone(tz);
      setDate(parseDateInTimezone(post.scheduled_at, tz));
      setTime(parseTimeInTimezone(post.scheduled_at, tz));
      setError(null);
    }
  }, [isOpen, post.scheduled_at, post.schedule_timezone, browserTz]);

  const modalRef = useRef<HTMLDivElement>(null);

  // Restore focus on unmount
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => {
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  // Escape key handler & focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (
            document.activeElement === last ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initial focus inside modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput =
        modalRef.current.querySelector<HTMLElement>('input, button');
      firstInput?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const minDate = getTodayDateString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    try {
      await schedule?.mutateAsync({
        id: post.id,
        input: {
          scheduled_at: scheduledAtIso,
          schedule_timezone: timezone,
          expected_version: post.version,
        },
        reschedule: true,
      });
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Failed to reschedule post.';
      setError(message);
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='reschedule-modal-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className='w-full max-w-md rounded-2xl border bg-background-light p-6 shadow-xl dark:bg-background-dark'
      >
        <div className='mb-4 flex items-center justify-between'>
          <h3
            id='reschedule-modal-title'
            className='font-newsreader text-2xl font-medium'
          >
            Reschedule Post
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='text-sm text-foreground/50 hover:text-foreground'
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='reschedule-date'
                className='mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70'
              >
                Date
              </label>
              <input
                id='reschedule-date'
                aria-label='Date'
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
                htmlFor='reschedule-time'
                className='mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70'
              >
                Time
              </label>
              <input
                id='reschedule-time'
                aria-label='Time'
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
          </div>

          <div>
            <label
              htmlFor='reschedule-timezone'
              className='mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70'
            >
              Timezone
            </label>
            <select
              id='reschedule-timezone'
              aria-label='Timezone'
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                setError(null);
              }}
              className='w-full rounded-lg border bg-background-light p-2.5 text-sm outline-none ring-brand-orange focus:ring-2 dark:bg-background-dark'
            >
              {availableTimezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className='text-xs font-medium text-red-500' role='alert'>
              {error}
            </p>
          )}

          <div className='flex items-center justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-lg border px-4 py-2 text-sm font-medium hover:bg-foreground-light/50 dark:hover:bg-foreground-dark/50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={Boolean(schedule?.isPending)}
              className='rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50'
            >
              {schedule?.isPending ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
