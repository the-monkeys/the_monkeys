import React from 'react';

import Link from 'next/link';

import { RiInformationLine } from '@remixicon/react';

export function HistoryEmptyState() {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background-light/50 px-6 py-16 text-center dark:bg-background-dark/50'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
        <RiInformationLine size={24} />
      </div>
      <h3 className='font-newsreader text-xl font-medium text-foreground'>
        No publishing history yet
      </h3>
      <p className='mt-1 max-w-sm text-sm text-foreground/60'>
        Posts that are published, failed, or drafted will appear here once
        created.
      </p>
      <Link
        href='/studio/compose'
        className='mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90'
      >
        Create Post
      </Link>
    </div>
  );
}

export function HistoryNoMatchesState({ onReset }: { onReset: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background-light/40 px-6 py-12 text-center dark:bg-background-dark/40'>
      <p className='text-sm text-foreground/60'>No posts match your filters.</p>
      <button
        type='button'
        onClick={onReset}
        className='mt-2 text-xs font-semibold text-brand-orange hover:underline'
      >
        Reset filters
      </button>
    </div>
  );
}
