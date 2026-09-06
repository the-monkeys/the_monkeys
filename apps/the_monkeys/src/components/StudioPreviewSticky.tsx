'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Keeps the studio canvas visible while the options panel scrolls.
 * Sticks just below the live header height (`--app-header-h`) so the
 * topic bar cannot show through a gap on mobile.
 * `actions` is a mobile-only icon column beside the preview.
 */
export function StudioPreviewSticky({
  children,
  actions,
  actionsClassName,
  className,
}: {
  children: ReactNode;
  actions?: ReactNode;
  actionsClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'sticky top-[var(--app-header-h,6.75rem)] z-30 isolate self-start lg:top-20',
        '-mx-4 px-4 pb-3',
        'border-b border-border-light/60 bg-background-light',
        'dark:border-border-dark/60 dark:bg-background-dark',
        'md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0',
        className
      )}
    >
      <div className='flex items-center gap-2'>
        <div className='min-w-0 flex-1'>{children}</div>
        {actions ? (
          <div
            className={cn(
              'flex shrink-0 flex-col justify-center md:hidden',
              actionsClassName
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const studioPreviewFitClass = 'aspect-[1080/1350] w-full';
