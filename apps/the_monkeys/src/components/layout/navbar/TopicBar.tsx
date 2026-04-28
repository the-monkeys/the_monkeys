'use client';

import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { TOPIC_ROUTE } from '@/constants/routeConstants';
import { cn } from '@/lib/utils';

const MAIN_TOPICS = [
  { name: 'Business', slug: 'business' },
  { name: 'Tech', slug: 'tech' },
  { name: 'Culture', slug: 'culture' },
  { name: 'Science', slug: 'science' },
  { name: 'Health', slug: 'health' },
  { name: 'Economy', slug: 'economy' },
  { name: 'Art', slug: 'art' },
  { name: 'Travel', slug: 'travel' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Politics', slug: 'politics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Design', slug: 'design' },
];

export const TopicBar = ({
  className,
  pathname,
}: {
  className?: string;
  pathname: string;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.7; // scroll by 70% of visible width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={cn('relative group/nav flex items-center w-full', className)}
    >
      {/* Left gradient and button */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 z-20 flex items-center bg-gradient-to-r from-white via-white/90 to-transparent pr-4 pl-0 transition-opacity duration-300',
          showLeftArrow
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <button
          onClick={() => scroll('left')}
          className='flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 hover:scale-105 transition-all outline-none focus:ring-2 focus:ring-stitch-primary'
          aria-label='Scroll left'
        >
          <Icon name='RiArrowLeftS' size={18} />
        </button>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className='flex items-center gap-7 overflow-x-auto scrollbar-hide py-2 w-full px-1'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {MAIN_TOPICS.map((topic, index) => {
          const href = `${TOPIC_ROUTE}/${topic.slug}`;
          const isActive = pathname === href;
          return (
            <Link
              key={`${topic.slug}-${index}`}
              href={href}
              className={cn(
                'relative whitespace-nowrap font-newsreader font-medium text-[17px] transition-all duration-300 hover:text-gray-900 focus:outline-none',
                isActive ? 'text-gray-900' : 'text-gray-400'
              )}
            >
              {topic.name}
              {isActive && (
                <span className='absolute bottom-[-11px] left-0 right-0 h-[2.5px] bg-stitch-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300' />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right gradient and button */}
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 z-20 flex items-center bg-gradient-to-l from-white via-white/90 to-transparent pl-4 pr-0 transition-opacity duration-300',
          showRightArrow
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <button
          onClick={() => scroll('right')}
          className='flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 hover:scale-105 transition-all outline-none focus:ring-2 focus:ring-stitch-primary'
          aria-label='Scroll right'
        >
          <Icon name='RiArrowRightS' size={18} />
        </button>
      </div>
    </nav>
  );
};
