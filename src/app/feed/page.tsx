'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { useSession } from 'next-auth/react';

import { BlogsByInterest } from './components/BlogsByInterest';
import { BlogsByTopic } from './components/BlogsByTopic';
import { LatestBlogs } from './components/LatestBlogs';

const BlogFeedPage = ({
  searchParams,
}: {
  searchParams: { source: string; topic: string };
}) => {
  const { data: session, status } = useSession();

  const getDefaultTab = () => {
    if (searchParams.topic) return searchParams.topic;
    if (searchParams.source === 'following') return 'following';
    if (searchParams.source === 'interests') return 'interests';
    return 'all';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab);
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
    <div className='mx-auto max-w-3xl'>
      <div className='relative mx-0 lg:mx-6 flex items-center gap-2 overflow-hidden'>
        {showLeftButton && (
          <div className='absolute top-0 left-0 pr-[30px] bg-gradient-to-r from-background-light dark:from-background-dark from-[50%] z-10'>
            <button
              onClick={() => scrollTabs('left')}
              className='p-1 opacity-100 hover:opacity-80'
            >
              <Icon name='RiArrowUpS' className='-rotate-90' />
            </button>
          </div>
        )}

        <div
          ref={tabContainerRef}
          className='w-fit flex items-center gap-5 overflow-hidden pr-[20px]'
        >
          <div
            data-state={activeTab === 'all' ? 'active' : 'inactive'}
            className='group'
          >
            <Link href='/feed?source=all'>
              <button
                onClick={() => setActiveTab('all')}
                className='font-dm_sans opacity-80 hover:opacity-100 group-data-[state=active]:opacity-100 whitespace-nowrap capitalize'
              >
                Latest
              </button>
            </Link>

            <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
          </div>

          <div
            data-state={activeTab === 'interests' ? 'active' : 'inactive'}
            className='group'
          >
            <Link href='/feed?source=interests'>
              <button
                onClick={() => setActiveTab('interests')}
                className='font-dm_sans opacity-80 hover:opacity-100 group-data-[state=active]:opacity-100 whitespace-nowrap capitalize'
              >
                Your Interests
              </button>
            </Link>

            <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
          </div>

          {/* <div
            data-state={activeTab === 'following' ? 'active' : 'inactive'}
            className='group'
          >
            <Link href='/feed?source=following'>
              <button
                onClick={() => setActiveTab('following')}
                className='font-dm_sans opacity-80 hover:opacity-100 group-data-[state=active]:opacity-100 whitespace-nowrap'
              >
                Following
              </button>
            </Link>

            <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
          </div> */}

          {searchParams.topic && (
            <div
              data-state={
                activeTab === searchParams.topic ? 'active' : 'inactive'
              }
              className='group'
            >
              <Link href={`/feed?topic=${searchParams.topic}`}>
                <button
                  onClick={() => setActiveTab(searchParams.topic)}
                  className='font-dm_sans opacity-80 hover:opacity-100 group-data-[state=active]:opacity-100 whitespace-nowrap capitalize'
                >
                  {searchParams.topic}
                </button>
              </Link>

              <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
            </div>
          )}
        </div>

        {showRightButton && (
          <div className='absolute top-0 right-0 pl-[30px] bg-gradient-to-l from-background-light dark:from-background-dark from-[50%] z-10'>
            <button
              onClick={() => scrollTabs('right')}
              className='p-1 opacity-100 hover:opacity-80'
            >
              <Icon name='RiArrowUpS' className='rotate-90' />
            </button>
          </div>
        )}
      </div>

      <div className='mt-6 md:mt-8 divide-y divide-foreground-light dark:divide-foreground-dark'>
        {activeTab === 'all' && <LatestBlogs status={status} />}
        {activeTab === 'interests' && (
          <BlogsByInterest username={session?.user.username} status={status} />
        )}
        {activeTab === searchParams.topic && (
          <BlogsByTopic topic={searchParams.topic} status={status} />
        )}
      </div>
    </div>
  );
};

export default BlogFeedPage;
