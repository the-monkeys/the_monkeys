'use client';

import type { SocialPlatform } from '@/features/studio/types';
import { useSocialAccounts } from '@/hooks/studio/useSocialPosts';

const platforms: { id: SocialPlatform; label: string }[] = [
  { id: 'x', label: 'X / Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
];

export default function AccountsPage() {
  const { data: accounts, isLoading } = useSocialAccounts();
  return (
    <div className='space-y-6'>
      <header>
        <p className='text-sm text-brand-orange'>Studio</p>
        <h2 className='font-newsreader text-4xl'>Accounts</h2>
        <p className='mt-1 text-foreground/60'>
          Connect mock channels to preview your publishing workflow.
        </p>
      </header>
      <div className='grid gap-4 sm:grid-cols-2'>
        {platforms.map((platform) => {
          const account = accounts?.find(
            (item) => item.platform === platform.id
          );
          return (
            <div
              key={platform.id}
              className='rounded-xl border bg-background-light p-5 dark:bg-background-dark'
            >
              <div className='flex items-center justify-between gap-3'>
                <h3 className='font-semibold'>{platform.label}</h3>
                {account ? (
                  <span className='text-xs text-green-600'>Connected</span>
                ) : null}
              </div>
              <p className='mt-2 text-sm text-foreground/60'>
                {account
                  ? `@${account.handle}`
                  : 'Account provisioning is still loading'}
              </p>
              {!account && !isLoading ? (
                <p className='mt-4 text-xs text-alert-red'>
                  Account was not provisioned. Refresh after signing in again.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
