'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import PostActionsMenu from '@/features/studio/components/PostActionsMenu';
import {
  extractPlatforms,
  getPlatformBadgeLabel,
} from '@/features/studio/queue/QueueItem';
import type { SocialPost } from '@/features/studio/types';
import {
  RiAlertLine,
  RiCheckLine,
  RiEditLine,
  RiInformationLine,
} from '@remixicon/react';

export interface HistoryPostItemProps {
  post: SocialPost;
  isRetrying?: boolean;
  onRetry?: (post: SocialPost) => void;
  onEdit?: (post: SocialPost) => void;
  onActionComplete?: () => void;
}

export function formatTimestamp(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function getStatusBadge(post: SocialPost) {
  const status = post.status || post.state;
  switch (status) {
    case 'published':
      return (
        <span className='inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
          <RiCheckLine size={13} />
          <span>Published</span>
        </span>
      );
    case 'published_with_errors':
      return (
        <span className='inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400'>
          <RiInformationLine size={13} />
          <span>Partial</span>
        </span>
      );
    case 'failed':
      return (
        <span className='inline-flex items-center gap-1 rounded-md bg-alert-red/10 px-2 py-0.5 text-xs font-semibold text-alert-red'>
          <RiAlertLine size={13} />
          <span>Failed</span>
        </span>
      );
    case 'draft':
      return (
        <span className='inline-flex items-center rounded-md bg-foreground-light/60 px-2 py-0.5 text-xs font-semibold text-foreground/70 dark:bg-foreground-dark/60'>
          Draft
        </span>
      );
    default:
      return (
        <span className='inline-flex items-center rounded-md bg-foreground-light/40 px-2 py-0.5 text-xs font-semibold text-foreground/60 dark:bg-foreground-dark/40 capitalize'>
          {status}
        </span>
      );
  }
}

export default function HistoryPostItem({
  post,
  isRetrying = false,
  onRetry,
  onEdit,
  onActionComplete,
}: HistoryPostItemProps) {
  const router = useRouter();
  const platforms = extractPlatforms(post);
  const isFailed = post.status === 'failed' || post.state === 'failed';
  const formattedDate = formatTimestamp(post.scheduled_at || post.created_at);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    } else {
      router.push(`/studio/compose/${post.id}`);
    }
  };

  return (
    <div className='flex flex-col gap-3 rounded-xl border border-border/70 bg-background-light p-4 shadow-sm transition hover:border-border hover:shadow dark:bg-background-dark sm:flex-row sm:items-center sm:justify-between'>
      {/* Left: Status & Content */}
      <div className='min-w-0 flex-1 space-y-2'>
        <div className='flex flex-wrap items-center gap-2'>
          {getStatusBadge(post)}
          {platforms.map((p) => (
            <span
              key={p}
              className='inline-flex items-center rounded-md border border-border/60 bg-foreground-light/40 px-2 py-0.5 text-xs font-medium text-foreground/70 dark:bg-foreground-dark/40'
            >
              {getPlatformBadgeLabel(p)}
            </span>
          ))}
          {formattedDate && (
            <span className='text-xs text-foreground/50'>{formattedDate}</span>
          )}
        </div>

        <p className='line-clamp-2 text-sm font-medium text-foreground/90'>
          {post.base_text || post.text || 'Untitled post'}
        </p>

        {post.error_message && isFailed && (
          <p className='text-xs font-medium text-alert-red'>
            {post.error_message}
          </p>
        )}
      </div>

      {/* Right: Actions */}
      <div className='flex shrink-0 items-center gap-2'>
        {isFailed && (
          <button
            type='button'
            disabled={isRetrying}
            onClick={() => onRetry?.(post)}
            className='inline-flex items-center gap-1 rounded-lg border border-alert-red/30 bg-alert-red/5 px-2.5 py-1.5 text-xs font-semibold text-alert-red transition hover:bg-alert-red/10 disabled:opacity-50'
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}

        <button
          type='button'
          onClick={handleEdit}
          aria-label='Edit post'
          className='inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background-light px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground-light/50 hover:text-foreground dark:bg-background-dark dark:hover:bg-foreground-dark/50'
        >
          <RiEditLine size={13} />
          <span>Edit</span>
        </button>

        <PostActionsMenu post={post} onActionComplete={onActionComplete} />
      </div>
    </div>
  );
}
