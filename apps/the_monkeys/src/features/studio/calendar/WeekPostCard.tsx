'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import PostActionsMenu from '@/features/studio/components/PostActionsMenu';
import type { SocialPost } from '@/features/studio/types';

import {
  PlatformIcon,
  extractPlatforms,
  formatPostTime,
} from './CalendarPostChip';

export interface WeekPostCardProps {
  post: SocialPost;
  onActionComplete?: () => void;
  testIdPrefix?: string;
}

export default function WeekPostCard({
  post,
  onActionComplete,
  testIdPrefix = 'week-post-card',
}: WeekPostCardProps) {
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
