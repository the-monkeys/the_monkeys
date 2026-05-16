'use client';

import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import Icon from '@/components/icon';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import useGetTrendingBlogs from '@/hooks/blog/useGetTrendingBlogs';
import { getRelativeTime } from '@/lib/utils';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

const MAX_TRENDING_ITEMS = 4;
const SKELETON_ITEMS = 5;

export function TrendingWidget() {
  const { blogs, isLoading, isError } = useGetTrendingBlogs();

  if (isLoading) {
    return (
      <div className='p-6 bg-white dark:bg-background-dark'>
        <Skeleton className='h-6 w-32 mb-8' />
        <div className='space-y-8'>
          {Array.from({ length: SKELETON_ITEMS }).map((_, i) => (
            <div key={i} className='flex gap-4'>
              <Skeleton className='h-8 w-12' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-3 w-2/3' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || blogs.length === 0) {
    return (
      <div className='bg-white dark:bg-background-dark  shadow-sm overflow-hidden'>
        <div className='p-6 pb-5 flex items-center justify-between  bg-white dark:bg-background-dark'>
          <h2 className='font-inter font-extrabold text-[12px] text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em]'>
            Trending Now
          </h2>
          <Icon name='RiArrowRightUp' size={20} />
        </div>
        <div className='p-8 text-center'>
          <p className='font-inter text-sm text-gray-500 dark:text-gray-400'>
            {isError
              ? 'Unable to load trending posts'
              : 'No trending posts available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-background-dark  shadow-sm overflow-hidden'>
      <div className='p-6 pb-5 flex items-center justify-between  bg-white dark:bg-background-dark sticky top-0 z-10'>
        <h2 className='font-inter font-extrabold text-[12px] text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em]'>
          Trending Now
        </h2>
        <Icon name='RiArrowRightUp' size={20} />
      </div>

      <div className='divide-y divide-gray-50 dark:divide-border-dark'>
        {blogs.slice(0, MAX_TRENDING_ITEMS).map((blog, index) => {
          const title = purifyHTMLString(blog.title);
          const slug = generateSlug(title);
          const url = `${BLOG_ROUTE}/${slug}-${blog.blog_id}`;
          const tag = blog.tags?.[0];
          const publish_time = getRelativeTime(blog.published_time);
          return (
            <div
              key={blog.blog_id}
              className='group relative p-6 py-7  transition-colors'
            >
              <div className='flex gap-6 items-start'>
                <span className='font-inter font-black text-5xl text-text-light/20 dark:text-text-dark/20 group-hover:text-gray-200 dark:group-hover:text-gray-500 transition-colors leading-none shrink-0 '>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className='flex-1 space-y-3'>
                  <Link href={url} className='block group/title'>
                    <h3 className='font-newsreader font-bold text-[18px] leading-[1.25] text-gray-900 dark:text-gray-100 group-hover/title:text-brand-orange transition-colors line-clamp-2'>
                      {title}
                    </h3>
                  </Link>

                  <div className='flex items-center gap-2 font-inter font-bold text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest'>
                    {tag && (
                      <span className='text-gray-500 dark:text-gray-400'>
                        {tag}
                      </span>
                    )}
                    <span className='text-gray-300 dark:text-gray-600'>•</span>
                    <span>{publish_time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
