'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import PostActionsMenu from '@/features/studio/components/PostActionsMenu';
import {
  extractPlatforms,
  getPlatformBadgeLabel,
} from '@/features/studio/queue/QueueItem';
import type { SocialPost } from '@/features/studio/types';
import {
  useSocialPostMutations,
  useSocialPosts,
} from '@/hooks/studio/useSocialPosts';
import {
  RiAlertLine,
  RiArrowUpDownLine,
  RiCheckLine,
  RiEditLine,
  RiInformationLine,
  RiRefreshLine,
  RiSearchLine,
} from '@remixicon/react';

export interface HistoryViewProps {
  className?: string;
}

const PLATFORM_OPTIONS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Platforms' },
  { id: 'x', label: 'X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
];

export default function HistoryView({ className = '' }: HistoryViewProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useSocialPosts();
  const mutations = useSocialPostMutations();
  const publishNow = mutations?.publishNow;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'published' | 'failed' | 'draft'
  >('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const posts: SocialPost[] = useMemo(() => {
    return (
      (data as any)?.items ??
      (data as any)?.posts ??
      (Array.isArray(data) ? data : [])
    );
  }, [data]);

  // KPI Calculations
  const totalPublished = useMemo(() => {
    return posts.filter(
      (p) =>
        p.status === 'published' ||
        p.status === 'published_with_errors' ||
        p.state === 'published' ||
        p.state === 'published_with_errors'
    ).length;
  }, [posts]);

  const totalFailed = useMemo(() => {
    return posts.filter((p) => p.status === 'failed' || p.state === 'failed')
      .length;
  }, [posts]);

  const totalDrafts = useMemo(() => {
    return posts.filter((p) => p.status === 'draft' || p.state === 'draft')
      .length;
  }, [posts]);

  const successRate = useMemo(() => {
    const totalPublishedAndFailed = totalPublished + totalFailed;
    if (totalPublishedAndFailed > 0) {
      return `${Math.round((totalPublished / totalPublishedAndFailed) * 100)}%`;
    }
    if (totalPublished > 0) {
      return '100%';
    }
    return '—';
  }, [totalPublished, totalFailed]);

  // Filtering & Sorting
  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      // Search filter
      if (searchQuery.trim()) {
        const text = post.base_text || post.text || '';
        if (!text.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === 'published') {
        const isPub =
          post.status === 'published' ||
          post.status === 'published_with_errors' ||
          post.state === 'published' ||
          post.state === 'published_with_errors';
        if (!isPub) return false;
      } else if (statusFilter === 'failed') {
        const isFailed = post.status === 'failed' || post.state === 'failed';
        if (!isFailed) return false;
      } else if (statusFilter === 'draft') {
        const isDraft = post.status === 'draft' || post.state === 'draft';
        if (!isDraft) return false;
      }

      // Platform filter
      if (platformFilter !== 'all') {
        const platforms = extractPlatforms(post);
        if (!platforms.includes(platformFilter)) {
          return false;
        }
      }

      return true;
    });

    if (sortOrder) {
      return [...filtered].sort((a, b) => {
        const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
        const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
    }

    return filtered;
  }, [posts, searchQuery, statusFilter, platformFilter, sortOrder]);

  const handleRetryPost = async (post: SocialPost) => {
    try {
      setRetryingId(post.id);
      await publishNow?.mutateAsync({
        id: post.id,
        expectedVersion: post.version,
      });
    } catch {
      // Handled by mutation error state
    } finally {
      setRetryingId(null);
    }
  };

  const formatTimestamp = (dateStr?: string) => {
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
  };

  const getStatusBadge = (post: SocialPost) => {
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
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-3'>
            <h1 className='font-newsreader text-3xl font-medium text-foreground sm:text-4xl'>
              Publishing History
            </h1>
            <span className='inline-flex items-center rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange'>
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>
          <p className='mt-1 text-sm text-foreground/60'>
            View past publications, delivery statuses, and performance.
          </p>
        </div>

        <div>
          <Link
            href='/studio/compose'
            className='inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90'
          >
            + Create Post
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        <div className='rounded-xl border border-border/60 bg-background-light p-4 shadow-sm dark:bg-background-dark'>
          <p className='text-xs font-medium text-foreground/60'>
            Total Published
          </p>
          <p
            data-testid='kpi-published'
            className='mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400'
          >
            {totalPublished}
          </p>
        </div>

        <div className='rounded-xl border border-border/60 bg-background-light p-4 shadow-sm dark:bg-background-dark'>
          <p className='text-xs font-medium text-foreground/60'>Total Failed</p>
          <p
            data-testid='kpi-failed'
            className='mt-1 text-2xl font-bold text-alert-red'
          >
            {totalFailed}
          </p>
        </div>

        <div className='rounded-xl border border-border/60 bg-background-light p-4 shadow-sm dark:bg-background-dark'>
          <p className='text-xs font-medium text-foreground/60'>Success Rate</p>
          <p
            data-testid='kpi-success-rate'
            className='mt-1 text-2xl font-bold text-foreground'
          >
            {successRate}
          </p>
        </div>

        <div className='rounded-xl border border-border/60 bg-background-light p-4 shadow-sm dark:bg-background-dark'>
          <p className='text-xs font-medium text-foreground/60'>Total Drafts</p>
          <p
            data-testid='kpi-drafts'
            className='mt-1 text-2xl font-bold text-foreground/80'
          >
            {totalDrafts}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className='flex flex-col gap-3 rounded-xl border border-border/60 bg-background-light p-4 shadow-sm dark:bg-background-dark'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          {/* Search Input */}
          <div className='relative flex-1'>
            <RiSearchLine
              size={16}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40'
            />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search publishing history...'
              className='w-full rounded-lg border border-border/70 bg-background-light pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange dark:bg-background-dark'
            />
          </div>

          {/* Platform Select & Sort Toggle */}
          <div className='flex items-center gap-2'>
            <label htmlFor='platform-select' className='sr-only'>
              Filter by platform
            </label>
            <select
              id='platform-select'
              aria-label='Filter by platform'
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className='rounded-lg border border-border/70 bg-background-light px-3 py-2 text-sm text-foreground focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange dark:bg-background-dark'
            >
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              type='button'
              onClick={() =>
                setSortOrder((prev) =>
                  prev === 'newest' ? 'oldest' : 'newest'
                )
              }
              aria-label={`Sort by ${sortOrder === 'newest' ? 'oldest' : 'newest'}`}
              className='inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background-light px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground-light/50 hover:text-foreground dark:bg-background-dark dark:hover:bg-foreground-dark/50'
            >
              <span className='capitalize'>{sortOrder || 'Sort'}</span>
              <RiArrowUpDownLine size={14} className='opacity-60' />
            </button>
          </div>
        </div>

        {/* Status Filter Buttons and Platform Chips */}
        <div className='flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3'>
          {/* Status Buttons */}
          <div className='flex flex-wrap items-center gap-1.5'>
            {(['all', 'published', 'failed', 'draft'] as const).map(
              (status) => (
                <button
                  key={status}
                  type='button'
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition ${
                    statusFilter === status
                      ? 'bg-brand-orange text-white'
                      : 'bg-foreground-light/40 text-foreground/70 hover:bg-foreground-light/70 hover:text-foreground dark:bg-foreground-dark/40 dark:hover:bg-foreground-dark/70'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* Platform Chips */}
          <div className='flex flex-wrap items-center gap-1'>
            {PLATFORM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type='button'
                onClick={() => setPlatformFilter(opt.id)}
                className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${
                  platformFilter === opt.id
                    ? 'bg-brand-orange/20 text-brand-orange'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {opt.id === 'all' ? 'All' : getPlatformBadgeLabel(opt.id)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div
          data-testid='history-skeleton'
          role='status'
          aria-label='Loading publishing history'
          className='space-y-3'
        >
          <p className='sr-only'>Loading publishing history...</p>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex animate-pulse items-center gap-4 rounded-xl border border-border/40 bg-background-light p-4 dark:bg-background-dark'
            >
              <div className='h-6 w-16 rounded bg-foreground/10' />
              <div className='flex-1 space-y-2'>
                <div className='h-4 w-3/4 rounded bg-foreground/10' />
                <div className='h-3 w-1/3 rounded bg-foreground/10' />
              </div>
              <div className='h-8 w-20 rounded bg-foreground/10' />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div
          role='alert'
          className='rounded-xl border border-alert-red/30 bg-alert-red/5 p-6 text-center'
        >
          <p className='text-sm font-medium text-alert-red'>
            Failed to load publishing history.
          </p>
          <button
            type='button'
            onClick={() => refetch()}
            className='mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline'
          >
            <RiRefreshLine size={14} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && posts.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background-light/50 px-6 py-16 text-center dark:bg-background-dark/50'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <RiInformationLine size={24} />
          </div>
          <h3 className='font-newsreader text-xl font-medium text-foreground'>
            No publishing history yet
          </h3>
          <p className='mt-1 max-w-sm text-sm text-foreground/60'>
            Posts that are published, failed, or drafted will appear here once
            created.
          </p>
          <Link
            href='/studio/compose'
            className='mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90'
          >
            Create Post
          </Link>
        </div>
      )}

      {/* Filtered Posts List */}
      {!isLoading && !isError && posts.length > 0 && (
        <div className='space-y-3'>
          {filteredPosts.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background-light/40 px-6 py-12 text-center dark:bg-background-dark/40'>
              <p className='text-sm text-foreground/60'>
                No posts match your filters.
              </p>
              <button
                type='button'
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPlatformFilter('all');
                }}
                className='mt-2 text-xs font-semibold text-brand-orange hover:underline'
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const platforms = extractPlatforms(post);
              const isFailed =
                post.status === 'failed' || post.state === 'failed';
              const formattedDate = formatTimestamp(
                post.scheduled_at || post.created_at
              );

              return (
                <div
                  key={post.id}
                  className='flex flex-col gap-3 rounded-xl border border-border/70 bg-background-light p-4 shadow-sm transition hover:border-border hover:shadow dark:bg-background-dark sm:flex-row sm:items-center sm:justify-between'
                >
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
                        <span className='text-xs text-foreground/50'>
                          {formattedDate}
                        </span>
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
                        disabled={retryingId === post.id}
                        onClick={() => handleRetryPost(post)}
                        className='inline-flex items-center gap-1 rounded-lg border border-alert-red/30 bg-alert-red/5 px-2.5 py-1.5 text-xs font-semibold text-alert-red transition hover:bg-alert-red/10 disabled:opacity-50'
                      >
                        {retryingId === post.id ? 'Retrying...' : 'Retry'}
                      </button>
                    )}

                    <button
                      type='button'
                      onClick={() => router.push(`/studio/compose/${post.id}`)}
                      aria-label='Edit post'
                      className='inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background-light px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground-light/50 hover:text-foreground dark:bg-background-dark dark:hover:bg-foreground-dark/50'
                    >
                      <RiEditLine size={13} />
                      <span>Edit</span>
                    </button>

                    <PostActionsMenu
                      post={post}
                      onActionComplete={() => refetch()}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
