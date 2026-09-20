'use client';

import React from 'react';

import { getPlatformBadgeLabel } from '@/features/studio/queue/QueueItem';
import { RiArrowUpDownLine, RiSearchLine } from '@remixicon/react';

export type HistoryStatusFilter = 'all' | 'published' | 'failed' | 'draft';
export type HistorySortOrder = 'newest' | 'oldest' | null;

export const HISTORY_PLATFORM_OPTIONS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Platforms' },
  { id: 'x', label: 'X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
];

export interface HistoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: HistoryStatusFilter;
  onStatusFilterChange: (status: HistoryStatusFilter) => void;
  platformFilter: string;
  onPlatformFilterChange: (platform: string) => void;
  sortOrder: HistorySortOrder;
  onSortToggle?: () => void;
  onSortOrderChange?: (order: HistorySortOrder) => void;
  className?: string;
}

export default function HistoryFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  platformFilter,
  onPlatformFilterChange,
  sortOrder,
  onSortToggle,
  onSortOrderChange,
  className = '',
}: HistoryFilterBarProps) {
  const handleSortClick = () => {
    if (onSortToggle) {
      onSortToggle();
    } else if (onSortOrderChange) {
      onSortOrderChange(sortOrder === 'newest' ? 'oldest' : 'newest');
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-border/60 bg-background-light p-4 shadow-sm dark:bg-background-dark ${className}`}
    >
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
            onChange={(e) => onSearchChange(e.target.value)}
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
            onChange={(e) => onPlatformFilterChange(e.target.value)}
            className='rounded-lg border border-border/70 bg-background-light px-3 py-2 text-sm text-foreground focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange dark:bg-background-dark'
          >
            {HISTORY_PLATFORM_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type='button'
            onClick={handleSortClick}
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
          {(['all', 'published', 'failed', 'draft'] as const).map((status) => (
            <button
              key={status}
              type='button'
              onClick={() => onStatusFilterChange(status)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition ${
                statusFilter === status
                  ? 'bg-brand-orange text-white'
                  : 'bg-foreground-light/40 text-foreground/70 hover:bg-foreground-light/70 hover:text-foreground dark:bg-foreground-dark/40 dark:hover:bg-foreground-dark/70'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Platform Chips */}
        <div className='flex flex-wrap items-center gap-1'>
          {HISTORY_PLATFORM_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type='button'
              onClick={() => onPlatformFilterChange(opt.id)}
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
  );
}
