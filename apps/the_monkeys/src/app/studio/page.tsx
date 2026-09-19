'use client';

import Link from 'next/link';

import { useSocialPosts } from '@/hooks/studio/useSocialPosts';
import {
  RiAddLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiDraftLine,
  RiPencilLine,
  RiSettings3Line,
  RiTimeLine,
} from '@remixicon/react';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export default function StudioPage() {
  const { data, isLoading, isError } = useSocialPosts({ page_size: 10 });
  const posts = data?.items ?? [];

  const draftsCount = posts.filter(
    (post) => (post.state ?? post.status) === 'draft'
  ).length;
  const scheduledCount = posts.filter(
    (post) => (post.state ?? post.status) === 'scheduled'
  ).length;
  const publishedCount = posts.filter(
    (post) => (post.state ?? post.status) === 'published'
  ).length;

  const metrics = [
    {
      label: 'Drafts',
      value: draftsCount,
      description: 'Ideas & works in progress',
      icon: RiDraftLine,
      href: '/studio/compose',
      color:
        'text-zinc-500 bg-zinc-500/10 dark:text-zinc-400 dark:bg-zinc-400/10',
    },
    {
      label: 'Scheduled',
      value: scheduledCount,
      description: 'Queued for automatic release',
      icon: RiTimeLine,
      href: '/studio/queue',
      color:
        'text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-400/10',
    },
    {
      label: 'Published',
      value: publishedCount,
      description: 'Delivered to your channels',
      icon: RiCheckboxCircleLine,
      href: '/studio/history',
      color:
        'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-400/10',
    },
  ];

  const quickActions = [
    {
      title: 'Compose Post',
      description: 'Draft & customize multi-platform updates',
      href: '/studio/compose',
      icon: RiPencilLine,
    },
    {
      title: 'Content Queue',
      description: 'Review upcoming posts and sequence order',
      href: '/studio/queue',
      icon: RiTimeLine,
    },
    {
      title: 'Calendar View',
      description: 'Plan your weekly and monthly publishing',
      href: '/studio/calendar',
      icon: RiCalendarLine,
    },
    {
      title: 'Connected Accounts',
      description: 'Manage channel permissions and limits',
      href: '/studio/accounts',
      icon: RiSettings3Line,
    },
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'scheduled':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'failed':
        return 'bg-alert-red/10 text-alert-red border-alert-red/20';
      case 'draft':
      default:
        return 'bg-foreground-light/40 text-foreground/70 dark:bg-foreground-dark/40 dark:text-foreground-light border-border-light dark:border-border-dark';
    }
  };

  return (
    <div className='space-y-8'>
      {/* Dashboard Top Hero */}
      <header className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-orange'>
              Your social desk
            </span>
          </div>
          <h2 className='mt-2 font-newsreader text-3xl sm:text-4xl text-foreground dark:text-text-dark'>
            What are you publishing?
          </h2>
          <p className='mt-1 max-w-xl text-sm sm:text-base text-foreground/60'>
            Shape one idea into platform-ready posts, then schedule it across
            your channels.
          </p>
        </div>
        <Link
          href='/studio/compose'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-orange/20 transition-all hover:bg-brand-orange/95 hover:shadow-md hover:shadow-brand-orange/30 active:scale-[0.98]'
        >
          <RiAddLine size={18} />
          <span>Create a post</span>
        </Link>
      </header>

      {/* KPI Metric Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className='group relative overflow-hidden rounded-2xl border border-border-light bg-background-light p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-md dark:border-border-dark/60 dark:bg-background-dark'
            >
              <header className='flex items-center justify-between'>
                <p className='text-sm font-medium text-foreground/60'>
                  {metric.label}
                </p>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${metric.color}`}
                >
                  <Icon size={18} />
                </span>
              </header>
              <p className='mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground dark:text-text-dark'>
                {metric.value}
              </p>
              <div className='mt-2 flex items-center justify-between'>
                <p className='text-xs text-foreground/50'>
                  {metric.description}
                </p>
                <Link
                  href={metric.href}
                  className='text-xs font-semibold text-brand-orange hover:underline'
                >
                  View
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Shortcuts */}
      <div className='space-y-3'>
        <h3 className='text-xs font-semibold uppercase tracking-wider text-foreground/50'>
          Quick Actions
        </h3>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className='group flex flex-col justify-between rounded-xl border border-border-light bg-background-light p-4 transition-all duration-150 hover:border-brand-orange/40 hover:bg-foreground-light/20 dark:border-border-dark/60 dark:bg-background-dark dark:hover:bg-foreground-dark/20'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground-light/50 text-foreground/70 group-hover:bg-brand-orange/10 group-hover:text-brand-orange dark:bg-foreground-dark/50 dark:text-foreground-light transition-colors'>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold text-foreground dark:text-text-dark'>
                      {action.title}
                    </h4>
                    <p className='text-xs text-foreground/55 line-clamp-1'>
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Work / Activity Section */}
      <section className='rounded-2xl border border-border-light bg-background-light p-5 sm:p-6 dark:border-border-dark/60 dark:bg-background-dark'>
        <div className='mb-5 flex items-center justify-between'>
          <div>
            <h3 className='font-newsreader text-2xl font-medium text-foreground dark:text-text-dark'>
              Recent work
            </h3>
            <p className='text-xs text-foreground/50'>
              Drafts and active scheduled posts across your accounts
            </p>
          </div>
          <Link
            href='/studio/history'
            className='inline-flex items-center gap-1 text-xs font-semibold text-brand-orange transition-colors hover:underline'
          >
            <span>View history</span>
            <RiArrowRightLine size={14} />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className='space-y-3 py-2'>
            <p className='text-sm text-foreground/60'>Loading your posts...</p>
            <div className='space-y-2'>
              <Skeleton className='h-12 w-full rounded-xl' />
              <Skeleton className='h-12 w-full rounded-xl' />
              <Skeleton className='h-12 w-full rounded-xl' />
            </div>
          </div>
        ) : null}

        {/* Error State */}
        {isError ? (
          <div className='rounded-xl border border-alert-red/20 bg-alert-red/5 p-4'>
            <p className='text-sm text-alert-red'>
              Unable to load social posts.
            </p>
          </div>
        ) : null}

        {/* Empty State */}
        {!isLoading && !isError && posts.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border-light py-12 text-center dark:border-border-dark/60'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange mb-3'>
              <RiDraftLine size={24} />
            </div>
            <p className='text-sm text-foreground/60'>
              Your drafts and scheduled posts will appear here.
            </p>
            <Link
              href='/studio/compose'
              className='mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange/95'
            >
              <RiAddLine size={16} />
              <span>Start writing your first post</span>
            </Link>
          </div>
        ) : null}

        {/* Posts List */}
        {!isLoading && !isError && posts.length > 0 ? (
          <div className='divide-y divide-border-light dark:divide-border-dark/60'>
            {posts.slice(0, 5).map((post) => {
              const statusValue = post.state || post.status || 'draft';
              return (
                <Link
                  key={post.id}
                  href={`/studio/compose/${post.id}`}
                  className='group flex items-center justify-between gap-4 py-3.5 transition-colors hover:text-brand-orange'
                >
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium text-foreground dark:text-text-dark group-hover:text-brand-orange transition-colors'>
                      {post.base_text || 'Untitled post'}
                    </p>
                    {post.scheduled_at ? (
                      <p className='mt-0.5 text-xs text-foreground/45 flex items-center gap-1'>
                        <RiTimeLine size={12} />
                        <span>
                          Scheduled:{' '}
                          {new Date(post.scheduled_at).toLocaleDateString()}
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <div className='flex items-center gap-3 shrink-0'>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadgeStyle(
                        statusValue
                      )}`}
                    >
                      {statusValue}
                    </span>
                    <RiArrowRightLine
                      size={16}
                      className='text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-brand-orange'
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}
