'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import PostActionsMenu from '@/features/studio/components/PostActionsMenu';
import type { SocialPlatform, SocialPost } from '@/features/studio/types';
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
} from 'date-fns';

import {
  PlatformIcon,
  extractPlatforms,
  formatPostTime,
} from './CalendarPostChip';

export interface WeekGridProps {
  currentDate: Date;
  posts: SocialPost[];
  onSelectDay?: (day: Date) => void;
  onActionComplete?: () => void;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHourAxis(hour: number): string {
  const d = new Date(2000, 0, 1, hour, 0, 0);
  return format(d, 'h a');
}

function WeekPostCard({
  post,
  onActionComplete,
  testIdPrefix = 'week-post-card',
}: {
  post: SocialPost;
  onActionComplete?: () => void;
  testIdPrefix?: string;
}) {
  const router = useRouter();
  const platforms = extractPlatforms(post);
  const formattedTime = formatPostTime(post.scheduled_at);
  const postText = post.base_text || post.text || 'Untitled post';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/studio/compose/${post.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/studio/compose/${post.id}`);
    }
  };

  return (
    <div
      role='button'
      tabIndex={0}
      data-testid={`${testIdPrefix}-${post.id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className='group/card relative focus-within:z-30 flex flex-col gap-1 rounded-lg border border-border/70 bg-background-light p-2 text-xs shadow-xs transition hover:border-brand-orange/60 hover:shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-orange dark:bg-background-dark'
    >
      <div className='flex items-center justify-between gap-1'>
        <div className='flex items-center gap-1.5 min-w-0'>
          {/* Platform icons */}
          <div className='flex shrink-0 items-center gap-0.5'>
            {platforms.length > 0 ? (
              platforms.map((p) => <PlatformIcon key={p} platform={p} />)
            ) : (
              <PlatformIcon platform='x' />
            )}
          </div>

          {/* Time pill */}
          {formattedTime && (
            <span className='inline-flex shrink-0 items-center rounded bg-brand-orange/10 px-1 py-0.5 text-[10px] font-semibold text-brand-orange'>
              {formattedTime}
            </span>
          )}
        </div>

        {/* 3-dot PostActionsMenu trigger */}
        <div
          className='shrink-0'
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <PostActionsMenu
            post={post}
            onActionComplete={onActionComplete}
            className='scale-85 origin-right'
          />
        </div>
      </div>

      {/* Snippet */}
      <p className='line-clamp-2 text-xs font-medium text-foreground/90 break-words'>
        {postText}
      </p>
    </div>
  );
}

export function WeekGrid({
  currentDate,
  posts,
  onSelectDay,
  onActionComplete,
  className = '',
}: WeekGridProps) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Date>(
    () => currentDate || new Date()
  );
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (currentDate) {
      setSelectedDay(currentDate);
    }
  }, [currentDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Live time position percentage in 24-hour day (0 - 100%)
  const currentTimePercent = useMemo(() => {
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return (totalMinutes / (24 * 60)) * 100;
  }, [now]);

  // Compute 7 days of the active week (Monday start)
  const daysOfWeek = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  // Group posts by date and by date+hour in a single pass
  const { postsByDate, postsByDateAndHour } = useMemo(() => {
    const byDate = new Map<string, SocialPost[]>();
    const byDateAndHour = new Map<string, SocialPost[]>();

    for (const post of posts) {
      if (!post.scheduled_at) continue;
      try {
        const postDate =
          typeof post.scheduled_at === 'string'
            ? parseISO(post.scheduled_at)
            : new Date(post.scheduled_at);
        if (isNaN(postDate.getTime())) continue;

        const dateKey = format(postDate, 'yyyy-MM-dd');
        const hourKey = `${dateKey}-${postDate.getHours()}`;

        const existingDate = byDate.get(dateKey);
        if (existingDate) {
          existingDate.push(post);
        } else {
          byDate.set(dateKey, [post]);
        }

        const existingHour = byDateAndHour.get(hourKey);
        if (existingHour) {
          existingHour.push(post);
        } else {
          byDateAndHour.set(hourKey, [post]);
        }
      } catch {
        // ignore unparseable
      }
    }
    return { postsByDate: byDate, postsByDateAndHour: byDateAndHour };
  }, [posts]);

  const getPostsForDayAndHour = useCallback(
    (day: Date, hour: number): SocialPost[] => {
      const key = `${format(day, 'yyyy-MM-dd')}-${hour}`;
      return postsByDateAndHour.get(key) || [];
    },
    [postsByDateAndHour]
  );

  const getPostsForDay = useCallback(
    (day: Date): SocialPost[] => {
      const key = format(day, 'yyyy-MM-dd');
      return postsByDate.get(key) || [];
    },
    [postsByDate]
  );

  const handleSelectDay = (day: Date) => {
    setSelectedDay(day);
    onSelectDay?.(day);
  };

  const handleEmptySlotClick = (day: Date, hour: number) => {
    const hourStr = String(hour).padStart(2, '0');
    const dateStr = format(day, 'yyyy-MM-dd');
    router.push(`/studio/compose?date=${dateStr}T${hourStr}:00:00`);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* ========================================================================= */}
      {/* Desktop Week Grid (>= 768px) */}
      {/* ========================================================================= */}
      <div
        data-testid='desktop-week-view'
        className='hidden md:block overflow-x-auto rounded-xl border border-border/70 bg-background-light shadow-xs dark:bg-background-dark'
      >
        <div className='min-w-[720px]'>
          {/* Header Row: time spacer + 7 day columns */}
          <div className='sticky top-0 z-20 flex border-b border-border/70 bg-foreground-light/40 backdrop-blur-xs dark:bg-foreground-dark/40'>
            {/* Time axis spacer */}
            <div className='w-16 shrink-0 border-r border-border/60 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-foreground/50'>
              Time
            </div>

            {/* 7 Day Column Headers */}
            <div className='grid grid-cols-7 flex-1'>
              {daysOfWeek.map((day) => {
                const dayIsToday = isToday(day);
                const isSelected = isSameDay(day, selectedDay);

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleSelectDay(day)}
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
      </div>

      {/* ========================================================================= */}
      {/* Mobile Week Grid (< 768px) */}
      {/* ========================================================================= */}
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
                onClick={() => handleSelectDay(day)}
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
    </div>
  );
}

export default WeekGrid;
