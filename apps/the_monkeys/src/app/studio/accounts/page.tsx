'use client';

import type { SocialPlatform } from '@/features/studio/types';
import { useSocialAccounts } from '@/hooks/studio/useSocialPosts';
import {
  RiErrorWarningLine,
  RiFacebookBoxFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiTiktokFill,
  RiTwitterXFill,
  RiYoutubeFill,
} from '@remixicon/react';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

interface PlatformConfig {
  id: SocialPlatform;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  accentColor: string;
  badgeBg: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'x',
    label: 'X / Twitter',
    description: 'Short updates, threads, and breaking commentary',
    icon: RiTwitterXFill,
    accentColor: 'text-zinc-900 dark:text-zinc-100',
    badgeBg:
      'bg-zinc-900/10 dark:bg-zinc-100/10 text-zinc-900 dark:text-zinc-100',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Professional insights, long-form thoughts, and articles',
    icon: RiLinkedinBoxFill,
    accentColor: 'text-[#0A66C2]',
    badgeBg: 'bg-[#0A66C2]/10 text-[#0A66C2]',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Visual stories, photo carousels, and media reels',
    icon: RiInstagramFill,
    accentColor: 'text-[#E4405F]',
    badgeBg: 'bg-[#E4405F]/10 text-[#E4405F]',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Community posts, link sharing, and page updates',
    icon: RiFacebookBoxFill,
    accentColor: 'text-[#1877F2]',
    badgeBg: 'bg-[#1877F2]/10 text-[#1877F2]',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    description: 'Video releases, community polls, and shorts',
    icon: RiYoutubeFill,
    accentColor: 'text-[#FF0000]',
    badgeBg: 'bg-[#FF0000]/10 text-[#FF0000]',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    description: 'Short video storytelling and viral clips',
    icon: RiTiktokFill,
    accentColor: 'text-zinc-900 dark:text-zinc-100',
    badgeBg:
      'bg-zinc-900/10 dark:bg-zinc-100/10 text-zinc-900 dark:text-zinc-100',
  },
];

export default function AccountsPage() {
  const { data: accounts, isLoading } = useSocialAccounts();
  const safeAccounts = Array.isArray(accounts) ? accounts : [];

  return (
    <div className='w-full min-w-0 space-y-6 sm:space-y-8'>
      {/* Header */}
      <header className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-orange'>
              Channels & Integrations
            </span>
          </div>
          <h2 className='mt-2 font-newsreader text-2xl sm:text-3xl lg:text-4xl text-foreground dark:text-text-dark'>
            Accounts
          </h2>
          <p className='mt-1 max-w-2xl text-xs sm:text-sm lg:text-base text-foreground/60'>
            Connect mock channels to preview your publishing workflow. Each
            platform enforces its own character limits and media validation
            constraints.
          </p>
        </div>
      </header>

      {/* Loading Skeletons */}
      {isLoading && safeAccounts.length === 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='space-y-4 rounded-2xl border border-border-light bg-background-light p-4 sm:p-5 lg:p-6 dark:border-border-dark/60 dark:bg-background-dark'
            >
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3 min-w-0'>
                  <Skeleton className='h-10 w-10 shrink-0 rounded-xl' />
                  <div className='space-y-1.5 min-w-0'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-16' />
                  </div>
                </div>
                <Skeleton className='h-6 w-20 shrink-0 rounded-full' />
              </div>
              <Skeleton className='h-14 w-full rounded-xl' />
              <Skeleton className='h-14 w-full rounded-xl' />
            </div>
          ))}
        </div>
      ) : null}

      {/* Platform Cards Grid: 1 col on mobile, 2 cols on tablet/laptop, 3 cols on xl+ */}
      <div className='grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3'>
        {PLATFORMS.map((platform) => {
          const account = safeAccounts.find(
            (item) => item.platform === platform.id
          );
          const Icon = platform.icon;

          return (
            <div
              key={platform.id}
              className='group flex flex-col justify-between min-w-0 rounded-2xl border border-border-light bg-background-light p-4 sm:p-5 lg:p-6 transition-all duration-200 hover:border-brand-orange/30 hover:shadow-md dark:border-border-dark/60 dark:bg-background-dark'
            >
              <div className='min-w-0 space-y-4'>
                {/* Platform Header: Icon + Title + Status Badge */}
                <div className='flex items-start justify-between gap-2.5 min-w-0'>
                  <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${platform.badgeBg}`}
                    >
                      <Icon size={22} className={platform.accentColor} />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate font-semibold text-sm sm:text-base text-foreground dark:text-text-dark'>
                        {platform.label}
                      </h3>
                      <p className='truncate text-xs text-foreground/50'>
                        {platform.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className='shrink-0'>
                    {account ? (
                      <span className='inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2 sm:px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400'>
                        <span className='h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse' />
                        <span>Connected</span>
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 rounded-full border border-border-light bg-foreground-light/30 px-2 py-0.5 text-[11px] font-medium text-foreground/50 dark:border-border-dark dark:bg-foreground-dark/30'>
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>

                {/* Account Handle / Provisioning state */}
                <div className='rounded-xl bg-foreground-light/20 p-3 min-w-0 dark:bg-foreground-dark/20'>
                  <p className='text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-1'>
                    Channel Identity
                  </p>
                  <div className='text-xs sm:text-sm font-medium text-foreground dark:text-text-dark truncate'>
                    {account ? (
                      <p className='truncate font-mono font-semibold text-foreground dark:text-text-dark'>
                        @{account.handle}
                      </p>
                    ) : (
                      <p className='text-foreground/60 italic truncate'>
                        Account provisioning is still loading
                      </p>
                    )}
                  </div>
                </div>

                {/* Validation Info (Character Limit & Media Rules) */}
                {account?.validation ? (
                  <div className='space-y-2 border-t border-border-light/70 pt-3 dark:border-border-dark/50'>
                    <p className='text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground/40'>
                      Publishing Rules
                    </p>
                    <div className='space-y-1.5 text-xs text-foreground/60'>
                      {account.validation.max_text_characters ? (
                        <div className='rounded-lg bg-foreground-light/15 px-2.5 py-1.5 dark:bg-foreground-dark/15'>
                          <p className='truncate'>
                            Character limit:{' '}
                            {account.validation.max_text_characters}
                          </p>
                        </div>
                      ) : null}

                      {account.validation.max_media_count ? (
                        <div className='rounded-lg bg-foreground-light/15 px-2.5 py-1.5 dark:bg-foreground-dark/15'>
                          <p className='truncate'>
                            Max media: {account.validation.max_media_count}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {/* Not provisioned error notice */}
                {!account && !isLoading ? (
                  <div className='flex items-start gap-2 rounded-xl border border-alert-red/20 bg-alert-red/5 p-3 text-xs text-alert-red'>
                    <RiErrorWarningLine size={16} className='shrink-0 mt-0.5' />
                    <p className='leading-tight'>
                      Account was not provisioned. Refresh after signing in
                      again.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
