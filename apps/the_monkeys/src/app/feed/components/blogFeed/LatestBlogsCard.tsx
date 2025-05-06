'use client';

import useGetLatest100Blogs from '@/hooks/blog/useGetLatest100Blogs';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export const LatestBlogsCard = () => {
  const { blogs, isError, isLoading } = useGetLatest100Blogs();

  if (isError)
    return (
      <p className='w-full text-sm opacity-80 text-center'>
        Oops! Something went wrong. Please try again.
      </p>
    );

  return (
    <div
      className={
        'min-h-40 rounded-xl border border-border-dark p-4 sm:p-8 dark:shadow'
      }
    >
      <h2 className='text-brand-orange text-titleMedium font-semibold'>
        Latest on Monkeys
      </h2>

      {isLoading ? (
        <div>
          <div className='h-12 py-2'>
            <Skeleton className='h-6' />
          </div>
          <div className='h-12 py-2'>
            <Skeleton className='h-6' />
          </div>
          <div className='h-12 py-2'>
            <Skeleton className='h-6' />
          </div>
          <div className='h-12 py-2'>
            <Skeleton className='h-6' />
          </div>
          <div className='h-12 py-2'>
            <Skeleton className='h-6' />
          </div>
          <div className='h-12 py-2'>
            <Skeleton className='h-6' />
          </div>
        </div>
      ) : (
        <div className='divide-y divide-border-light dark:divide-border-dark'>
          {blogs?.blogs &&
            blogs?.blogs.slice(0, 5).map((blog) => {
              return (
                <a
                  href={`/blog/${blog.blog_id}`}
                  key={blog.blog_id}
                  className='py-4 flex items-baseline hover:opacity-50 gap-2 text-nowrap'
                >
                  <span className='text-bodySmall text-nowrap'>
                    {new Date(blog.published_time).toLocaleTimeString(
                      undefined,
                      {
                        timeStyle: 'short',
                      }
                    )}
                  </span>
                  <p className='text-bodyLarge overflow-hidden text-ellipsis'>
                    {purifyHTMLString(blog.blog.blocks[0].data.text)}
                  </p>
                </a>
              );
            })}
        </div>
      )}

      <a href='/feed/latest' className='mt-2 text-brand-orange hover:underline'>
        View All
      </a>
    </div>
  );
};
