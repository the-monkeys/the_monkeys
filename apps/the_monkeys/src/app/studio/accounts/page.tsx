'use client';

import { useState } from 'react';

import type { SocialAccount, SocialPlatform } from '@/features/studio/types';
import {
  useSocialAccountMutations,
  useSocialAccounts,
} from '@/hooks/studio/useSocialPosts';
import {
  RiAddLine,
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiFacebookBoxFill,
  RiInstagramFill,
  RiLinkUnlinkM,
  RiLinkedinBoxFill,
  RiLoader4Line,
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
  const mutations = useSocialAccountMutations();
  const delinkMutation = mutations?.delink;
  const createMockMutation = mutations?.createMock;

  // Modals state
  const [accountToDelink, setAccountToDelink] = useState<SocialAccount | null>(
    null
  );
  const [mockModalPlatform, setMockModalPlatform] =
    useState<PlatformConfig | null>(null);
  const [mockHandle, setMockHandle] = useState('');
  const [mockDisplayName, setMockDisplayName] = useState('');
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

  const handleCreateMockAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !mockModalPlatform ||
      !mockHandle.trim() ||
      !createMockMutation?.mutateAsync
    )
      return;

    try {
      await createMockMutation.mutateAsync({
        platform: mockModalPlatform.id,
        handle: mockHandle.startsWith('@') ? mockHandle.slice(1) : mockHandle,
        display_name: mockDisplayName.trim() || mockHandle.trim(),
      });
      setMockModalPlatform(null);
      setMockHandle('');
      setMockDisplayName('');
      showToast(
        `Connected @${mockHandle} (${mockModalPlatform.label}) in Demo mode.`
      );
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
        {PLATFORMS.map((platform) => {
          const platformAccounts = safeAccounts.filter(
            (item) =>
              item.platform === platform.id && item.status !== 'disconnected'
          );
          const hasAccounts = platformAccounts.length > 0;
          const Icon = platform.icon;
          const firstAccount = platformAccounts[0];

          return (
            <div
              key={platform.id}
              className='group flex flex-col justify-between min-w-0 rounded-2xl border border-border-light bg-background-light p-4 sm:p-5 lg:p-6 transition-all duration-200 hover:border-brand-orange/30 hover:shadow-md dark:border-border-dark/60 dark:bg-background-dark'
            >
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
                      onClick={() => setMockModalPlatform(platform)}
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
                        <div
                          key={account.id}
                          className='flex items-center justify-between gap-2 rounded-xl bg-foreground-light/20 p-2.5 min-w-0 dark:bg-foreground-dark/20'
                        >
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
                              {account.display_name &&
                                account.display_name !== account.handle && (
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
                              onClick={() => setAccountToDelink(account)}
                              className='rounded-lg p-1.5 text-foreground/40 hover:bg-alert-red/10 hover:text-alert-red transition-colors'
                              title={`Disconnect @${account.handle}`}
                              aria-label={`Disconnect @${account.handle}`}
                            >
                              <RiLinkUnlinkM size={16} />
                            </button>
                          </div>
                        </div>
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
                      Account was not provisioned. Refresh after signing in
                      again.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delink Confirmation Modal */}
      {accountToDelink && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150'>
          <div className='w-full max-w-md rounded-2xl border border-border-light bg-background-light p-6 shadow-2xl dark:border-border-dark dark:bg-background-dark space-y-4'>
            <div className='flex items-center gap-3 text-alert-red'>
              <div className='rounded-xl bg-alert-red/10 p-2.5'>
                <RiAlertLine size={24} />
              </div>
              <div>
                <h4 className='font-semibold text-base text-foreground dark:text-text-dark'>
                  Disconnect Account
                </h4>
                <p className='text-xs text-foreground/50'>
                  @{accountToDelink.handle}
                </p>
              </div>
            </div>

            <p className='text-sm text-foreground/70 leading-relaxed'>
              Are you sure you want to disconnect{' '}
              <span className='font-semibold font-mono text-foreground dark:text-text-dark'>
                @{accountToDelink.handle}
              </span>
              ? Any scheduled posts targeted to this channel will be{' '}
              <span className='font-semibold text-alert-red'>
                cancelled and returned to your drafts
              </span>
              .
            </p>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={() => setAccountToDelink(null)}
                className='rounded-xl border border-border-light px-4 py-2 text-xs font-semibold text-foreground hover:bg-foreground/5 transition-colors dark:border-border-dark'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleConfirmDelink}
                disabled={delinkMutation?.isPending}
                className='inline-flex items-center gap-1.5 rounded-xl bg-alert-red px-4 py-2 text-xs font-semibold text-white hover:bg-alert-red/90 transition-colors disabled:opacity-50'
              >
                {delinkMutation?.isPending && (
                  <RiLoader4Line size={14} className='animate-spin' />
                )}
                <span>Confirm Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect / Mock Account Modal */}
      {mockModalPlatform && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150'>
          <div className='w-full max-w-md rounded-2xl border border-border-light bg-background-light p-6 shadow-2xl dark:border-border-dark dark:bg-background-dark space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${mockModalPlatform.badgeBg}`}
                >
                  <mockModalPlatform.icon
                    size={22}
                    className={mockModalPlatform.accentColor}
                  />
                </div>
                <div>
                  <h4 className='font-semibold text-base text-foreground dark:text-text-dark'>
                    Connect {mockModalPlatform.label}
                  </h4>
                  <p className='text-xs text-foreground/50'>
                    OAuth Redirect or Demo Provisioning
                  </p>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setMockModalPlatform(null)}
                className='rounded-lg p-1 text-foreground/40 hover:text-foreground'
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Real OAuth Redirect Option */}
            <div className='rounded-xl border border-border-light p-3.5 space-y-2 dark:border-border-dark'>
              <p className='text-xs font-semibold text-foreground dark:text-text-dark'>
                Standard OAuth 2.0
              </p>
              <p className='text-xs text-foreground/60'>
                Redirect to {mockModalPlatform.label}&apos;s official
                authorization page to grant publishing permissions.
              </p>
              <a
                href={`/api/v1/social-posts/oauth/${mockModalPlatform.id}/authorize`}
                className='inline-flex items-center justify-center w-full rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity'
              >
                Connect with {mockModalPlatform.label}
              </a>
            </div>

            <div className='flex items-center gap-2 my-2'>
              <div className='h-px flex-1 bg-border-light dark:bg-border-dark' />
              <span className='text-[10px] uppercase font-bold text-foreground/40 tracking-wider'>
                OR DEMO / MOCK
              </span>
              <div className='h-px flex-1 bg-border-light dark:bg-border-dark' />
            </div>

            {/* Mock Provisioning Form */}
            <form onSubmit={handleCreateMockAccount} className='space-y-3'>
              <div>
                <label className='block text-xs font-medium text-foreground/70 mb-1'>
                  Account Handle
                </label>
                <input
                  type='text'
                  required
                  placeholder='@my_brand_channel'
                  value={mockHandle}
                  onChange={(e) => setMockHandle(e.target.value)}
                  className='w-full rounded-xl border border-border-light bg-background px-3 py-2 text-xs text-foreground focus:border-brand-orange focus:outline-none dark:border-border-dark dark:bg-background-dark'
                />
              </div>

              <div>
                <label className='block text-xs font-medium text-foreground/70 mb-1'>
                  Display Name (Optional)
                </label>
                <input
                  type='text'
                  placeholder='My Brand Official'
                  value={mockDisplayName}
                  onChange={(e) => setMockDisplayName(e.target.value)}
                  className='w-full rounded-xl border border-border-light bg-background px-3 py-2 text-xs text-foreground focus:border-brand-orange focus:outline-none dark:border-border-dark dark:bg-background-dark'
                />
              </div>

              <button
                type='submit'
                disabled={!mockHandle.trim() || createMockMutation?.isPending}
                className='inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-xs font-semibold text-brand-orange hover:bg-brand-orange/20 transition-colors disabled:opacity-50'
              >
                {createMockMutation?.isPending && (
                  <RiLoader4Line size={14} className='animate-spin' />
                )}
                <span>Add Demo Account</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
