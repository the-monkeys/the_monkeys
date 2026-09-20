'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  HistoryEmptyState,
  HistoryNoMatchesState,
} from '@/features/studio/history/HistoryEmptyState';
import HistoryFilterBar, {
  type HistorySortOrder,
  type HistoryStatusFilter,
} from '@/features/studio/history/HistoryFilterBar';
import HistoryPostItem from '@/features/studio/history/HistoryPostItem';
import HistorySkeleton from '@/features/studio/history/HistorySkeleton';
import HistoryStatsCards from '@/features/studio/history/HistoryStatsCards';
import {
  extractPosts,
  filterAndSortPosts,
} from '@/features/studio/history/historyUtils';
import type { SocialPost } from '@/features/studio/types';
import {
  useSocialPostMutations,
  useSocialPosts,
} from '@/hooks/studio/useSocialPosts';
import { RiRefreshLine } from '@remixicon/react';

export interface HistoryViewProps {
  className?: string;
}

export default function HistoryView({ className = '' }: HistoryViewProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useSocialPosts();
  const mutations = useSocialPostMutations();
  const publishNow = mutations?.publishNow;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HistoryStatusFilter>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<HistorySortOrder>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const posts: SocialPost[] = useMemo(() => extractPosts(data), [data]);

  const filteredPosts = useMemo(
    () =>
      filterAndSortPosts(
        posts,
        searchQuery,
        statusFilter,
        platformFilter,
        sortOrder
      ),
    [posts, searchQuery, statusFilter, platformFilter, sortOrder]
  );

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

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPlatformFilter('all');
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
      <HistoryStatsCards posts={posts} />

      {/* Search & Filter Bar */}
      <HistoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        platformFilter={platformFilter}
        onPlatformFilterChange={setPlatformFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* Loading Skeleton */}
      {isLoading && <HistorySkeleton />}

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
      {!isLoading && !isError && posts.length === 0 && <HistoryEmptyState />}

      {/* Filtered Posts List */}
      {!isLoading && !isError && posts.length > 0 && (
        <div className='space-y-3'>
          {filteredPosts.length === 0 ? (
            <HistoryNoMatchesState onReset={handleResetFilters} />
          ) : (
            filteredPosts.map((post) => (
              <HistoryPostItem
                key={post.id}
                post={post}
                isRetrying={retryingId === post.id}
                onRetry={handleRetryPost}
                onEdit={(p) => router.push(`/studio/compose/${p.id}`)}
                onActionComplete={() => refetch()}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
