'use client';

import { useEffect, useRef, useState } from 'react';

import FeaturedAuthorAvatar from '@/components/editorial/FeaturedAuthorAvatar';
import Icon from '@/components/icon';
import useActiveUsers from '@/hooks/user/useActiveUsers';

/**
 * Curated leaders we always want surfaced (verified to have profile
 * pictures). Anything from the active-users API is appended after, with
 * the most recently active appearing first.
 */
const PINNED_AUTHORS: ReadonlyArray<{ username: string; firstName: string }> = [
  { username: 'k_young', firstName: 'Karen' },
  { username: 'innovation_hub', firstName: 'Innovation' },
  { username: 'euro_centric', firstName: 'Euro' },
];

interface FeaturedAuthorsStripProps {
  title?: string;
}

/**
 * Horizontally-scrollable strip of featured authors.
 *
 * Composition order:
 *   1. Pinned editorial leaders (always shown when they have a picture).
 *   2. Recently active users from `/api/v2/user/active-users`, reversed
 *      so the most recent activity floats to the front, de-duplicated
 *      against the pinned list.
 *
 * Avatars without a real profile picture hide themselves, so the strip
 * is implicitly filtered to users who have uploaded an image.
 */
export const FeaturedAuthorsStrip = ({
  title = 'Featured authors:',
}: FeaturedAuthorsStripProps) => {
  const { details } = useActiveUsers('24h');

  // Reverse so the most recently active user (Dave, per current data)
  // appears first after the pinned leaders.
  const recent = [...details].reverse();

  // De-dupe by username (case-insensitive) — pinned wins over API.
  const seen = new Set(PINNED_AUTHORS.map((u) => u.username.toLowerCase()));
  const apiUsers: Array<{ username: string; firstName?: string }> = [];
  for (const u of recent) {
    const uname = u.username?.trim();
    if (!uname) continue;
    // Skip entries whose "username" is actually a raw account_id hash
    // (32-char hex) — those users have no resolvable storage path.
    if (/^[a-f0-9]{32}$/i.test(uname)) continue;
    const key = uname.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    apiUsers.push({
      username: uname,
      firstName: u.first_name || uname,
    });
  }

  const allAuthors = [...PINNED_AUTHORS, ...apiUsers];

  // Scroll plumbing — chevrons appear only when content overflows.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const recompute = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    recompute();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', recompute);
    window.addEventListener('resize', recompute);
    return () => {
      el.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
    };
  }, [allAuthors.length]);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(240, Math.floor(el.clientWidth * 0.8));
    el.scrollTo({
      left: dir === 'left' ? el.scrollLeft - step : el.scrollLeft + step,
      behavior: 'smooth',
    });
  };

  return (
    <section className='pb-4'>
      <h4 className='font-dm_sans text-sm font-medium text-gray-400 mb-3'>
        {title}
      </h4>

      <div className='relative flex items-center gap-2'>
        {showLeft && (
          <button
            onClick={() => scrollBy('left')}
            className='absolute left-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            aria-label='Scroll left'
            type='button'
          >
            <Icon
              name='RiArrowLeft'
              size={18}
              className='text-gray-700 dark:text-gray-200'
            />
          </button>
        )}

        <div className='flex-1 overflow-hidden'>
          <div
            ref={scrollRef}
            className='flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide'
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {allAuthors.map((u) => (
              <FeaturedAuthorAvatar
                key={u.username}
                username={u.username}
                firstName={u.firstName}
              />
            ))}
          </div>
        </div>

        {showRight && (
          <button
            onClick={() => scrollBy('right')}
            className='absolute right-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            aria-label='Scroll right'
            type='button'
          >
            <Icon
              name='RiArrowRight'
              size={18}
              className='text-gray-700 dark:text-gray-200'
            />
          </button>
        )}
      </div>
    </section>
  );
};

export default FeaturedAuthorsStrip;
