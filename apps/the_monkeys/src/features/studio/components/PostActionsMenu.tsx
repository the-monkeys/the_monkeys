'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import type { SocialPost } from '@/features/studio/types';
import { useSocialPostMutations } from '@/hooks/studio/useSocialPosts';

import RescheduleModal from './RescheduleModal';

export interface PostActionsMenuProps {
  post: SocialPost;
  onActionComplete?: () => void;
  className?: string;
}

export default function PostActionsMenu({
  post,
  onActionComplete,
  className = '',
}: PostActionsMenuProps) {
  const router = useRouter();
  const mutations = useSocialPostMutations();
  const publishNow = mutations?.publishNow;
  const cancelSchedule = mutations?.cancelSchedule;
  const deleteDraft = mutations?.deleteDraft;

  const [isOpen, setIsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPending = Boolean(
    publishNow?.isPending || cancelSchedule?.isPending || deleteDraft?.isPending
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/studio/compose/${post.id}`);
    onActionComplete?.();
  };

  const handlePublishNow = async () => {
    setIsOpen(false);
    try {
      await publishNow?.mutateAsync({
        id: post.id,
        expectedVersion: post.version,
      });
      onActionComplete?.();
    } catch {
      // Errors handled by React Query / caller
    }
  };

  const handleCancelSchedule = async () => {
    setIsOpen(false);
    try {
      await cancelSchedule?.mutateAsync({
        id: post.id,
        expectedVersion: post.version,
      });
      onActionComplete?.();
    } catch {
      // Errors handled by React Query / caller
    }
  };

  const handleDelete = async () => {
    setIsOpen(false);
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );
    if (!confirmed) return;

    try {
      await deleteDraft?.mutateAsync({
        id: post.id,
        expectedVersion: post.version,
      });
      onActionComplete?.();
    } catch {
      // Errors handled by React Query / caller
    }
  };

  const handleOpenReschedule = () => {
    setIsOpen(false);
    setIsRescheduleOpen(true);
  };

  return (
    <>
      <div
        ref={menuRef}
        className={`relative inline-block text-left ${className}`}
      >
        <button
          type='button'
          aria-label='Post actions'
          aria-haspopup='true'
          aria-expanded={isOpen}
          disabled={isPending}
          onClick={() => setIsOpen((prev) => !prev)}
          className='flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-foreground-light/50 hover:text-foreground disabled:opacity-50 dark:hover:bg-foreground-dark/50'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='h-5 w-5'
            aria-hidden='true'
          >
            <circle cx='12' cy='5' r='2' />
            <circle cx='12' cy='12' r='2' />
            <circle cx='12' cy='19' r='2' />
          </svg>
        </button>

        {isOpen && (
          <div
            role='menu'
            aria-orientation='vertical'
            className='absolute right-0 top-full z-40 mt-1 w-48 origin-top-right rounded-xl border bg-background-light py-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-background-dark dark:ring-white/10'
          >
            <button
              type='button'
              role='menuitem'
              disabled={isPending}
              onClick={handleEdit}
              className='flex w-full items-center px-3.5 py-2 text-left text-sm text-foreground/80 hover:bg-foreground-light/60 hover:text-foreground disabled:opacity-50 dark:hover:bg-foreground-dark/60'
            >
              Edit in Composer
            </button>

            <button
              type='button'
              role='menuitem'
              disabled={isPending}
              onClick={handlePublishNow}
              className='flex w-full items-center px-3.5 py-2 text-left text-sm text-foreground/80 hover:bg-foreground-light/60 hover:text-foreground disabled:opacity-50 dark:hover:bg-foreground-dark/60'
            >
              Publish Now
            </button>

            <button
              type='button'
              role='menuitem'
              disabled={isPending}
              onClick={handleOpenReschedule}
              className='flex w-full items-center px-3.5 py-2 text-left text-sm text-foreground/80 hover:bg-foreground-light/60 hover:text-foreground disabled:opacity-50 dark:hover:bg-foreground-dark/60'
            >
              Reschedule
            </button>

            <button
              type='button'
              role='menuitem'
              disabled={isPending}
              onClick={handleCancelSchedule}
              className='flex w-full items-center px-3.5 py-2 text-left text-sm text-foreground/80 hover:bg-foreground-light/60 hover:text-foreground disabled:opacity-50 dark:hover:bg-foreground-dark/60'
            >
              Cancel Schedule
            </button>

            <div className='my-1 border-t border-border/50' />

            <button
              type='button'
              role='menuitem'
              disabled={isPending}
              onClick={handleDelete}
              className='flex w-full items-center px-3.5 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400'
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <RescheduleModal
        isOpen={isRescheduleOpen}
        post={post}
        onClose={() => setIsRescheduleOpen(false)}
        onSuccess={onActionComplete}
      />
    </>
  );
}
