'use client';

import React from 'react';

import Link from 'next/link';

import type { SocialPost } from '@/features/studio/types';
import { format, isSameDay, isToday } from 'date-fns';

import WeekPostCard from './WeekPostCard';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHourAxis(hour: number): string {
  const d = new Date(2000, 0, 1, hour, 0, 0);
  return format(d, 'h a');
}

export interface MobileWeekViewProps {
  daysOfWeek: Date[];
  selectedDay: Date;
  currentTimePercent: number;
  onSelectDay: (day: Date) => void;
  getPostsForDay: (day: Date) => SocialPost[];
  getPostsForDayAndHour: (day: Date, hour: number) => SocialPost[];
  handleEmptySlotClick: (day: Date, hour: number) => void;
  onActionComplete?: () => void;
}

export default function MobileWeekView({
  daysOfWeek,
  selectedDay,
  currentTimePercent,
  onSelectDay,
  getPostsForDay,
  getPostsForDayAndHour,
  handleEmptySlotClick,
  onActionComplete,
}: MobileWeekViewProps) {
  return (
    <div data-testid='mobile-week-view' className='block md:hidden space-y-3'>
      {/* Horizontal Day Tab Bar */}
      <div className='grid grid-cols-7 gap-1 rounded-xl border border-border/70 bg-background-light p-2 shadow-xs dark:bg-background-dark'>
        {daysOfWeek.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = isSameDay(day, selectedDay);
          const dayIsToday = isToday(day);
          const dayPosts = getPostsForDay(day);

          return (
            <button
              key={day.toISOString()}
              type='button'
              data-testid={`mobile-day-tab-${dateStr}`}
              onClick={() => onSelectDay(day)}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-medium transition ${
                isSelected
                  ? 'bg-brand-orange text-white font-semibold shadow-xs'
                  : dayIsToday
                    ? 'text-brand-orange font-bold hover:bg-brand-orange/10'
                    : 'text-foreground/80 hover:bg-foreground-light/50 dark:hover:bg-foreground-dark/50'
              }`}
            >
              <span className='text-[10px] font-semibold uppercase'>
                {format(day, 'EEE')}
              </span>
              <span className='text-xs'>{format(day, 'd')}</span>

              {/* Scheduled post indicator dot */}
              {dayPosts.length > 0 ? (
                <span
                  className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-brand-orange'
                  }`}
                />
              ) : (
                <span className='mt-0.5 h-1.5 w-1.5' />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Info & Timeline Header */}
      <div className='flex items-center justify-between px-1'>
        <h3 className='text-sm font-semibold text-foreground/90'>
          {format(selectedDay, 'EEEE, MMMM d, yyyy')}
        </h3>
        <Link
          href={`/studio/compose?date=${format(selectedDay, 'yyyy-MM-dd')}`}
          className='text-xs font-medium text-brand-orange hover:underline'
        >
          + Schedule
        </Link>
      </div>

      {/* Single Day 24-Hour Vertical Timeline */}
      <div className='relative rounded-xl border border-border/70 bg-background-light overflow-hidden shadow-xs dark:bg-background-dark'>
        {/* Mobile Live Time Indicator */}
        {isToday(selectedDay) && (
          <div
            data-testid='mobile-current-time-indicator'
            className='absolute left-14 right-0 z-20 pointer-events-none flex items-center'
            style={{ top: `${currentTimePercent}%` }}
          >
            <span className='h-2 w-2 -ml-1 rounded-full bg-brand-orange ring-2 ring-background-light dark:ring-background-dark' />
            <div className='h-[2px] w-full bg-brand-orange shadow-xs' />
          </div>
        )}

        <div className='flex flex-col'>
          {HOURS.map((hour) => {
            const dateStr = format(selectedDay, 'yyyy-MM-dd');
            const hourPosts = getPostsForDayAndHour(selectedDay, hour);

            return (
              <div
                key={hour}
                className='flex border-b border-border/40 last:border-b-0'
              >
                {/* Left hour axis */}
                <div className='w-14 shrink-0 border-r border-border/40 p-2 text-right text-[11px] font-medium text-foreground/50 select-none'>
                  {formatHourAxis(hour)}
                </div>

                {/* Hourly slot */}
                <div
                  role='button'
                  tabIndex={0}
                  aria-label={`Schedule post for ${format(selectedDay, 'MMM d')} at ${formatHourAxis(hour)}`}
                  data-testid={`mobile-hour-slot-${dateStr}-${hour}`}
                  data-date={dateStr}
                  data-hour={hour}
                  onClick={() => handleEmptySlotClick(selectedDay, hour)}
                  onKeyDown={(e) => {
                    if (
                      e.target === e.currentTarget &&
                      (e.key === 'Enter' || e.key === ' ')
                    ) {
                      e.preventDefault();
                      handleEmptySlotClick(selectedDay, hour);
                    }
                  }}
                  className='flex-1 min-h-[56px] p-2 transition-colors hover:bg-foreground-light/20 focus:outline-none focus:ring-1 focus:ring-brand-orange dark:hover:bg-foreground-dark/20 cursor-pointer space-y-1.5'
                >
                  {hourPosts.map((post) => (
                    <WeekPostCard
                      key={post.id}
                      post={post}
                      onActionComplete={onActionComplete}
                      testIdPrefix='mobile-week-post-card'
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
