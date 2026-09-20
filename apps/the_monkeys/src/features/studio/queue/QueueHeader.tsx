import Link from 'next/link';

import { RiCalendarScheduleLine, RiTimeLine } from '@remixicon/react';

export interface QueueHeaderProps {
  totalCount: number;
  className?: string;
}

export default function QueueHeader({
  totalCount,
  className = '',
}: QueueHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div>
        <div className='flex items-center gap-3'>
          <h1 className='font-newsreader text-3xl font-medium text-foreground sm:text-4xl'>
            Publishing Queue
          </h1>
          <span className='inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange'>
            <RiCalendarScheduleLine size={13} className='shrink-0' />
            <span>
              {totalCount} {totalCount === 1 ? 'post' : 'posts'} scheduled
            </span>
          </span>
        </div>
        <p className='mt-1 text-sm text-foreground/60'>
          Manage and reorder your upcoming scheduled posts.
        </p>
      </div>

      <div>
        <Link
          href='/studio/compose'
          className='inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-orange/90'
        >
          + Add to Queue
        </Link>
      </div>
    </div>
  );
}
