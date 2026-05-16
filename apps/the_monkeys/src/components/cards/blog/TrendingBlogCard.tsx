import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
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

export const TrendingBlogCardLarge = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = purifyHTMLString(blog?.title);
  const descriptionContent = blog?.first_paragraph;
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);
  const blogURL = `${BLOG_ROUTE}/${blogSlug}-${blogId}`;

  return (
    <div className='h-full'>
      <article className='h-full w-full flex flex-col sm:flex-row [@media(min-width:1200px)]:flex-col gap-5 sm:gap-6 p-4 sm:p-6 bg-background-light dark:bg-background-dark rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300'>
        <div className='shrink-0 h-[200px] sm:h-[260px] [@media(min-width:1200px)]:h-[350px] w-full sm:w-1/2 [@media(min-width:1200px)]:w-full bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden'>
          {isNonValidBannerImage(imageContent) ? (
            <BlogPlaceholderImage
              title={titleContent}
              className='hover:scale-105 transition-transform duration-500 ease-out'
            />
          ) : (
            <BlogImage
              title={titleContent}
              image={imageContent}
              className='hover:scale-105 transition-transform duration-500 ease-out'
            />
          )}
        </div>

        <div className='w-full flex flex-col justify-between py-1'>
          <div>
            <UserInfoCardShowcase authorID={authorId} date={date} />

            <Link href={blogURL} className='w-full block mt-4'>
              <BlogTitle
                className='font-newsreader font-semibold text-2xl md:text-3xl leading-tight text-text-light dark:text-text-dark hover:text-brand-orange transition-colors line-clamp-2'
                title={titleContent || 'Untitled Post'}
              />
            </Link>

            {descriptionContent !== '' && (
              <BlogDescription
                description={descriptionContent}
                className='mt-3 text-lg font-inter text-text-light dark:text-text-dark/80 line-clamp-3 leading-relaxed'
              />
            )}
          </div>

          <div className='mt-6 w-full flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {blog?.tags.length ? (
                <Link
                  href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
                  target='_blank'
                  className='px-3 py-1 bg-brand-orange/10 rounded-full font-inter font-bold text-xs text-brand-orange uppercase tracking-wider hover:bg-brand-orange/20 transition-colors'
                >
                  {blog?.tags[0]}
                </Link>
              ) : (
                <span className='text-xs text-gray-500 dark:text-gray-400 italic'>
                  Untagged
                </span>
              )}
            </div>

            <div className='hover:text-brand-orange transition-colors cursor-pointer text-gray-500 dark:text-gray-400'>
              <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} size={20} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export const TrendingBlogCardSmall = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = purifyHTMLString(blog?.title);
  const descriptionContent = purifyHTMLString(blog?.first_paragraph);
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);
  const blogURL = `${BLOG_ROUTE}/${blogSlug}-${blogId}`;

  return (
    <div className='h-full'>
      <article className='h-full w-full flex flex-col gap-4 p-4 sm:p-5 bg-background-light dark:bg-background-dark rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300'>
        <div className='shrink-0 aspect-[4/3] h-[180px] sm:h-fit max-h-[250px] w-full bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden'>
          <Link href={blogURL} className='group'>
            {isNonValidBannerImage(imageContent) ? (
              <BlogPlaceholderImage
                title={titleContent}
                className='group-hover:scale-105 transition-transform duration-500 ease-out'
              />
            ) : (
              <BlogImage
                title={titleContent}
                image={imageContent}
                className='group-hover:scale-105 transition-transform duration-500 ease-out'
              />
            )}
          </Link>
        </div>

        <div className='h-full w-full flex flex-col justify-between py-1'>
          <div>
            <UserInfoCardShowcase authorID={authorId} date={date} />

            <Link href={blogURL} className='w-full block mt-3'>
              <BlogTitle
                className='font-newsreader font-semibold text-xl leading-snug text-text-light dark:text-text-dark hover:text-brand-orange transition-colors line-clamp-2'
                title={titleContent || 'Untitled Post'}
              />
            </Link>

            {descriptionContent !== '' && (
              <BlogDescription
                description={descriptionContent}
                className='mt-2 text-base font-inter text-text-light dark:text-text-dark/80 line-clamp-2 leading-relaxed'
              />
            )}
          </div>

          <div className='mt-4 w-full flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {blog?.tags.length ? (
                <Link
                  href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
                  target='_blank'
                  className='px-3 py-1 bg-brand-orange/10 rounded-full font-inter font-bold text-xs text-brand-orange uppercase tracking-wider hover:bg-brand-orange/20 transition-colors'
                >
                  {blog?.tags[0]}
                </Link>
              ) : (
                <span className='text-xs text-gray-500 dark:text-gray-400 italic'>
                  Untagged
                </span>
              )}
            </div>

            <div className='hover:text-brand-orange transition-colors cursor-pointer text-gray-500 dark:text-gray-400'>
              <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} size={18} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
