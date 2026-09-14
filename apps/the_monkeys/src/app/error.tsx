'use client';

import Link from 'next/link';

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className='min-h-[60vh] px-4 py-16 flex items-center justify-center'>
      <section
        role='alert'
        className='w-full max-w-lg rounded-2xl border border-border-light bg-white p-6 text-center shadow-sm dark:border-border-dark dark:bg-background-dark sm:p-10'
      >
        <p className='font-inter text-xs font-bold uppercase tracking-[0.2em] text-brand-orange'>
          Monkeys
        </p>
        <h1 className='mt-3 font-newsreader text-3xl font-semibold tracking-tight text-text-light dark:text-text-dark sm:text-4xl'>
          This page could not be loaded
        </h1>
        <p className='mx-auto mt-3 max-w-md font-inter text-sm leading-6 text-gray-500 dark:text-gray-400'>
          Something unexpected interrupted the page. Try loading it again, or
          return home and continue exploring.
        </p>
        <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
          <button
            type='button'
            onClick={reset}
            className='rounded-full bg-brand-orange px-5 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2'
          >
            Try again
          </button>
          <Link
            href='/'
            className='rounded-full border border-border-light px-5 py-2.5 font-inter text-sm font-semibold text-text-light transition-colors hover:border-brand-orange hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:border-border-dark dark:text-text-dark'
          >
            Go to home
          </Link>
        </div>
      </section>
    </main>
  );
}
