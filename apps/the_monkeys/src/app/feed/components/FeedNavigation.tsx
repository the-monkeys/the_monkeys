'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';

export const FeedNavigation = ({
  feedSource = 'feed',
}: {
  feedSource: string;
}) => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const checkOverflow = () => {
    if (tabContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabContainerRef.current;

      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  useEffect(() => {
    if (tabContainerRef.current) {
      tabContainerRef.current.addEventListener('scroll', checkOverflow);
    }

    return () => {
      if (tabContainerRef.current) {
        tabContainerRef.current.removeEventListener('scroll', checkOverflow);
      }
    };
  }, []);

  const SCROLL_OFFSET = 350;

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabContainerRef.current) {
      const scrollAmount =
        direction === 'right' ? SCROLL_OFFSET : -SCROLL_OFFSET;
      tabContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='relative px-0 lg:px-6 flex items-center gap-2 overflow-hidden border-b-1 border-foreground-light dark:border-foreground-dark'>
      {showLeftButton && (
        <div className='absolute top-0 left-0 pr-[30px] bg-gradient-to-r from-background-light dark:from-background-dark from-[10%] z-10'>
          <button
            onClick={() => scrollTabs('left')}
            className='pl-0 p-1 opacity-100 hover:opacity-80'
          >
            <Icon name='RiArrowUpS' className='-rotate-90' />
          </button>
        </div>
      )}

      <div
        ref={tabContainerRef}
        className='w-fit flex items-center gap-4 overflow-hidden pr-[20px]'
      >
        <div
          data-state={feedSource === 'feed' ? 'active' : 'inactive'}
          className='group'
        >
          <Link href='/feed?source=feed'>
            <button className='px-1 font-dm_sans text-[15px] opacity-80 hover:opacity-100 group-data-[state=active]:opacity-100 whitespace-nowrap capitalize'>
              Showcase
            </button>
          </Link>

          <div className='mx-auto mt-[6px] h-[3px] w-0 bg-brand-orange group-data-[state=active]:w-full rounded-t-full transition-all' />
        </div>

        <div
          data-state={feedSource === 'all' ? 'active' : 'inactive'}
          className='group'
        >
          <Link href='/feed?source=all'>
            <button className='px-1 font-dm_sans text-[15px] opacity-80 hover:opacity-100 group-data-[state=active]:opacity-100 whitespace-nowrap capitalize'>
              Latest
            </button>
          </Link>

          <div className='mx-auto mt-[6px] h-[3px] w-0 bg-brand-orange group-data-[state=active]:w-full rounded-t-full transition-all' />
        </div>

        <div
          data-state={feedSource === 'following' ? 'active' : 'inactive'}
          className='group'
        >
          <Link href='/feed?source=following'>
            <button className='px-1 font-dm_sans text-[15px] opacity-80 hover:opacity-100 group-data-[state=active]:opacity-100 whitespace-nowrap capitalize'>
              Following
            </button>
          </Link>

          <div className='mx-auto mt-[6px] h-[3px] w-0 bg-brand-orange group-data-[state=active]:w-full rounded-t-full transition-all' />
        </div>
      </div>

      {showRightButton && (
        <div className='absolute top-0 right-0 pl-[30px] bg-gradient-to-l from-background-light dark:from-background-dark from-[10%] z-10'>
          <button
            onClick={() => scrollTabs('right')}
            className='pl-0 p-1 opacity-100 hover:opacity-80'
          >
            <Icon name='RiArrowUpS' className='rotate-90' />
          </button>
        </div>
      )}
    </div>
  );
};
