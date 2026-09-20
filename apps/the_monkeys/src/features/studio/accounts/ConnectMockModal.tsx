'use client';

import { useState } from 'react';

import { RiCloseLine, RiLoader4Line } from '@remixicon/react';

import type { PlatformConfig } from './types';

export interface ConnectMockModalProps {
  platform: PlatformConfig | null;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (data: {
    handle: string;
    displayName: string;
  }) => Promise<void> | void;
}

export function ConnectMockModal({
  platform,
  isPending = false,
  onClose,
  onSubmit,
}: ConnectMockModalProps) {
  const [mockHandle, setMockHandle] = useState('');
  const [mockDisplayName, setMockDisplayName] = useState('');

  if (!platform) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockHandle.trim()) return;
    await onSubmit({
      handle: mockHandle,
      displayName: mockDisplayName,
    });
    setMockHandle('');
    setMockDisplayName('');
  };

  const handleClose = () => {
    setMockHandle('');
    setMockDisplayName('');
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150'>
      <div className='w-full max-w-md rounded-2xl border border-border-light bg-background-light p-6 shadow-2xl dark:border-border-dark dark:bg-background-dark space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${platform.badgeBg}`}
            >
              <platform.icon size={22} className={platform.accentColor} />
            </div>
            <div>
              <h4 className='font-semibold text-base text-foreground dark:text-text-dark'>
                Connect {platform.label}
              </h4>
              <p className='text-xs text-foreground/50'>
                OAuth Redirect or Demo Provisioning
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={handleClose}
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
            Redirect to {platform.label}&apos;s official authorization page to
            grant publishing permissions.
          </p>
          <a
            href={`/api/v1/social-posts/oauth/${platform.id}/authorize`}
            className='inline-flex items-center justify-center w-full rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity'
          >
            Connect with {platform.label}
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
        <form onSubmit={handleSubmit} className='space-y-3'>
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
            disabled={!mockHandle.trim() || isPending}
            className='inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-xs font-semibold text-brand-orange hover:bg-brand-orange/20 transition-colors disabled:opacity-50'
          >
            {isPending && <RiLoader4Line size={14} className='animate-spin' />}
            <span>Add Demo Account</span>
          </button>
        </form>
      </div>
    </div>
  );
}
