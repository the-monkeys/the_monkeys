'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Keeps the studio canvas visible while the options panel scrolls.
 * Mobile export icons sit beside the well, not on the image. The well uses
 * calc(100% - 3rem) instead of flex-1 + min-w-0 so iOS Safari cannot collapse
 * the canvas to 0px.
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
      <div className='flex w-full items-center gap-2'>
        <div className='w-[calc(100%-3rem)] md:w-full'>{children}</div>
        {actions ? (
          <div className={cn('w-10 shrink-0 md:hidden', actionsClassName)}>
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
