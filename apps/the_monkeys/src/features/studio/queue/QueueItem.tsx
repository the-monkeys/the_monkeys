'use client';

import React from 'react';

import PostActionsMenu from '@/features/studio/components/PostActionsMenu';
import type { SocialPost } from '@/features/studio/types';

export interface QueueItemProps {
  post: SocialPost;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onActionComplete?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  isReordering?: boolean;
}

const PLATFORM_LABELS: Record<string, string> = {
  x: 'X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

export function getPlatformBadgeLabel(platform: string): string {
  const normalized = platform.toLowerCase();
  return (
    PLATFORM_LABELS[normalized] ||
    platform.charAt(0).toUpperCase() + platform.slice(1)
  );
}

export function extractPlatforms(post: SocialPost): string[] {
  const fromRenditions = (post.renditions || [])
    .map((r) => r.platform)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const fromPlatforms = (post as any).platforms;
  const list = [
    ...fromRenditions,
    ...(Array.isArray(fromPlatforms) ? fromPlatforms : []),
  ];
  return Array.from(new Set(list));
}

export function formatScheduledTimestamp(
  scheduledAt?: string,
  timeZone?: string
): string {
  if (!scheduledAt) return '';
  const date = new Date(scheduledAt);
  if (isNaN(date.getTime())) return '';

  const tz = timeZone || 'UTC';
  try {
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(date);
    return formatted;
  } catch {
    return `${date.toLocaleString()} (${tz})`;
  }
}

export default function QueueItem({
  post,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onActionComplete,
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging = false,
  isReordering = false,
}: QueueItemProps) {
  const platforms = extractPlatforms(post);
  const formattedDate = formatScheduledTimestamp(
    post.scheduled_at,
    post.schedule_timezone
  );

  return (
    <div
      draggable={draggable && !isReordering}
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragOver={(e) => onDragOver?.(e, index)}
      onDrop={(e) => onDrop?.(e, index)}
      onDragEnd={onDragEnd}
      className={`group relative flex items-center gap-3 rounded-xl border bg-background-light p-4 shadow-sm transition-all dark:bg-background-dark sm:gap-4 ${
        isDragging
          ? 'border-dashed border-brand-orange bg-brand-orange/5 opacity-50 shadow-md'
          : 'border-border/70 hover:border-border hover:shadow'
      }`}
    >
      {/* 6-dot drag handle */}
      <div
        className='cursor-grab select-none text-foreground/40 transition hover:text-foreground active:cursor-grabbing'
        style={{ touchAction: 'none' }}
        title='Drag to reorder'
        aria-hidden='true'
      >
        <span className='text-xl leading-none'>⠿</span>
      </div>

      {/* Sequence pill */}
      <div className='shrink-0'>
        <span className='inline-flex h-6 min-w-7 items-center justify-center rounded-md bg-brand-orange/10 px-1.5 text-xs font-semibold text-brand-orange'>
          #{index + 1}
        </span>
      </div>

      {/* Reorder up/down buttons */}
      <div className='flex flex-col gap-0.5 shrink-0'>
        <button
          type='button'
          aria-label='Move up'
          title='Move up'
          disabled={index === 0 || isReordering}
          onClick={() => onMoveUp(index)}
          className='flex h-5 w-5 items-center justify-center rounded text-[10px] text-foreground/60 transition hover:bg-foreground-light/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25 dark:hover:bg-foreground-dark/60'
        >
          ▲
        </button>
        <button
          type='button'
          aria-label='Move down'
          title='Move down'
          disabled={index === total - 1 || isReordering}
          onClick={() => onMoveDown(index)}
          className='flex h-5 w-5 items-center justify-center rounded text-[10px] text-foreground/60 transition hover:bg-foreground-light/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25 dark:hover:bg-foreground-dark/60'
        >
          ▼
        </button>
      </div>

      {/* Post content and metadata */}
      <div className='min-w-0 flex-1'>
        <p className='line-clamp-2 text-sm font-medium text-foreground/90'>
          {post.base_text || post.text || 'Untitled post'}
        </p>
        <div className='mt-1.5 flex flex-wrap items-center gap-2'>
          {platforms.map((platform) => (
            <span
              key={platform}
              className='inline-flex items-center rounded-md border border-border/60 bg-foreground-light/40 px-2 py-0.5 text-xs font-medium text-foreground/70 dark:bg-foreground-dark/40'
            >
              {getPlatformBadgeLabel(platform)}
            </span>
          ))}
          {formattedDate && (
            <span className='inline-flex items-center gap-1 text-xs text-foreground/50'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='h-3.5 w-3.5 text-foreground/40'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z'
                  clipRule='evenodd'
                />
              </svg>
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      {/* Action menu */}
      <div className='shrink-0'>
        <PostActionsMenu post={post} onActionComplete={onActionComplete} />
      </div>
    </div>
  );
}
