import { formatBytes } from './utils';

interface MediaStatsHeaderProps {
  totalAssets: number;
  totalBytes: number;
}

export default function MediaStatsHeader({
  totalAssets,
  totalBytes,
}: MediaStatsHeaderProps) {
  return (
    <header className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
      <div>
        <div className='flex items-center gap-2'>
          <span className='rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-orange'>
            Studio
          </span>
          <span className='text-xs text-foreground/40'>•</span>
          <span className='text-xs text-foreground/50'>Asset Library</span>
        </div>
        <h2 className='mt-2 font-newsreader text-3xl sm:text-4xl text-foreground dark:text-text-dark'>
          Media
        </h2>
        <p className='mt-1 text-sm text-foreground/60 dark:text-text-dark/60'>
          Social assets available to your posts.
        </p>
      </div>

      {/* Quick summary stats */}
      <div className='flex items-center gap-3 text-xs text-foreground/60 dark:text-text-dark/60'>
        <div className='rounded-xl border border-border-light bg-background-light px-3 py-1.5 dark:border-border-dark dark:bg-background-dark'>
          <span className='font-semibold text-foreground dark:text-text-dark'>
            {totalAssets}
          </span>{' '}
          <span>{totalAssets === 1 ? 'asset' : 'assets'}</span>
        </div>
        {totalBytes > 0 && (
          <div className='rounded-xl border border-border-light bg-background-light px-3 py-1.5 dark:border-border-dark dark:bg-background-dark'>
            <span className='font-semibold text-foreground dark:text-text-dark'>
              {formatBytes(totalBytes)}
            </span>{' '}
            <span>total</span>
          </div>
        )}
      </div>
    </header>
  );
}
