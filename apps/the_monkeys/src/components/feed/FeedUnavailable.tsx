'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@the-monkeys/ui/atoms/button';

export function FeedUnavailable({ onRetry }: { onRetry?: () => void } = {}) {
  const router = useRouter();
  return (
    <section className='rounded-2xl border border-border-light p-5 dark:border-border-dark/40'>
      <h1 className='font-newsreader text-2xl font-semibold'>
        Your feed is temporarily unavailable
      </h1>
      <p className='mt-2 font-inter text-sm text-gray-500'>
        We could not verify your session. Please try again.
      </p>
      <Button
        className='mt-4'
        onClick={onRetry ?? (() => router.refresh())}
        variant='outline'
      >
        Try again
      </Button>
    </section>
  );
}
