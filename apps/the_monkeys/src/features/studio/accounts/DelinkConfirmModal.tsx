'use client';

import type { SocialAccount } from '@/features/studio/types';
import { RiAlertLine, RiLoader4Line } from '@remixicon/react';

export interface DelinkConfirmModalProps {
  account: SocialAccount | null;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DelinkConfirmModal({
  account,
  isPending = false,
  onClose,
  onConfirm,
}: DelinkConfirmModalProps) {
  if (!account) return null;

  return (
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
            <p className='text-xs text-foreground/50'>@{account.handle}</p>
          </div>
        </div>

        <p className='text-sm text-foreground/70 leading-relaxed'>
          Are you sure you want to disconnect{' '}
          <span className='font-semibold font-mono text-foreground dark:text-text-dark'>
            @{account.handle}
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
            onClick={onClose}
            className='rounded-xl border border-border-light px-4 py-2 text-xs font-semibold text-foreground hover:bg-foreground/5 transition-colors dark:border-border-dark'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isPending}
            className='inline-flex items-center gap-1.5 rounded-xl bg-alert-red px-4 py-2 text-xs font-semibold text-white hover:bg-alert-red/90 transition-colors disabled:opacity-50'
          >
            {isPending && <RiLoader4Line size={14} className='animate-spin' />}
            <span>Confirm Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
