import React from 'react';

export default function HistorySkeleton() {
  return (
    <div
      data-testid='history-skeleton'
      role='status'
      aria-label='Loading publishing history'
      className='space-y-3'
    >
      <p className='sr-only'>Loading publishing history...</p>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='flex animate-pulse items-center gap-4 rounded-xl border border-border/40 bg-background-light p-4 dark:bg-background-dark'
        >
          <div className='h-6 w-16 rounded bg-foreground/10' />
          <div className='flex-1 space-y-2'>
            <div className='h-4 w-3/4 rounded bg-foreground/10' />
            <div className='h-3 w-1/3 rounded bg-foreground/10' />
          </div>
          <div className='h-8 w-20 rounded bg-foreground/10' />
        </div>
      ))}
    </div>
  );
}
