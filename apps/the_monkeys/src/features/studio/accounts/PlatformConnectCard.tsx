'use client';

import type { SocialAccount } from '@/features/studio/types';
import { RiAddLine, RiErrorWarningLine } from '@remixicon/react';

import { ConnectedAccountCard } from './ConnectedAccountCard';
import type { PlatformConfig } from './types';

export interface PlatformConnectCardProps {
  platform: PlatformConfig;
  accounts: SocialAccount[];
  isLoading?: boolean;
  onConnect: (platform: PlatformConfig) => void;
  onDelink: (account: SocialAccount) => void;
}

export function PlatformConnectCard({
  platform,
  accounts,
  isLoading = false,
  onConnect,
  onDelink,
}: PlatformConnectCardProps) {
  const platformAccounts = accounts.filter(
    (item) => item.platform === platform.id && item.status !== 'disconnected'
  );
  const hasAccounts = platformAccounts.length > 0;
  const Icon = platform.icon;
  const firstAccount = platformAccounts[0];

  return (
    <div className='group flex flex-col justify-between min-w-0 rounded-2xl border border-border-light bg-background-light p-4 sm:p-5 lg:p-6 transition-all duration-200 hover:border-brand-orange/30 hover:shadow-md dark:border-border-dark/60 dark:bg-background-dark'>
      <div className='min-w-0 space-y-4'>
        {/* Platform Header: Icon + Title + Add/Connect Button */}
        <div className='flex items-start justify-between gap-2.5 min-w-0'>
          <div className='flex items-center gap-3 min-w-0 flex-1'>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${platform.badgeBg}`}
            >
              <Icon size={22} className={platform.accentColor} />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <h3 className='truncate font-semibold text-sm sm:text-base text-foreground dark:text-text-dark'>
                  {platform.label}
                </h3>
                {hasAccounts && (
                  <span className='rounded-full bg-foreground-light/40 px-2 py-0.2 text-[10px] font-bold text-foreground/70 dark:bg-foreground-dark/40'>
                    {platformAccounts.length}
                  </span>
                )}
              </div>
              <p className='truncate text-xs text-foreground/50'>
                {platform.description}
              </p>
            </div>
          </div>

          {/* Connect / Add Account Button */}
          <div className='shrink-0 flex items-center gap-1.5'>
            <button
              type='button'
              onClick={() => onConnect(platform)}
              className='inline-flex items-center gap-1 rounded-lg border border-border-light bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-foreground/5 transition-colors dark:border-border-dark dark:bg-background-dark dark:hover:bg-foreground-dark/30'
              title={`Connect ${platform.label} account`}
            >
              <RiAddLine size={14} />
              <span>{hasAccounts ? 'Add' : 'Connect'}</span>
            </button>
          </div>
        </div>

        {/* Accounts List / Identities */}
        {hasAccounts ? (
          <div className='space-y-2.5'>
            <p className='text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-foreground/40'>
              Connected Accounts
            </p>
            <div className='space-y-2'>
              {platformAccounts.map((account) => (
                <ConnectedAccountCard
                  key={account.id}
                  account={account}
                  onDelink={onDelink}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty state for platform */
          <div className='rounded-xl bg-foreground-light/20 p-3 min-w-0 dark:bg-foreground-dark/20'>
            <p className='text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-1'>
              Channel Identity
            </p>
            <div className='text-xs sm:text-sm font-medium text-foreground dark:text-text-dark truncate'>
              <p className='text-foreground/60 italic truncate'>
                {isLoading
                  ? 'Account provisioning is still loading'
                  : 'No accounts connected yet'}
              </p>
            </div>
          </div>
        )}

        {/* Validation Info (Character Limit & Media Rules) from first account */}
        {firstAccount?.validation ? (
          <div className='space-y-2 border-t border-border-light/70 pt-3 dark:border-border-dark/50'>
            <p className='text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground/40'>
              Publishing Rules
            </p>
            <div className='space-y-1.5 text-xs text-foreground/60'>
              {firstAccount.validation.max_text_characters ? (
                <div className='rounded-lg bg-foreground-light/15 px-2.5 py-1.5 dark:bg-foreground-dark/15'>
                  <p className='truncate'>
                    Character limit:{' '}
                    {firstAccount.validation.max_text_characters}
                  </p>
                </div>
              ) : null}

              {firstAccount.validation.max_media_count ? (
                <div className='rounded-lg bg-foreground-light/15 px-2.5 py-1.5 dark:bg-foreground-dark/15'>
                  <p className='truncate'>
                    Max media: {firstAccount.validation.max_media_count}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Not provisioned notice if no accounts and not loading */}
        {!hasAccounts && !isLoading && (
          <div className='flex items-start gap-2 rounded-xl border border-alert-red/20 bg-alert-red/5 p-3 text-xs text-alert-red'>
            <RiErrorWarningLine size={16} className='shrink-0 mt-0.5' />
            <p className='leading-tight'>
              Account was not provisioned. Refresh after signing in again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
