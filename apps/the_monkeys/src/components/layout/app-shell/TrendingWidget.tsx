'use client';

import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import Icon from '@/components/icon';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

interface TrendingWidgetProps {
  blogs?: MetaBlog[];
  isLoading?: boolean;
}

export function TrendingWidget({
  blogs = [],
  isLoading = false,
}: TrendingWidgetProps) {
  if (isLoading) {
    return (
      <div className='p-6 bg-white border border-gray-100 animate-pulse'>
        <div className='h-6 w-32 bg-gray-100 rounded mb-8'></div>
        <div className='space-y-8'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='flex gap-4'>
              <div className='h-8 w-12 bg-gray-50 rounded'></div>
              <div className='flex-1 space-y-2'>
                <div className='h-4 w-full bg-gray-100 rounded'></div>
                <div className='h-3 w-2/3 bg-gray-50 rounded'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white  border border-gray-100 shadow-sm overflow-hidden'>
      <div className='p-6 pb-5 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10'>
        <h2 className='font-inter font-extrabold text-[12px] text-gray-900 uppercase tracking-[0.2em]'>
          Trending Now
        </h2>
        <Icon name='RiArrowRightUp' size={20} />
      </div>

      <div className='divide-y divide-gray-50'>
        {blogs.slice(0, 4).map((blog, index) => {
          const title = purifyHTMLString(blog.title);
          const slug = generateSlug(title);
          const url = `${BLOG_ROUTE}/${slug}-${blog.blog_id}`;
          const tag = blog.tags?.[0] || 'Monkeys';

          return (
            <div
              key={blog.blog_id}
              className='group relative p-6 py-7 hover:bg-gray-50/40 transition-colors'
            >
              <div className='flex gap-6 items-start'>
                <span className='font-inter font-black text-5xl text-gray-100 group-hover:text-gray-200 transition-colors leading-none shrink-0 '>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className='flex-1 space-y-3'>
                  <Link href={url} className='block group/title'>
                    <h3 className='font-newsreader font-bold text-[18px] leading-[1.25] text-gray-900 group-hover/title:text-stitch-primary transition-colors line-clamp-2'>
                      {title}
                    </h3>
                  </Link>

                  <div className='flex items-center gap-2 font-inter font-bold text-[10px] text-gray-400 uppercase tracking-widest'>
                    <span className='text-gray-500'>{tag}</span>
                    <span className='text-gray-300'>•</span>
                    <span>Trending Now</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='p-4 border-t border-gray-50 bg-gray-50/30'>
        <Link
          href='/feed'
          className='flex items-center justify-center w-full py-3 border border-gray-200 bg-white rounded font-inter font-bold text-[11px] text-gray-900 uppercase tracking-widest hover:bg-gray-50 transition-colors'
        >
          View All Trending
        </Link>
      </div>
    </div>
  );
}
