'use client';

import React, { useMemo, useState } from 'react';

import { useSocialCalendar } from '@/hooks/studio/useSocialPosts';
import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';

import CalendarToolbar, { type CalendarViewMode } from './CalendarToolbar';
import MonthGrid from './MonthGrid';
import WeekGrid from './WeekGrid';

export interface CalendarViewProps {
  initialDate?: Date;
  initialViewMode?: CalendarViewMode;
  timezone?: string;
  className?: string;
}

export default function CalendarView({
  initialDate,
  initialViewMode = 'month',
  timezone,
  className = '',
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(
    () => initialDate ?? new Date()
  );
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialViewMode);

  // Compute date range for useSocialCalendar
  const { from, to } = useMemo(() => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const start = startOfWeek(monthStart, { weekStartsOn: 1 });
      const end = endOfWeek(monthEnd, { weekStartsOn: 1 });
      return { from: start.toISOString(), to: end.toISOString() };
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return { from: start.toISOString(), to: end.toISOString() };
    }
  }, [currentDate, viewMode]);

  const { data, isLoading, isError, refetch } = useSocialCalendar({
    from,
    to,
    page_size: 100,
  });

  const posts = data?.items ?? data?.posts ?? [];

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Calendar Toolbar */}
      <CalendarToolbar
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        timezone={timezone}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div
          data-testid='calendar-skeleton'
          role='status'
          aria-label='Loading calendar'
          className='animate-pulse rounded-xl border border-border/70 bg-background-light p-6 shadow-xs dark:bg-background-dark'
        >
          <div className='mb-4 grid grid-cols-7 gap-2'>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className='h-4 rounded bg-foreground/10' />
            ))}
          </div>
          <div className='grid grid-cols-7 gap-2'>
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className='h-24 rounded-lg border border-border/30 bg-foreground/5 p-2'
              >
                <div className='h-3 w-4 rounded bg-foreground/10' />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div
          data-testid='calendar-error'
          className='rounded-xl border border-alert-red/30 bg-alert-red/5 p-6 text-center'
        >
          <p className='text-sm font-medium text-alert-red'>
            Unable to load calendar posts.
          </p>
          <button
            type='button'
            onClick={() => refetch()}
            className='mt-2 text-xs font-semibold text-brand-orange hover:underline'
          >
            Try again
          </button>
        </div>
      )}

      {/* Active Calendar Grid */}
      {!isLoading && !isError && (
        <>
          {viewMode === 'month' ? (
            <MonthGrid
              currentDate={currentDate}
              posts={posts}
              onSelectDay={(day) => setCurrentDate(day)}
              onActionComplete={() => refetch()}
            />
          ) : (
            <WeekGrid
              currentDate={currentDate}
              posts={posts}
              onSelectDay={(day) => setCurrentDate(day)}
              onActionComplete={() => refetch()}
            />
          )}
        </>
      )}
    </div>
  );
}
