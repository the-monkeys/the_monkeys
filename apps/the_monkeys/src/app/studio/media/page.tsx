'use client';

import { useSocialMedia } from '@/hooks/studio/useSocialPosts';

export default function MediaPage() {
  const { data, isLoading, isError } = useSocialMedia();
  const assets = Array.isArray(data) ? data : [];

  return (
    <div className='space-y-6'>
      <header>
        <p className='text-sm text-brand-orange'>Studio</p>
        <h2 className='font-newsreader text-4xl'>Media</h2>
        <p className='mt-1 text-foreground/60'>
          Social assets available to your posts.
        </p>
      </header>
      <section className='rounded-xl border bg-background-light p-5 dark:bg-background-dark'>
        {isLoading ? (
          <p className='text-sm text-foreground/60'>Loading media...</p>
        ) : null}
        {isError ? (
          <p className='text-sm text-alert-red'>Unable to load media.</p>
        ) : null}
        {!isLoading && !isError && assets.length === 0 ? (
          <p className='py-12 text-center text-sm text-foreground/60'>
            Upload images and videos from the composer when media endpoints are
            enabled.
          </p>
        ) : null}
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {assets.map((asset) => (
            <div key={asset.id} className='overflow-hidden rounded-lg border'>
              <img
                src={asset.url}
                alt={asset.name}
                className='aspect-square w-full object-cover'
              />
              <p className='truncate p-2 text-xs'>{asset.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
