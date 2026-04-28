'use client';

import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { LikesCount } from '@/components/blog/LikesCount';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import {
  BlogDescription,
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';

export const FeedBlogCard = ({
  blog,
  showBookmarkOption = false,
  variant = 'vertical',
}: {
  blog: MetaBlog;
  showBookmarkOption?: boolean;
  variant?: 'horizontal' | 'vertical';
}) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = purifyHTMLString(blog?.title);
  const descriptionContent = purifyHTMLString(blog?.first_paragraph);
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);
  const blogURL = `${BLOG_ROUTE}/${blogSlug}-${blogId}`;

  if (variant === 'horizontal') {
    return (
      <div className='pb-10 w-full'>
        <article className='flex flex-col md:flex-row bg-white dark:bg-background-dark border-1 border-gray-100 dark:border-border-dark shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group overflow-hidden'>
          <div className='md:w-[40%] aspect-[3/2] md:aspect-auto relative bg-gray-50 dark:bg-gray-800 overflow-hidden'>
            <Link href={blogURL} className='block h-full w-full'>
              {isNonValidBannerImage(imageContent) ? (
                <BlogPlaceholderImage
                  title={titleContent}
                  className='group-hover:scale-105 transition-transform duration-1000 ease-out h-full w-full object-cover'
                />
              ) : (
                <BlogImage
                  title={titleContent}
                  image={imageContent}
                  className='group-hover:scale-105 transition-transform duration-1000 ease-out h-full w-full object-cover'
                />
              )}
            </Link>
          </div>

          <div className='md:w-[60%] px-6 py-8 md:px-10 flex flex-col justify-between gap-8'>
            <div className='space-y-4'>
              {blog?.tags.length > 0 && (
                <Link
                  href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
                  className='inline-block font-inter font-bold text-[12px] text-brand-orange uppercase tracking-[0.2em] hover:opacity-80 transition-opacity'
                >
                  {blog?.tags[0]}
                </Link>
              )}

              <Link href={blogURL} className='block group/title'>
                <BlogTitle
                  className='font-newsreader font-bold text-[32px] md:text-[40px] leading-[1.1] text-gray-900 dark:text-gray-100 group-hover/title:text-brand-orange transition-colors line-clamp-3'
                  title={titleContent || 'Untitled Post'}
                />
              </Link>

              {descriptionContent !== '' && (
                <BlogDescription
                  description={descriptionContent}
                  className='text-[16px] md:text-[18px] font-inter text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mt-2'
                />
              )}
            </div>

            <div className='pt-6 border-t border-gray-50 dark:border-border-dark flex flex-wrap justify-between items-center gap-4'>
              <div className='flex items-center gap-4'>
                <UserInfoCardShowcase
                  authorID={authorId}
                  date={date}
                  hideDate
                />
                <span className='text-[13px] font-inter text-gray-400 dark:text-gray-500'>
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className='flex items-center gap-4 text-gray-400 dark:text-gray-500'>
                <div className='flex items-center gap-1.5 hover:text-brand-orange transition-colors cursor-pointer group/action'>
                  <LikeButton blogId={blogId} size={20} />
                  <span className='text-xs font-semibold'>
                    <LikesCount blogId={blogId} />
                  </span>
                </div>
                <div className='hover:text-brand-orange transition-colors cursor-pointer'>
                  <BlogShareDialog
                    blogURL={`${LIVE_URL}${blogURL}`}
                    size={20}
                  />
                </div>
                {showBookmarkOption && (
                  <div className='hover:text-brand-orange transition-colors cursor-pointer'>
                    <BookmarkButton blogId={blog?.blog_id} size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className='pb-8'>
      <article className='flex flex-col p-5 bg-white dark:bg-background-dark border-2 border-gray-100 dark:border-border-dark shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group'>
        <div className='aspect-[16/9] w-full bg-gray-50 dark:bg-gray-800 overflow-hidden relative'>
          <Link href={blogURL}>
            {isNonValidBannerImage(imageContent) ? (
              <BlogPlaceholderImage
                title={titleContent}
                className='group-hover:scale-105 transition-transform duration-700 ease-out'
              />
            ) : (
              <BlogImage
                title={titleContent}
                image={imageContent}
                className='group-hover:scale-105 transition-transform duration-700 ease-out'
              />
            )}
          </Link>
        </div>

        <div className='mt-6 flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            {blog?.tags.length ? (
              <Link
                href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
                className='font-inter font-medium text-xs text-gray-500 uppercase tracking-widest hover:text-brand-orange transition-colors'
              >
                {blog?.tags[0]}
              </Link>
            ) : (
              <span className='text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest'>
                Uncategorized
              </span>
            )}
          </div>

          <Link href={blogURL} className='group/title'>
            <BlogTitle
              className='font-dm_sans font-bold text-[24px] leading-[1.2] text-gray-900 dark:text-gray-100 group-hover/title:text-brand-orange transition-colors line-clamp-2'
              title={titleContent || 'Untitled Post'}
            />
          </Link>

          {descriptionContent !== '' && (
            <BlogDescription
              description={descriptionContent}
              className='text-[15px] font-inter text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'
            />
          )}
        </div>

        <div className='mt-8 pt-4 border-t border-gray-50 dark:border-border-dark flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <UserInfoCardShowcase authorID={authorId} date={date} hideDate />
            <span className='text-[13px] font-inter text-gray-400 dark:text-gray-500'>
              {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className='flex items-center gap-4 text-gray-400 dark:text-gray-500'>
            <div className='flex items-center gap-1.5 hover:text-brand-orange transition-colors cursor-pointer group/action'>
              <LikeButton blogId={blogId} size={18} />
              <span className='text-xs font-medium'>
                <LikesCount blogId={blogId} />
              </span>
            </div>
            <div className='hover:text-brand-orange transition-colors cursor-pointer'>
              <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} size={18} />
            </div>
            {showBookmarkOption && (
              <div className='hover:text-brand-orange transition-colors cursor-pointer'>
                <BookmarkButton blogId={blog?.blog_id} size={18} />
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};
