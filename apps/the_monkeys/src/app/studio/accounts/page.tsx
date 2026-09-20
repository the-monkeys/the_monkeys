'use client';

import { useState } from 'react';

import {
  ConnectMockModal,
  DelinkConfirmModal,
  PLATFORMS,
  type PlatformConfig,
  PlatformConnectCard,
} from '@/features/studio/accounts';
import type { SocialAccount } from '@/features/studio/types';
import {
  useSocialAccountMutations,
  useSocialAccounts,
} from '@/hooks/studio/useSocialPosts';
import { RiCheckLine } from '@remixicon/react';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export default function AccountsPage() {
  const { data: accounts, isLoading } = useSocialAccounts();
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const mutations = useSocialAccountMutations();
  const delinkMutation = mutations?.delink;
  const createMockMutation = mutations?.createMock;

  // Modals state
  const [accountToDelink, setAccountToDelink] = useState<SocialAccount | null>(
    null
  );
  const [mockModalPlatform, setMockModalPlatform] =
    useState<PlatformConfig | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmDelink = async () => {
    if (!accountToDelink || !delinkMutation?.mutateAsync) return;
    try {
      const res = await delinkMutation.mutateAsync(accountToDelink.id);
      setAccountToDelink(null);
      const reverted = res?.drafts_reverted_count ?? 0;
      showToast(
        reverted > 0
          ? `Disconnected @${accountToDelink.handle}. ${reverted} scheduled post(s) returned to drafts.`
          : `Disconnected @${accountToDelink.handle}.`
      );
    } catch (err: any) {
      showToast(err?.message || 'Failed to disconnect account');
    }
  };

  const handleCreateMockAccount = async ({
    handle,
    displayName,
  }: {
    handle: string;
    displayName: string;
  }) => {
    if (
      !mockModalPlatform ||
      !handle.trim() ||
      !createMockMutation?.mutateAsync
    )
      return;

    try {
      await createMockMutation.mutateAsync({
        platform: mockModalPlatform.id,
        handle: handle.startsWith('@') ? handle.slice(1) : handle,
        display_name: displayName.trim() || handle.trim(),
      });
      const platformLabel = mockModalPlatform.label;
      setMockModalPlatform(null);
      showToast(`Connected @${handle} (${platformLabel}) in Demo mode.`);
    } catch (err: any) {
      showToast(err?.message || 'Failed to connect mock account');
    }
  };

  return (
    <div className='w-full min-w-0 space-y-6 sm:space-y-8'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-xl dark:bg-zinc-100 dark:text-zinc-900 animate-in fade-in slide-in-from-bottom-5 duration-200'>
          <RiCheckLine size={18} className='text-green-400' />
          <span>{toastMessage}</span>
        </div>
      )}

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
            Connect multiple social media accounts per channel. Link via OAuth
            or provision demo channels to preview publishing and validation
            rules.
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

      {/* Platform Cards Grid */}
      <div className='grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3'>
        {PLATFORMS.map((platform) => (
          <PlatformConnectCard
            key={platform.id}
            platform={platform}
            accounts={safeAccounts}
            isLoading={isLoading}
            onConnect={setMockModalPlatform}
            onDelink={setAccountToDelink}
          />
        ))}
      </div>

      {/* Delink Confirmation Modal */}
      <DelinkConfirmModal
        account={accountToDelink}
        isPending={delinkMutation?.isPending}
        onClose={() => setAccountToDelink(null)}
        onConfirm={handleConfirmDelink}
      />

      {/* Connect / Mock Account Modal */}
      <ConnectMockModal
        platform={mockModalPlatform}
        isPending={createMockMutation?.isPending}
        onClose={() => setMockModalPlatform(null)}
        onSubmit={handleCreateMockAccount}
      />
    </div>
  );
}
