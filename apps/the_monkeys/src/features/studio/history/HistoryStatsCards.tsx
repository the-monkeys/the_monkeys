import React, { useMemo } from 'react';

import type { SocialPost } from '@/features/studio/types';

export interface HistoryStatsCardsProps {
  posts?: SocialPost[];
  totalPublished?: number;
  totalFailed?: number;
  successRate?: string;
  totalDrafts?: number;
  className?: string;
}

export default function HistoryStatsCards({
  posts,
  totalPublished: propTotalPublished,
  totalFailed: propTotalFailed,
  successRate: propSuccessRate,
  totalDrafts: propTotalDrafts,
  className = '',
}: HistoryStatsCardsProps) {
  const calculated = useMemo(() => {
    if (!posts) {
      return {
        totalPublished: 0,
        totalFailed: 0,
        totalDrafts: 0,
        successRate: '—',
      };
    }

    const published = posts.filter(
      (p) =>
        p.status === 'published' ||
        p.status === 'published_with_errors' ||
        p.state === 'published' ||
        p.state === 'published_with_errors'
    ).length;

    const failed = posts.filter(
      (p) => p.status === 'failed' || p.state === 'failed'
    ).length;

    const drafts = posts.filter(
      (p) => p.status === 'draft' || p.state === 'draft'
    ).length;

    const totalPublishedAndFailed = published + failed;
    let rate = '—';
    if (totalPublishedAndFailed > 0) {
      rate = `${Math.round((published / totalPublishedAndFailed) * 100)}%`;
    } else if (published > 0) {
      rate = '100%';
    }

    return {
      totalPublished: published,
      totalFailed: failed,
      totalDrafts: drafts,
      successRate: rate,
    };
  }, [posts]);

  const totalPublished = propTotalPublished ?? calculated.totalPublished;
  const totalFailed = propTotalFailed ?? calculated.totalFailed;
  const successRate = propSuccessRate ?? calculated.successRate;
  const totalDrafts = propTotalDrafts ?? calculated.totalDrafts;

  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className}`}>
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
  );
}
