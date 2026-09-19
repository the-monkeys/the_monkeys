'use client';

import type { SocialPost } from '@/features/studio/types';
import {
  RiCalendarScheduleLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiFlashlightLine,
  RiLoader4Line,
  RiSendPlaneFill,
  RiTimeLine,
} from '@remixicon/react';

interface FastActionBarProps {
  post?: SocialPost;
  isDraft: boolean;
  isScheduled: boolean;
  isPublishing: boolean;
  isPublished: boolean;
  isExceeded: boolean;
  isError: boolean;
  onSaveDraft: () => void;
  onOpenScheduleDrawer: () => void;
  onQuickSchedule: (hoursFromNow: number) => void;
  onPublishNow: () => void;
  onCancelSchedule: () => void;
  onDeleteDraft: () => void;
  isSavePending: boolean;
  isPublishPending: boolean;
  isSchedulePending: boolean;
  isCancelPending: boolean;
  isDeletePending: boolean;
}

export default function FastActionBar({
  post,
  isDraft,
  isScheduled,
  isPublishing,
  isPublished,
  isExceeded,
  isError,
  onSaveDraft,
  onOpenScheduleDrawer,
  onQuickSchedule,
  onPublishNow,
  onCancelSchedule,
  onDeleteDraft,
  isSavePending,
  isPublishPending,
  isSchedulePending,
  isCancelPending,
  isDeletePending,
}: FastActionBarProps) {
  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-border-light bg-background-light p-4 dark:border-border-dark/60 dark:bg-background-dark shadow-sm'>
      {/* Quick Scheduling Presets (1-Click Fast Path) */}
      {isDraft && (
        <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border-light/70 pb-3 text-xs dark:border-border-dark/50'>
          <div className='flex items-center gap-1.5 text-foreground/50'>
            <RiFlashlightLine size={14} className='text-amber-500' />
            <span className='font-semibold uppercase tracking-wider text-[10px]'>
              Quick Schedule:
            </span>
          </div>
          <div className='flex flex-wrap items-center gap-1.5'>
            <button
              type='button'
              onClick={() => onQuickSchedule(2)}
              disabled={isExceeded || isSchedulePending}
              className='rounded-lg border border-border-light bg-foreground-light/20 px-2.5 py-1 font-medium text-foreground/75 transition-colors hover:border-brand-orange/40 hover:text-foreground dark:border-border-dark dark:bg-foreground-dark/20 disabled:opacity-50'
            >
              In 2 hours
            </button>
            <button
              type='button'
              onClick={() => onQuickSchedule(24)}
              disabled={isExceeded || isSchedulePending}
              className='rounded-lg border border-border-light bg-foreground-light/20 px-2.5 py-1 font-medium text-foreground/75 transition-colors hover:border-brand-orange/40 hover:text-foreground dark:border-border-dark dark:bg-foreground-dark/20 disabled:opacity-50'
            >
              Tomorrow
            </button>
            <button
              type='button'
              onClick={onOpenScheduleDrawer}
              disabled={isExceeded || isSchedulePending}
              className='flex items-center gap-1 rounded-lg border border-brand-orange/30 bg-brand-orange/5 px-2.5 py-1 font-medium text-brand-orange hover:bg-brand-orange/10 disabled:opacity-50'
            >
              <RiTimeLine size={13} />
              <span>Custom time...</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Action Bar Row */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        {/* Left: Status Badges & Alerts */}
        <div className='flex flex-wrap items-center gap-2.5'>
          {isScheduled && (
            <div
              data-testid='scheduled-badge'
              className='flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange'
            >
              <span className='h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse' />
              <span>
                Scheduled:{' '}
                {post?.scheduled_at
                  ? new Date(post.scheduled_at).toLocaleString(undefined, {
                      timeZone: post?.schedule_timezone || 'UTC',
                    })
                  : ''}{' '}
                ({post?.schedule_timezone || 'UTC'})
              </span>
            </div>
          )}

          {isPublishing && (
            <div className='flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500'>
              <RiLoader4Line size={14} className='animate-spin' />
              <span>Publishing...</span>
            </div>
          )}

          {isPublished && (
            <div className='flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500'>
              <RiCheckLine size={14} />
              <span>Published</span>
            </div>
          )}

          {isDraft && post?.id && (
            <button
              type='button'
              onClick={onDeleteDraft}
              disabled={isDeletePending}
              className='flex items-center gap-1.5 rounded-lg border border-alert-red/30 px-3 py-1.5 text-xs font-medium text-alert-red hover:bg-alert-red/10 disabled:opacity-50'
            >
              <RiDeleteBinLine size={14} />
              <span>{isDeletePending ? 'Deleting...' : 'Delete draft'}</span>
            </button>
          )}

          {isError && (
            <p className='text-xs font-medium text-alert-red'>
              An error occurred. Please try again.
            </p>
          )}

          {isExceeded && (
            <p className='text-xs font-medium text-alert-red'>
              One or more platforms exceed character limit.
            </p>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className='flex items-center gap-2.5'>
          {isScheduled ? (
            <>
              <button
                type='button'
                onClick={onOpenScheduleDrawer}
                disabled={isSchedulePending}
                className='rounded-xl border border-border-light bg-background-light px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground-light/30 dark:border-border-dark dark:bg-background-dark dark:hover:bg-foreground-dark/30 disabled:opacity-50'
              >
                Reschedule
              </button>
              <button
                type='button'
                onClick={onCancelSchedule}
                disabled={isCancelPending}
                className='rounded-xl border border-alert-red/30 px-4 py-2 text-sm font-medium text-alert-red hover:bg-alert-red/10 disabled:opacity-50'
              >
                {isCancelPending ? 'Cancelling...' : 'Cancel schedule'}
              </button>
              <button
                type='button'
                onClick={onPublishNow}
                disabled={isPublishPending || isExceeded}
                className='flex items-center gap-1.5 rounded-xl bg-brand-orange px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange/95 disabled:opacity-50'
              >
                <RiSendPlaneFill size={15} />
                <span>
                  {isPublishPending ? 'Publishing...' : 'Publish now'}
                </span>
              </button>
            </>
          ) : isDraft ? (
            <>
              <button
                type='button'
                onClick={onOpenScheduleDrawer}
                disabled={isExceeded || isSchedulePending}
                className='flex items-center gap-1.5 rounded-xl border border-border-light bg-background-light px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground-light/30 dark:border-border-dark dark:bg-background-dark dark:hover:bg-foreground-dark/30 disabled:opacity-50'
              >
                <RiCalendarScheduleLine size={16} />
                <span>Schedule...</span>
              </button>
              <button
                type='button'
                onClick={onPublishNow}
                disabled={isPublishPending || isExceeded || isSavePending}
                className='rounded-xl border border-brand-orange px-4 py-2 text-sm font-medium text-brand-orange hover:bg-brand-orange/10 disabled:opacity-50'
              >
                {isPublishPending ? 'Publishing...' : 'Publish now'}
              </button>
              <button
                type='button'
                onClick={onSaveDraft}
                disabled={isSavePending || isPublishPending}
                className='flex items-center gap-1.5 rounded-xl bg-brand-orange px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange/95 disabled:opacity-50'
              >
                {isSavePending ? (
                  <>
                    <RiLoader4Line size={16} className='animate-spin' />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save draft</span>
                )}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
