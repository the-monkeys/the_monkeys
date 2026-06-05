'use client';

import { Label } from '@the-monkeys/ui/atoms/label';

export interface TweetUrlPanelProps {
  value: string;
  onChange: (url: string) => void;
  tweetId: string | null;
  error?: string | null;
}

export const TweetUrlPanel = ({
  value,
  onChange,
  tweetId,
  error,
}: TweetUrlPanelProps) => (
  <div className='flex flex-col gap-2'>
    <div className='flex flex-col gap-1.5'>
      <Label
        htmlFor='snap-tweet-url'
        className='text-xs font-semibold uppercase tracking-wide text-foreground/60'
      >
        X post URL
      </Label>
      <div className='relative flex items-center w-full'>
        {/* Link icon on the left */}
        <div className='absolute left-3 text-foreground/45 pointer-events-none'>
          <svg
            viewBox='0 0 24 24'
            width={16}
            height={16}
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
            <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
          </svg>
        </div>

        <input
          id='snap-tweet-url'
          type='url'
          placeholder='https://x.com/user/status/1234567890'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='h-10 w-full pl-9 pr-9 text-sm rounded-lg border border-border-light/60 dark:border-border-dark/60 bg-background-light dark:bg-background-dark focus:outline-none focus:ring-1 focus:ring-brand-orange text-foreground'
        />

        {/* Clear button on the right */}
        {value && (
          <button
            type='button'
            onClick={() => onChange('')}
            className='absolute right-3 text-foreground/45 hover:text-foreground/75 focus:outline-none'
            aria-label='Clear URL'
          >
            <svg
              viewBox='0 0 24 24'
              width={16}
              height={16}
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        )}
      </div>
    </div>
    {value && !tweetId ? (
      <p className='text-xs text-alert-red'>
        Paste a valid X or Twitter status link (must include /status/…).
      </p>
    ) : null}
    {error ? (
      <p className='text-xs text-alert-red' role='alert'>
        {error}
      </p>
    ) : null}
  </div>
);
