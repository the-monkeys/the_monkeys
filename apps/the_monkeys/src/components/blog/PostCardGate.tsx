'use client';

import {
  ContentGate,
  type ContentGateProps,
} from '@/components/moderation/ContentGate';
import { ContentOptions } from '@/components/moderation/ContentOptions';
import { contentOptionsImageClass } from '@/components/moderation/menuStyles';
import { cn } from '@/lib/utils';

/** Keep report actions outside links and available even when the post is gated. */
export function PostCardGate({
  className,
  imageMenu,
  ...props
}: ContentGateProps & { imageMenu?: 'always' | 'mobile' }) {
  return (
    <div
      data-post-card={props.target.id}
      className={cn(
        'relative h-full min-w-0 [&>article]:h-full [&>a]:h-full',
        className
      )}
    >
      <ContentGate {...props} className='h-full' />
      <ContentOptions
        target={props.target}
        ariaLabel='Post options'
        className={cn(
          'absolute right-0 top-0 z-20',
          imageMenu && contentOptionsImageClass,
          imageMenu === 'mobile' &&
            'sm:[&>button]:text-gray-500 sm:[&>button]:drop-shadow-none'
        )}
      />
    </div>
  );
}
