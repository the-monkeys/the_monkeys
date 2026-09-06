'use client';

import { cn } from '@/lib/utils';

const btnClass =
  'flex min-h-11 w-10 flex-col items-center justify-center gap-0.5 rounded-xl border border-border-light/70 bg-background-light py-1 text-[8px] font-semibold uppercase tracking-wide text-foreground shadow-sm dark:border-border-dark/70 dark:bg-background-dark disabled:cursor-not-allowed disabled:opacity-50';

const IconCopy = () => (
  <svg
    viewBox='0 0 24 24'
    width={14}
    height={14}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
    <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
  </svg>
);

const IconCheck = () => (
  <svg
    viewBox='0 0 24 24'
    width={14}
    height={14}
    fill='none'
    stroke='#10B981'
    strokeWidth={2.5}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);

const IconDownload = () => (
  <svg
    viewBox='0 0 24 24'
    width={14}
    height={14}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
    <polyline points='7 10 12 15 17 10' />
    <line x1='12' y1='15' x2='12' y2='3' />
  </svg>
);

const IconContact = () => (
  <svg
    viewBox='0 0 24 24'
    width={14}
    height={14}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
    <circle cx='12' cy='7' r='4' />
  </svg>
);

export function StudioMobileExportIcons({
  onCopy,
  onPng,
  onJpeg,
  onDownload,
  onVCard,
  downloadLabel = 'Save',
  copied,
  copying,
  exporting,
  disabled,
  className,
}: {
  onCopy: () => void;
  onPng?: () => void;
  onJpeg?: () => void;
  onDownload?: () => void;
  onVCard?: () => void;
  downloadLabel?: string;
  copied: boolean;
  copying: boolean;
  exporting: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const busy = disabled || copying || exporting;

  return (
    <div className={cn('flex flex-col gap-2', className)} role='group'>
      <button
        type='button'
        onClick={onCopy}
        disabled={busy}
        className={btnClass}
        title='Copy image'
        aria-label='Copy image to clipboard'
      >
        {copied ? <IconCheck /> : <IconCopy />}
      </button>
      {onDownload ? (
        <button
          type='button'
          onClick={onDownload}
          disabled={busy}
          className={btnClass}
          title={downloadLabel}
          aria-label={downloadLabel}
        >
          <IconDownload />
        </button>
      ) : null}
      {onPng ? (
        <button
          type='button'
          onClick={onPng}
          disabled={busy}
          className={btnClass}
          title='Download PNG'
          aria-label='Download PNG'
        >
          <IconDownload />
          <span className='leading-none'>PNG</span>
        </button>
      ) : null}
      {onJpeg ? (
        <button
          type='button'
          onClick={onJpeg}
          disabled={busy}
          className={btnClass}
          title='Download JPEG'
          aria-label='Download JPEG'
        >
          <IconDownload />
          <span className='leading-none'>JPG</span>
        </button>
      ) : null}
      {onVCard ? (
        <button
          type='button'
          onClick={onVCard}
          disabled={disabled}
          className={btnClass}
          title='Download vCard'
          aria-label='Download vCard'
        >
          <IconContact />
        </button>
      ) : null}
    </div>
  );
}
