'use client';

import React from 'react';

import type { SocialPost } from '@/features/studio/types';
import { format, isSameDay, isToday } from 'date-fns';

import WeekPostCard from './WeekPostCard';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHourAxis(hour: number): string {
  const d = new Date(2000, 0, 1, hour, 0, 0);
  return format(d, 'h a');
}

export interface DesktopWeekTimelineProps {
  daysOfWeek: Date[];
  selectedDay: Date;
  currentTimePercent: number;
  onSelectDay: (day: Date) => void;
  getPostsForDayAndHour: (day: Date, hour: number) => SocialPost[];
  handleEmptySlotClick: (day: Date, hour: number) => void;
  onActionComplete?: () => void;
}

export default function DesktopWeekTimeline({
  daysOfWeek,
  selectedDay,
  currentTimePercent,
  onSelectDay,
  getPostsForDayAndHour,
  handleEmptySlotClick,
  onActionComplete,
}: DesktopWeekTimelineProps) {
  return (
    <div
      data-testid='desktop-week-view'
      className='hidden md:block rounded-xl border border-border/70 bg-background-light shadow-xs dark:bg-background-dark overflow-hidden'
    >
      {/* Sticky Header: 7 Day Columns */}
      <div className='sticky top-0 z-10 border-b border-border/60 bg-background-light/95 backdrop-blur-xs dark:bg-background-dark/95'>
        <div className='grid grid-cols-7 ml-16'>
          {daysOfWeek.map((day) => {
            const isSelected = isSameDay(day, selectedDay);
            const dayIsToday = isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => onSelectDay(day)}
                className={`flex flex-col items-center justify-center py-2 border-r border-border/60 last:border-r-0 cursor-pointer transition hover:bg-foreground-light/30 dark:hover:bg-foreground-dark/30 ${
                  isSelected
                    ? 'bg-foreground-light/50 dark:bg-foreground-dark/50'
                    : ''
                }`}
              >
                <span className='text-[11px] font-semibold uppercase tracking-wider text-foreground/60'>
                  {format(day, 'EEE')}
                </span>
                <span
                  className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    dayIsToday
                      ? 'bg-brand-orange text-white shadow-xs'
                      : 'text-foreground/90'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Body: Time axis + 7 Columns */}
      <div className='flex'>
        {/* Left 24-hour time axis */}
        <div className='w-16 shrink-0 border-r border-border/60 select-none'>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className='min-h-[5rem] border-b border-border/40 pr-2 pt-1 text-right text-[11px] font-medium text-foreground/50'
            >
              {formatHourAxis(hour)}
            </div>
          ))}
        </div>

        {/* 7 Day Columns with 24 hourly cells each */}
        <div className='grid grid-cols-7 flex-1'>
          {daysOfWeek.map((day) => {
            const dayIsToday = isToday(day);
            const dateStr = format(day, 'yyyy-MM-dd');

            return (
              <div
                key={day.toISOString()}
                data-testid={`desktop-day-column-${dateStr}`}
                data-date={dateStr}
                className='relative flex flex-col border-r border-border/60 last:border-r-0'
              >
                {/* Live time indicator across today's column */}
                {dayIsToday && (
                  <div
                    data-testid='current-time-indicator'
                    className='absolute left-0 right-0 z-20 pointer-events-none flex items-center'
                    style={{ top: `${currentTimePercent}%` }}
                  >
                    <span className='h-2.5 w-2.5 -ml-1 rounded-full bg-brand-orange ring-2 ring-background-light dark:ring-background-dark' />
                    <div className='h-[2px] w-full bg-brand-orange shadow-xs' />
                  </div>
                )}

                {/* 24 Hour Slots */}
                {HOURS.map((hour) => {
                  const hourPosts = getPostsForDayAndHour(day, hour);

                  return (
                    <div
                      key={hour}
                      role='button'
                      tabIndex={0}
                      aria-label={`Schedule post for ${format(day, 'MMM d')} at ${formatHourAxis(hour)}`}
                      data-testid={`desktop-hour-slot-${dateStr}-${hour}`}
                      data-date={dateStr}
                      data-hour={hour}
                      onClick={() => handleEmptySlotClick(day, hour)}
                      onKeyDown={(e) => {
                        if (
                          e.target === e.currentTarget &&
                          (e.key === 'Enter' || e.key === ' ')
                        ) {
                          e.preventDefault();
                          handleEmptySlotClick(day, hour);
                        }
                      }}
                      className='group relative min-h-[5rem] border-b border-border/40 p-1 transition-colors hover:bg-foreground-light/20 focus:outline-none focus:ring-1 focus:ring-brand-orange dark:hover:bg-foreground-dark/20 cursor-pointer space-y-1'
                    >
                      {hourPosts.map((post) => (
                        <WeekPostCard
                          key={post.id}
                          post={post}
                          onActionComplete={onActionComplete}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
