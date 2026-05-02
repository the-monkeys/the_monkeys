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
  variant?: 'horizontal' | 'vertical' | 'list';
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
        <article className='flex flex-col md:flex-row  hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group overflow-hidden'>
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

            <div className='pt-6  flex flex-wrap justify-between items-center gap-4'>
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

              <div className='flex items-center gap-2 text-gray-400 dark:text-gray-500'>
                <div className='flex items-center  hover:text-brand-orange transition-colors cursor-pointer group/action'>
                  <LikeButton blogId={blogId} size={20} />
                  <LikesCount blogId={blog.blog_id} />
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

  if (variant === 'list') {
    return (
      <div className='pb-4 border-b-1 border-border-light/60 dark:border-border-dark/60'>
        <article className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
          <div className='shrink-0 aspect-[3/2] h-[200px] sm:h-fit w-full sm:w-[210px] bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-sm shadow-sm overflow-hidden'>
            <Link href={blogURL} className='group'>
              {isNonValidBannerImage(imageContent) ? (
                <BlogPlaceholderImage
                  title={titleContent}
                  className='group-hover:scale-105 transition-transform duration-200'
                />
              ) : (
                <BlogImage
                  title={titleContent}
                  image={imageContent}
                  className='group-hover:scale-105 transition-transform duration-200'
                />
              )}
            </Link>
          </div>

          <div className='w-full flex flex-col justify-between gap-[10px]'>
            <div>
              <UserInfoCardShowcase authorID={authorId} date={date} />

              <Link href={blogURL} className='w-full'>
                <BlogTitle
                  className='pt-2 font-semibold text-[1.12rem] leading-[1.4] hover:underline underline-offset-2 line-clamp-2'
                  title={titleContent || 'Untitled Post'}
                />
              </Link>

              {descriptionContent !== '' && (
                <BlogDescription
                  description={descriptionContent}
                  className='pt-[6px] text-[0.9rem] line-clamp-2 sm:line-clamp-1 opacity-90'
                />
              )}
            </div>

            <div className='pt-3 w-full flex justify-between items-center gap-2'>
              <div className='flex items-center gap-[6px]'>
                {blog?.tags.length ? (
                  <div className='w-fit flex items-center gap-1'>
                    <Link
                      href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
                      target='_blank'
                      className='shrink-0 font-medium text-sm text-brand-orange capitalize hover:underline'
                    >
                      {blog?.tags[0]}
                    </Link>
                  </div>
                ) : (
                  <p className='shrink-0 text-sm opacity-90 italic'>Untagged</p>
                )}

                <p className='font-medium text-sm opacity-80'>{' · '}</p>

                <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} size={16} />
              </div>

              {showBookmarkOption && (
                <BookmarkButton blogId={blog?.blog_id} size={16} />
              )}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className='pb-8'>
      <article className='flex flex-col    transition-all duration-300 group'>
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

        <div className='mt-8 pt-4  flex justify-between items-center'>
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

          <div className='flex items-center gap-2 text-gray-400 dark:text-gray-500'>
            <div className='flex items-center  hover:text-brand-orange transition-colors cursor-pointer group/action'>
              <LikeButton blogId={blogId} size={18} />
              <LikesCount blogId={blog.blog_id} />
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
