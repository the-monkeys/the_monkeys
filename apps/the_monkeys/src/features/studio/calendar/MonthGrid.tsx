'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import PostActionsMenu from '@/features/studio/components/PostActionsMenu';
import type { SocialPost } from '@/features/studio/types';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import CalendarDayCell from './CalendarDayCell';
import { extractPlatforms, formatPostTime } from './CalendarPostChip';

export interface MonthGridProps {
  currentDate: Date;
  posts: SocialPost[];
  onSelectDay?: (day: Date) => void;
  onActionComplete?: () => void;
  className?: string;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MOBILE_WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function MonthGrid({
  currentDate,
  posts,
  onSelectDay,
  onActionComplete,
  className = '',
}: MonthGridProps) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Date>(
    () => currentDate || new Date()
  );

  useEffect(() => {
    if (currentDate) {
      setSelectedDay(currentDate);
    }
  }, [currentDate]);

  // Compute 35 or 42 calendar days for desktop and mobile views
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Helper to filter posts matching a day using isSameDay(parseISO(post.scheduled_at), day)
  const getPostsForDay = (day: Date): SocialPost[] => {
    return posts.filter((post) => {
      if (!post.scheduled_at) return false;
      try {
        const postDate =
          typeof post.scheduled_at === 'string'
            ? parseISO(post.scheduled_at)
            : new Date(post.scheduled_at);
        return isSameDay(postDate, day);
      } catch {
        return false;
      }
    });
  };

  const handleSelectDay = (day: Date) => {
    setSelectedDay(day);
    onSelectDay?.(day);
  };

  const selectedDayPosts = useMemo(
    () => getPostsForDay(selectedDay),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posts, selectedDay]
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop View (hidden md:block) */}
      <div className='hidden md:block overflow-hidden rounded-xl border border-border/70 bg-background-light shadow-xs dark:bg-background-dark'>
        {/* 7 Column Headers (Mon - Sun) */}
        <div className='grid grid-cols-7 border-b border-border/60 bg-foreground-light/40 dark:bg-foreground-dark/40'>
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className='py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-foreground/60'
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* 35 or 42 Day Cells */}
        <div className='grid grid-cols-7 border-l border-t border-border/60'>
          {calendarDays.map((day) => {
            const dayPosts = getPostsForDay(day);
            const isSelected = isSameDay(day, selectedDay);

            return (
              <CalendarDayCell
                key={day.toISOString()}
                day={day}
                currentDate={currentDate}
                posts={dayPosts}
                isSelected={isSelected}
                onClick={handleSelectDay}
                onActionComplete={onActionComplete}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile Agenda View (block md:hidden) */}
      <div
        data-testid='mobile-agenda-view'
        className='block md:hidden space-y-4'
      >
        {/* Top: Compact Date Matrix Selector */}
        <div className='rounded-xl border border-border/70 bg-background-light p-3 shadow-xs dark:bg-background-dark'>
          {/* Weekday headers */}
          <div className='grid grid-cols-7 gap-1 text-center mb-1.5'>
            {MOBILE_WEEKDAYS.map((wd, i) => (
              <span
                key={`${wd}-${i}`}
                className='text-[11px] font-semibold text-foreground/50 uppercase'
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Matrix days */}
          <div className='grid grid-cols-7 gap-1'>
            {calendarDays.map((day) => {
              const dayPosts = getPostsForDay(day);
              const dateStr = format(day, 'yyyy-MM-dd');
              const isSelected = isSameDay(day, selectedDay);
              const inCurrentMonth = isSameMonth(day, currentDate);
              const dayIsToday = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  type='button'
                  data-testid={`mobile-matrix-day-${dateStr}`}
                  onClick={() => handleSelectDay(day)}
                  className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-medium transition ${
                    isSelected
                      ? 'bg-brand-orange text-white font-semibold shadow-xs'
                      : dayIsToday
                        ? 'text-brand-orange font-bold hover:bg-brand-orange/10'
                        : !inCurrentMonth
                          ? 'text-foreground/30 hover:bg-foreground-light/30 dark:hover:bg-foreground-dark/30'
                          : 'text-foreground/80 hover:bg-foreground-light/50 dark:hover:bg-foreground-dark/50'
                  }`}
                >
                  <span>{format(day, 'd')}</span>

                  {/* Indicator dot if day has scheduled posts */}
                  {dayPosts.length > 0 ? (
                    <span
                      data-testid={`agenda-day-dot-${dateStr}`}
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
        </div>

        {/* Bottom: Day Agenda List */}
        <div className='space-y-3'>
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

          {selectedDayPosts.length === 0 ? (
            /* Empty State */
            <div className='rounded-xl border border-dashed border-border/80 bg-background-light/50 p-6 text-center dark:bg-background-dark/50'>
              <p className='text-sm text-foreground/60 mb-3'>
                No scheduled posts for this day.
              </p>
              <Link
                href={`/studio/compose?date=${format(selectedDay, 'yyyy-MM-dd')}`}
                className='inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-orange/90'
              >
                + Schedule on this day
              </Link>
            </div>
          ) : (
            /* Active Day Scheduled Posts List */
            <div className='space-y-2'>
              {selectedDayPosts.map((post) => {
                const platforms = extractPlatforms(post);
                const formattedTime = formatPostTime(post.scheduled_at);

                return (
                  <div
                    key={post.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => router.push(`/studio/compose/${post.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/studio/compose/${post.id}`);
                      }
                    }}
                    className='group flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background-light p-3.5 shadow-xs transition hover:border-border hover:shadow cursor-pointer dark:bg-background-dark'
                  >
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        {formattedTime && (
                          <span className='inline-flex items-center rounded bg-brand-orange/10 px-1.5 py-0.5 text-[11px] font-semibold text-brand-orange'>
                            {formattedTime}
                          </span>
                        )}
                        {platforms.map((p) => (
                          <span
                            key={p}
                            className='text-[10px] font-medium uppercase text-foreground/60 border border-border/60 rounded px-1'
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                      <p className='line-clamp-3 text-sm font-medium text-foreground/90'>
                        {post.base_text || post.text || 'Untitled post'}
                      </p>
                    </div>

                    <div
                      className='shrink-0'
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <PostActionsMenu
                        post={post}
                        onActionComplete={onActionComplete}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
