'use client';

const btnClass =
  'flex items-center justify-center h-10 w-12 shrink-0 rounded-lg border border-border-light/60 dark:border-border-dark/60 bg-background-light dark:bg-background-dark text-foreground hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

export async function copyBlobToClipboard(blob: Blob) {
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
}

export const CopyImageButton = ({
  onClick,
  disabled,
  copied,
  copying,
}: {
  onClick: () => void;
  disabled?: boolean;
  copied: boolean;
  copying: boolean;
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled || copying}
    className={btnClass}
    title='Copy to Clipboard'
    aria-label='Copy image to clipboard'
  >
    {copied ? (
      <svg
        viewBox='0 0 24 24'
        width={18}
        height={18}
        fill='none'
        stroke='#10B981'
        strokeWidth={2.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polyline points='20 6 9 17 4 12' />
      </svg>
    ) : copying ? (
      <svg
        className='animate-spin h-5 w-5 text-foreground/50'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    ) : (
      <svg
        viewBox='0 0 24 24'
        width={18}
        height={18}
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
        <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
      </svg>
    )}
  </button>
);
