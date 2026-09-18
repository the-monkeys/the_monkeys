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

import { extractPlatforms, formatPostTime } from './CalendarPostChip';

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

function PlatformIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();

  switch (p) {
    case 'x':
    case 'twitter':
      return (
        <svg
          className='h-3 w-3 shrink-0 text-foreground/80'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
        >
          <title>X</title>
          <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
        </svg>
      );
    case 'linkedin':
      return (
        <svg
          className='h-3 w-3 shrink-0 text-[#0a66c2]'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
        >
          <title>LinkedIn</title>
          <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 0 0-1.63 1.64 1.64 1.64 0 0 0 1.63 1.64 1.64 1.64 0 0 0 1.64-1.64 1.64 1.64 0 0 0-1.64-1.64Z' />
        </svg>
      );
    case 'instagram':
      return (
        <svg
          className='h-3 w-3 shrink-0 text-[#E1306C]'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
        >
          <title>Instagram</title>
          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
        </svg>
      );
    case 'facebook':
      return (
        <svg
          className='h-3 w-3 shrink-0 text-[#1877f2]'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
        >
          <title>Facebook</title>
          <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
        </svg>
      );
    case 'youtube':
      return (
        <svg
          className='h-3 w-3 shrink-0 text-[#ff0000]'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
        >
          <title>YouTube</title>
          <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
        </svg>
      );
    case 'tiktok':
      return (
        <svg
          className='h-3 w-3 shrink-0 text-foreground/80'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
        >
          <title>TikTok</title>
          <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.49V8.69a8.18 8.18 0 0 0 4.91 1.63V6.87a4.84 4.84 0 0 1-1-.18z' />
        </svg>
      );
    default:
      return (
        <span
          title={platform}
          className='inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-xs bg-foreground-light text-[9px] font-bold uppercase text-foreground/70 dark:bg-foreground-dark'
        >
          {platform.slice(0, 1)}
        </span>
      );
  }
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
      className='group/card relative flex flex-col gap-1 rounded-lg border border-border/70 bg-background-light p-2 text-xs shadow-xs transition hover:border-brand-orange/60 hover:shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-orange dark:bg-background-dark'
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

  // Group posts by date (yyyy-MM-dd)
  const postsByDate = useMemo(() => {
    const map = new Map<string, SocialPost[]>();
    for (const post of posts) {
      if (!post.scheduled_at) continue;
      try {
        const postDate =
          typeof post.scheduled_at === 'string'
            ? parseISO(post.scheduled_at)
            : new Date(post.scheduled_at);
        if (isNaN(postDate.getTime())) continue;
        const key = format(postDate, 'yyyy-MM-dd');
        const existing = map.get(key);
        if (existing) {
          existing.push(post);
        } else {
          map.set(key, [post]);
        }
      } catch {
        // ignore unparseable
      }
    }
    return map;
  }, [posts]);

  // Group posts by date and hour (yyyy-MM-dd-H)
  const postsByDateAndHour = useMemo(() => {
    const map = new Map<string, SocialPost[]>();
    for (const post of posts) {
      if (!post.scheduled_at) continue;
      try {
        const postDate =
          typeof post.scheduled_at === 'string'
            ? parseISO(post.scheduled_at)
            : new Date(post.scheduled_at);
        if (isNaN(postDate.getTime())) continue;
        const key = `${format(postDate, 'yyyy-MM-dd')}-${postDate.getHours()}`;
        const existing = map.get(key);
        if (existing) {
          existing.push(post);
        } else {
          map.set(key, [post]);
        }
      } catch {
        // ignore unparseable
      }
    }
    return map;
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
                  className='h-16 border-b border-border/40 pr-2 pt-1 text-right text-[11px] font-medium text-foreground/50'
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
                          data-testid={`desktop-hour-slot-${dateStr}-${hour}`}
                          data-date={dateStr}
                          data-hour={hour}
                          onClick={() => handleEmptySlotClick(day, hour)}
                          className='group relative h-16 border-b border-border/40 p-1 transition-colors hover:bg-foreground-light/20 dark:hover:bg-foreground-dark/20 cursor-pointer overflow-y-auto space-y-1'
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
                    data-testid={`mobile-hour-slot-${dateStr}-${hour}`}
                    data-date={dateStr}
                    data-hour={hour}
                    onClick={() => handleEmptySlotClick(selectedDay, hour)}
                    className='flex-1 min-h-[56px] p-2 transition-colors hover:bg-foreground-light/20 dark:hover:bg-foreground-dark/20 cursor-pointer space-y-1.5'
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
