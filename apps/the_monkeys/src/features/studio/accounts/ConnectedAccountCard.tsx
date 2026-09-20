'use client';

import type { SocialAccount } from '@/features/studio/types';
import { RiLinkUnlinkM } from '@remixicon/react';

export interface ConnectedAccountCardProps {
  account: SocialAccount;
  onDelink: (account: SocialAccount) => void;
}

export function ConnectedAccountCard({
  account,
  onDelink,
}: ConnectedAccountCardProps) {
  return (
    <div className='flex items-center justify-between gap-2 rounded-xl bg-foreground-light/20 p-2.5 min-w-0 dark:bg-foreground-dark/20'>
      <div className='min-w-0 flex-1 flex items-center gap-2.5'>
        {account.avatar_url ? (
          <img
            src={account.avatar_url}
            alt={account.handle}
            className='h-7 w-7 rounded-full object-cover shrink-0'
          />
        ) : (
          <div className='h-7 w-7 rounded-full bg-brand-orange/10 flex items-center justify-center text-xs font-bold text-brand-orange shrink-0'>
            {account.handle.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-1.5'>
            <p className='truncate font-mono text-xs font-semibold text-foreground dark:text-text-dark'>
              @{account.handle}
            </p>
            {account.is_mock && (
              <span className='rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-amber-600 border border-amber-500/20 shrink-0'>
                Demo
              </span>
            )}
          </div>
          {account.display_name && account.display_name !== account.handle && (
            <p className='truncate text-[11px] text-foreground/50'>
              {account.display_name}
            </p>
          )}
        </div>
      </div>

      {/* Status + Delink action */}
      <div className='flex items-center gap-2 shrink-0'>
        <span className='hidden sm:inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400'>
          <span className='h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse' />
          <span>Connected</span>
        </span>

        <button
          type='button'
          onClick={() => onDelink(account)}
          className='rounded-lg p-1.5 text-foreground/40 hover:bg-alert-red/10 hover:text-alert-red transition-colors'
          title={`Disconnect @${account.handle}`}
          aria-label={`Disconnect @${account.handle}`}
        >
          <RiLinkUnlinkM size={16} />
        </button>
      </div>
    </div>
  );
}
