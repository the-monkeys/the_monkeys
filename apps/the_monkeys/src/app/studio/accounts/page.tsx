'use client';

import type { SocialAccount, SocialPlatform } from '@/features/studio/types';
import {
  useSocialAccountMutations,
  useSocialAccounts,
} from '@/hooks/studio/useSocialPosts';
import {
  RiAddLine,
  RiAlertLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiFacebookBoxFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiTiktokFill,
  RiTwitterXFill,
  RiYoutubeFill,
} from '@remixicon/react';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import React, { useState } from 'react';

interface PlatformConfig {
  id: SocialPlatform;
  label: string;
  description: string;
  icon: any;
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
  const { delink, createMock } = useSocialAccountMutations();

  // Delink modal state
  const [accountToDelink, setAccountToDelink] = useState<SocialAccount | null>(
    null
  );
  const [delinkMessage, setDelinkMessage] = useState<string | null>(null);

  // Mock / OAuth connect modal state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('x');
  const [handleInput, setHandleInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');

  const handleConfirmDelink = async () => {
    if (!accountToDelink) return;
    try {
      const res = await delink.mutateAsync(accountToDelink.id);
      setDelinkMessage(
        `Disconnected @${accountToDelink.handle}. ${res.cancelled_jobs_count || 0} scheduled jobs cancelled, ${res.drafts_reverted_count || 0} posts moved to drafts.`
      );
      setAccountToDelink(null);
    } catch (err: any) {
      setDelinkMessage(
        err?.message || 'Failed to disconnect account. Please try again.'
      );
    }
  };

  const handleCreateMockAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;
    const cleanHandle = handleInput.trim().replace(/^@/, '');
    await createMock.mutateAsync({
      platform: selectedPlatform,
      handle: cleanHandle,
      display_name: displayNameInput.trim() || cleanHandle,
    });
    setHandleInput('');
    setDisplayNameInput('');
    setIsConnectModalOpen(false);
  };

  const handleOAuthConnect = (platform: SocialPlatform) => {
    window.location.href = `/api/v1/social-posts/oauth/${platform}/authorize`;
  };

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
            Connect and manage your social channels. You can link multiple
            accounts for each platform. Each platform enforces its own character
            limits and media validation constraints.
          </p>
        </div>
      </header>

