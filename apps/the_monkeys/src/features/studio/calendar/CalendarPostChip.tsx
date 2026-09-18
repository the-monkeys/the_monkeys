'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import PostActionsMenu from '@/features/studio/components/PostActionsMenu';
import type { SocialPlatform, SocialPost } from '@/features/studio/types';
import { format, parseISO } from 'date-fns';

export interface CalendarPostChipProps {
  post: SocialPost;
  onActionComplete?: () => void;
  className?: string;
}

export function extractPlatforms(post: SocialPost): SocialPlatform[] {
  const fromRenditions = (post.renditions || [])
    .map((r) => r.platform)
    .filter((p): p is SocialPlatform => Boolean(p));
  const fromPlatforms = (post as any).platforms;
  const list = [
    ...fromRenditions,
    ...(Array.isArray(fromPlatforms) ? fromPlatforms : []),
  ];
  return Array.from(new Set(list));
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

export function formatPostTime(scheduledAt?: string): string {
  if (!scheduledAt) return '';
  try {
    const d =
      typeof scheduledAt === 'string'
        ? parseISO(scheduledAt)
        : new Date(scheduledAt);
    if (isNaN(d.getTime())) return '';
    return format(d, 'h:mm a');
  } catch {
    return '';
  }
}

export default function CalendarPostChip({
  post,
  onActionComplete,
  className = '',
}: CalendarPostChipProps) {
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
      data-testid={`calendar-post-chip-${post.id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group/chip relative flex w-full items-center justify-between gap-1.5 rounded-md border border-border/70 bg-background-light/95 px-1.5 py-1 text-xs shadow-xs transition hover:border-brand-orange/50 hover:bg-brand-orange/5 hover:shadow-xs focus:outline-none focus:ring-1 focus:ring-brand-orange dark:bg-background-dark/95 ${className}`}
    >
      <div className='flex min-w-0 flex-1 items-center gap-1.5'>
        {/* Platform Icons */}
        <div className='flex shrink-0 items-center gap-0.5'>
          {platforms.length > 0 ? (
            platforms.map((p) => <PlatformIcon key={p} platform={p} />)
          ) : (
            <PlatformIcon platform='x' />
          )}
        </div>

        {/* Time */}
        {formattedTime && (
          <span className='shrink-0 text-[10px] font-medium text-foreground/50'>
            {formattedTime}
          </span>
        )}

        {/* Text */}
        <span className='min-w-0 truncate text-xs font-medium text-foreground/90'>
          {postText}
        </span>
      </div>

      {/* 3-dot trigger for PostActionsMenu */}
      <div
        className='shrink-0'
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <PostActionsMenu
          post={post}
          onActionComplete={onActionComplete}
          className='scale-90 origin-right'
        />
      </div>
    </div>
  );
}
