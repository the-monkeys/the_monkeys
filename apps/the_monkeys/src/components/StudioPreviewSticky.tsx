'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Keeps the studio canvas visible while the options panel scrolls.
 * Actions overlay the preview on mobile so they cannot collapse its width
 * (iOS Safari flex + min-width:0 was shrinking the canvas to a 1px sliver).
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
        'sticky top-[var(--app-header-h,6.75rem)] z-30 isolate w-full self-start lg:top-20',
        '-mx-4 px-4 pb-3',
        'border-b border-border-light/60 bg-background-light',
        'dark:border-border-dark/60 dark:bg-background-dark',
        'md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0',
        className
      )}
    >
      <div className='relative w-full'>
        {children}
        {actions ? (
          <div
            className={cn(
              'absolute right-1 top-1/2 z-10 -translate-y-1/2 md:hidden',
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

/** Mobile-first: full column on phones, then tablet/desktop max widths. Height follows the canvas. */
export const studioPreviewFitClass =
  'relative w-full sm:max-w-[420px] md:max-w-[520px] lg:max-w-[560px]';