      {/* Notification / Toast Banner */}
      {delinkMessage ? (
        <div className='flex items-center justify-between gap-3 rounded-xl border border-brand-orange/20 bg-brand-orange/10 p-3.5 text-xs sm:text-sm text-brand-orange'>
          <div className='flex items-center gap-2 min-w-0'>
            <RiAlertLine size={18} className='shrink-0' />
            <span className='truncate'>{delinkMessage}</span>
          </div>
          <button
            type='button'
            onClick={() => setDelinkMessage(null)}
            className='shrink-0 rounded p-1 hover:bg-brand-orange/20'
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      ) : null}

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
        {PLATFORMS.map((platform) => {
          const platformAccounts = safeAccounts.filter(
            (item) =>
              item.platform === platform.id && item.status !== 'disconnected'
          );
          const hasAccounts = platformAccounts.length > 0;
          const Icon = platform.icon;

          return (
            <div
              key={platform.id}
              className='group flex flex-col justify-between min-w-0 rounded-2xl border border-border-light bg-background-light p-4 sm:p-5 lg:p-6 transition-all duration-200 hover:border-brand-orange/30 hover:shadow-md dark:border-border-dark/60 dark:bg-background-dark'
            >
              <div className='min-w-0 space-y-4'>
                {/* Platform Header: Icon + Title + Add Account Button */}
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

                  <button
                    type='button'
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setIsConnectModalOpen(true);
                    }}
                    className='inline-flex items-center gap-1 rounded-lg border border-brand-orange/30 bg-brand-orange/10 px-2 sm:px-2.5 py-1 text-xs font-semibold text-brand-orange hover:bg-brand-orange/20 transition-colors'
                  >
                    <RiAddLine size={14} />
                    <span>Connect</span>
                  </button>
                </div>

                {/* Accounts List for this platform */}
                {hasAccounts ? (
                  <div className='space-y-2.5'>
                    {platformAccounts.map((account) => (
                      <div
                        key={account.id}
                        className='flex flex-col gap-2 rounded-xl bg-foreground-light/20 p-3 min-w-0 dark:bg-foreground-dark/20'
                      >
                        <div className='flex items-center justify-between gap-2 min-w-0'>
                          <div className='min-w-0 flex-1'>
                            <div className='flex items-center gap-1.5 min-w-0'>
                              <p className='truncate font-mono font-semibold text-xs sm:text-sm text-foreground dark:text-text-dark'>
                                @{account.handle}
                              </p>
                              {account.is_mock ? (
                                <span className='inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-amber-600 dark:text-amber-400'>
                                  Demo / Mock
                                </span>
                              ) : null}
                            </div>
                            {account.display_name &&
                            account.display_name !== account.handle ? (
                              <p className='truncate text-[11px] text-foreground/60'>
                                {account.display_name}
                              </p>
                            ) : null}
                          </div>

                          <div className='flex items-center gap-2 shrink-0'>
                            <span className='inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[11px] font-semibold text-green-600 dark:text-green-400'>
                              <span className='h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse' />
                              <span>Connected</span>
                            </span>
                            <button
                              type='button'
                              onClick={() => setAccountToDelink(account)}
                              className='rounded-md p-1 text-foreground/40 hover:bg-alert-red/10 hover:text-alert-red transition-colors text-xs font-medium'
                              title='Disconnect channel'
                              aria-label='Disconnect channel'
                            >
                              <span className='hidden sm:inline mr-1 text-[11px]'>
                                Disconnect
                              </span>
                              <RiDeleteBinLine
                                size={15}
                                className='inline-block -mt-0.5'
                              />
                            </button>
                          </div>
                        </div>

                        {/* Validation limits if provided */}
                        {account.validation ? (
                          <div className='flex items-center gap-2 text-[11px] text-foreground/50 border-t border-border-light/40 dark:border-border-dark/30 pt-1.5'>
                            {account.validation.max_text_characters ? (
                              <span>
                                Character limit:{' '}
                                {account.validation.max_text_characters}
                              </span>
                            ) : null}
                            {account.validation.max_media_count ? (
                              <span>
                                · Max media: {account.validation.max_media_count}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='rounded-xl border border-dashed border-border-light/80 p-4 text-center dark:border-border-dark/60'>
                    <p className='text-xs text-foreground/50 italic'>
                      {isLoading
                        ? 'Account provisioning is still loading'
                        : 'Account was not provisioned. Refresh after signing in again.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delink Confirmation Modal */}
      {accountToDelink ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150'>
          <div className='w-full max-w-md rounded-2xl border border-border-light bg-background-light p-6 shadow-xl dark:border-border-dark dark:bg-background-dark space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-alert-red/10 text-alert-red'>
                <RiErrorWarningLine size={24} />
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='font-semibold text-lg text-foreground dark:text-text-dark'>
                  Disconnect @{accountToDelink.handle}?
                </h3>
                <p className='mt-1 text-sm text-foreground/70'>
                  Are you sure you want to disconnect @{accountToDelink.handle}?
                  Any scheduled posts targeted to this account will be cancelled
                  and moved back to drafts.
                </p>
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={() => setAccountToDelink(null)}
                className='rounded-xl border border-border-light px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground-light/30 dark:border-border-dark dark:hover:bg-foreground-dark/30 transition-colors'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleConfirmDelink}
                disabled={delink.isPending}
                className='rounded-xl bg-alert-red px-4 py-2 text-sm font-semibold text-white hover:bg-alert-red/90 transition-colors disabled:opacity-50'
              >
                {delink.isPending ? 'Disconnecting...' : 'Confirm Disconnect'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Connect Account Modal (OAuth + Mock Fallback) */}
      {isConnectModalOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150'>
          <div className='w-full max-w-md rounded-2xl border border-border-light bg-background-light p-6 shadow-xl dark:border-border-dark dark:bg-background-dark space-y-5'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-lg text-foreground dark:text-text-dark'>
                Connect {selectedPlatform.toUpperCase()} Channel
              </h3>
              <button
                type='button'
                onClick={() => setIsConnectModalOpen(false)}
                className='rounded-lg p-1 text-foreground/50 hover:bg-foreground-light/30 dark:hover:bg-foreground-dark/30'
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* OAuth Redirect Action */}
            <div className='space-y-2 rounded-xl bg-foreground-light/20 p-4 dark:bg-foreground-dark/20'>
              <p className='text-xs font-semibold uppercase tracking-wider text-foreground/50'>
                Option 1: Social Platform OAuth
              </p>
              <p className='text-xs text-foreground/70'>
                Authenticate directly with {selectedPlatform.toUpperCase()} via
                OAuth 2.0.
              </p>
              <button
                type='button'
                onClick={() => handleOAuthConnect(selectedPlatform)}
                className='w-full mt-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-orange/90 transition-colors'
              >
                Authenticate with {selectedPlatform.toUpperCase()}
              </button>
            </div>

            {/* Manual Mock Fallback Form */}
            <form onSubmit={handleCreateMockAccount} className='space-y-3 pt-2'>
              <div className='flex items-center justify-between'>
                <p className='text-xs font-semibold uppercase tracking-wider text-foreground/50'>
                  Option 2: Demo / Mock Account
                </p>
                <span className='rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400'>
                  Local Dev
                </span>
              </div>
              <div>
                <label className='block text-xs font-medium text-foreground/70 mb-1'>
                  Handle
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g. acme_corp'
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  className='w-full rounded-xl border border-border-light bg-background-light px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/50 dark:border-border-dark dark:bg-background-dark'
                />
              </div>
              <div>
                <label className='block text-xs font-medium text-foreground/70 mb-1'>
                  Display Name (Optional)
                </label>
                <input
                  type='text'
                  placeholder='e.g. Acme Corp Main'
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  className='w-full rounded-xl border border-border-light bg-background-light px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/50 dark:border-border-dark dark:bg-background-dark'
                />
              </div>

              <div className='flex items-center justify-end gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setIsConnectModalOpen(false)}
                  className='rounded-xl border border-border-light px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-foreground-light/30 dark:border-border-dark dark:hover:bg-foreground-dark/30'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={createMock.isPending || !handleInput.trim()}
                  className='rounded-xl bg-foreground text-background px-4 py-2 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50'
                >
                  {createMock.isPending
                    ? 'Connecting...'
                    : 'Connect Mock Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
