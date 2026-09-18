'use client';

import React, { useMemo } from 'react';

import Link from 'next/link';

import { endOfWeek, format, startOfWeek } from 'date-fns';

export type CalendarViewMode = 'month' | 'week';

export interface CalendarToolbarProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  timezone?: string;
  className?: string;
}

export default function CalendarToolbar({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  timezone,
  className = '',
}: CalendarToolbarProps) {
  const activeTimezone = useMemo(() => {
    if (timezone) return timezone;
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  }, [timezone]);

  const headingText = useMemo(() => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    }

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    if (weekStart.getFullYear() !== weekEnd.getFullYear()) {
      return `${format(weekStart, 'MMM d, yyyy')} – ${format(weekEnd, 'MMM d, yyyy')}`;
    }

    return `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;
  }, [currentDate, viewMode]);

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      {/* Left: Dynamic heading + Prev/Today/Next Navigation */}
      <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
        <h2
          data-testid='calendar-heading'
          className='font-newsreader text-2xl font-medium text-foreground sm:text-3xl tracking-tight'
        >
          {headingText}
        </h2>

        <div className='inline-flex items-center rounded-xl border border-border/70 bg-background-light p-0.5 shadow-xs dark:bg-background-dark'>
          <button
            type='button'
            onClick={onPrev}
            aria-label='Previous'
            className='rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-foreground-light/50 dark:hover:bg-foreground-dark/50 transition'
          >
            ‹ Prev
          </button>
          <button
            type='button'
            onClick={onToday}
            aria-label='Today'
            className='border-x border-border/50 px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-foreground-light/50 dark:hover:bg-foreground-dark/50 transition'
          >
            Today
          </button>
          <button
            type='button'
            onClick={onNext}
            aria-label='Next'
            className='rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-foreground-light/50 dark:hover:bg-foreground-dark/50 transition'
          >
            Next ›
          </button>
        </div>
      </div>

      {/* Right: Timezone Pill + Segmented View Toggle + + New Post Link */}
      <div className='flex flex-wrap items-center gap-2.5 sm:gap-3'>
        <span
          data-testid='calendar-timezone'
          className='inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-foreground-light/30 px-2.5 py-1 text-xs font-medium text-foreground/70 dark:bg-foreground-dark/30'
          title={`Timezone: ${activeTimezone}`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3.5 w-3.5 opacity-70'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.5}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>{activeTimezone}</span>
        </span>

        {/* Segmented toggle: Month vs Week */}
        <div
          role='group'
          className='inline-flex rounded-xl border border-border/70 bg-foreground-light/30 p-0.5 dark:bg-foreground-dark/30'
          aria-label='Calendar view mode'
        >
          <button
            type='button'
            aria-pressed={viewMode === 'month'}
            onClick={() => onViewModeChange('month')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'month'
                ? 'bg-background-light text-foreground shadow-xs dark:bg-background-dark'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            Month
          </button>
          <button
            type='button'
            aria-pressed={viewMode === 'week'}
            onClick={() => onViewModeChange('week')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'week'
                ? 'bg-background-light text-foreground shadow-xs dark:bg-background-dark'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            Week
          </button>
        </div>

        {/* + New Post link button */}
        <Link
          href='/studio/compose'
          className='inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-orange px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-orange/90'
        >
          + New Post
        </Link>
      </div>
    </div>
  );
}
