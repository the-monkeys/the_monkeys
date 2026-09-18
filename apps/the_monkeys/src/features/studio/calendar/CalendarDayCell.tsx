'use client';

import React from 'react';

import Link from 'next/link';

import type { SocialPost } from '@/features/studio/types';
import { format, isSameMonth, isToday } from 'date-fns';

import CalendarPostChip from './CalendarPostChip';

export interface CalendarDayCellProps {
  day: Date;
  currentDate: Date;
  posts: SocialPost[];
  isSelected?: boolean;
  onClick?: (day: Date) => void;
  onActionComplete?: () => void;
  className?: string;
}

export default function CalendarDayCell({
  day,
  currentDate,
  posts,
  isSelected = false,
  onClick,
  onActionComplete,
  className = '',
}: CalendarDayCellProps) {
  const isCurrentMonth = isSameMonth(day, currentDate);
  const isCurrentDay = isToday(day);
  const dateStr = format(day, 'yyyy-MM-dd');
  const dayNumber = format(day, 'd');

  const displayedPosts = posts.slice(0, 3);
  const remainingCount = posts.length - 3;

  const handleClick = () => {
    onClick?.(day);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(day);
    }
  };

  return (
    <div
      role='gridcell'
      tabIndex={0}
      data-testid={`calendar-day-cell-${dateStr}`}
      data-date={dateStr}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative flex min-h-[110px] flex-col justify-between border-b border-r border-border/60 p-2 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-orange ${
        !isCurrentMonth
          ? 'opacity-40 bg-foreground-light/10 dark:bg-foreground-dark/10'
          : 'bg-background-light hover:bg-foreground-light/20 dark:bg-background-dark dark:hover:bg-foreground-dark/20'
      } ${isSelected ? 'ring-2 ring-brand-orange ring-inset' : ''} ${className}`}
    >
      {/* Cell Header: Day number + Add button */}
      <div className='flex items-center justify-between'>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
            isCurrentDay
              ? 'bg-brand-orange text-white shadow-xs'
              : 'text-foreground/80'
          }`}
        >
          {dayNumber}
        </span>

        <Link
          href={`/studio/compose?date=${dateStr}`}
          aria-label={`Schedule post on ${dateStr}`}
          onClick={(e) => e.stopPropagation()}
          className='flex h-6 w-6 items-center justify-center rounded-md text-foreground/50 opacity-0 transition-opacity hover:bg-foreground-light/80 hover:text-foreground group-hover:opacity-100 dark:hover:bg-foreground-dark/80'
          title='Schedule post'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='h-4 w-4'
            aria-hidden='true'
          >
            <path d='M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z' />
          </svg>
        </Link>
      </div>

      {/* Post chips list */}
      <div className='mt-1.5 flex flex-1 flex-col gap-1 overflow-hidden'>
        {displayedPosts.map((post) => (
          <CalendarPostChip
            key={post.id}
            post={post}
            onActionComplete={onActionComplete}
          />
        ))}

        {remainingCount > 0 && (
          <div className='inline-flex self-start items-center rounded bg-foreground-light/80 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/70 dark:bg-foreground-dark/80'>
            +{remainingCount} more
          </div>
        )}
      </div>
    </div>
  );
}
