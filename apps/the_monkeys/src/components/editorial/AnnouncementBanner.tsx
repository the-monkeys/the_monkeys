'use client';

import { useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';

/**
 * Thin brand-orange announcement strip rendered at the top of the feed.
 * Mirrors the editorial pattern of a leading callout without using
 * news-vocabulary ("BREAKING"). Defaults read as a research-platform
 * "SPOTLIGHT" highlight.
 */
export interface AnnouncementBannerProps {
  label?: string;
  message: string;
  href?: string;
  ctaLabel?: string;
}

export const AnnouncementBanner = ({
  label = 'Spotlight',
  message,
  href = '#',
  ctaLabel = 'Read',
}: AnnouncementBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className='w-full bg-brand-orange text-white'>
      <div className='flex items-stretch gap-0'>
        {/* Label */}
        <span className='shrink-0 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-black/15 font-inter font-extrabold text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] flex items-center'>
          {label}
        </span>

        {/* Message */}
        <p className='flex-1 min-w-0 px-2.5 sm:px-4 py-2 sm:py-2.5 font-inter text-[12px] sm:text-sm leading-snug truncate self-center'>
          {message}
        </p>

        {/* CTA */}
        <Link
          href={href}
          className='shrink-0 px-2.5 sm:px-4 py-2 sm:py-2.5 font-inter font-bold text-[11px] sm:text-sm uppercase tracking-[0.08em] sm:tracking-[0.12em] inline-flex items-center gap-1 hover:bg-black/10 transition-colors'
        >
          {ctaLabel}
          <Icon name='RiArrowRight' size={14} />
        </Link>

        {/* Dismiss */}
        <button
          aria-label='Dismiss announcement'
          onClick={() => setDismissed(true)}
          className='shrink-0 px-2 sm:px-3 py-2 sm:py-2.5 inline-flex items-center justify-center text-white/70 hover:text-white hover:bg-black/10 transition-colors'
        >
          <Icon name='RiClose' size={16} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
