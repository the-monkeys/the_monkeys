'use client';

import { Suspense, useEffect, useRef, useState } from 'react';

import Icon from '@/components/icon';

import { FeaturedAuthorStorySkeleton } from './FeaturedAuthorStorySkeleton';
import { FeaturedAuthorsList } from './FeaturedAuthorsList';

interface FeaturedAuthorsSectionProps {
  users: Array<{ userID: string }>;
  title?: string;
}

/**
 * Loading skeleton showing multiple author placeholders
 */
function FeaturedAuthorsLoadingSkeleton() {
  return (
    <div className='flex gap-4 overflow-x-auto pb-4'>
      {Array.from({ length: 5 }).map((_, i) => (
        <FeaturedAuthorStorySkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Featured Authors Section Component
 * Complete section with title and featured authors list
 * Includes navigation chevrons and responsive design
 */
export function FeaturedAuthorsSection({
  users,
  title = 'Featured authors:',
}: FeaturedAuthorsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);

  // Check scroll position to show/hide chevrons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setShowLeftChevron(scrollLeft > 0);
      setShowRightChevron(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Initialize scroll state
  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [users]);

  // Scroll handler
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const currentScroll = scrollContainerRef.current.scrollLeft;

      scrollContainerRef.current.scrollTo({
        left:
          direction === 'left'
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className='pb-4'>
      <h4 className='font-dm_sans text-sm font-medium text-gray-400 mb-3'>
        {title}
      </h4>

      {/* Container with chevrons */}
      <div className='relative flex items-center gap-2'>
        {/* Left Chevron - Always visible when scrollable */}
        {showLeftChevron && (
          <button
            onClick={() => handleScroll('left')}
            className='absolute left-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            aria-label='Scroll left'
          >
            <Icon
              name='RiArrowLeft'
              size={18}
              className='text-gray-700 dark:text-gray-200'
            />
          </button>
        )}

        {/* Scrollable List */}
        <div className='flex-1 overflow-hidden'>
          <Suspense fallback={<FeaturedAuthorsLoadingSkeleton />}>
            <FeaturedAuthorsList ref={scrollContainerRef} users={users} />
          </Suspense>
        </div>

        {/* Right Chevron - Always visible when scrollable */}
        {showRightChevron && (
          <button
            onClick={() => handleScroll('right')}
            className='absolute right-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            aria-label='Scroll right'
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
}
