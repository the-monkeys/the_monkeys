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
    <div>
      <article className='h-full w-full flex flex-col sm:flex-row [@media(min-width:1200px)]:flex-col gap-[10px] sm:gap-5 [@media(min-width:1200px)]:gap-[10px]'>
        <div className='shrink-0 h-[200px] sm:h-[260px] [@media(min-width:1200px)]:h-[350px] w-full sm:w-1/2 [@media(min-width:1200px)]:w-full bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-sm shadow-sm overflow-hidden'>
          {isNonValidBannerImage(imageContent) ? (
            <BlogPlaceholderImage title={titleContent} />
          ) : (
            <BlogImage title={titleContent} image={imageContent} />
          )}
        </div>

        <div className='w-full flex flex-col justify-between gap-[10px]'>
          <div>
            <UserInfoCardShowcase authorID={authorId} date={date} />

            <Link href={blogURL} className='w-full'>
              <BlogTitle
                className='pt-2 sm:pt-[10px] font-semibold text-[1.12rem] md:text-[1.45rem] leading-[1.4] sm:leading-[1.34] hover:underline underline-offset-2 line-clamp-2'
                title={titleContent || 'Untitled Post'}
              />
            </Link>

            {descriptionContent !== '' && (
              <BlogDescription
                description={descriptionContent}
                className='pt-[6px] sm:pt-2 text-[0.9rem] md:text-[1.2rem] line-clamp-2 sm:line-clamp-3 opacity-90'
              />
            )}
          </div>

          <div className='pt-3 w-full flex items-center gap-2'>
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
              <p className='shrink-0 text-sm opacity-90'>Untagged</p>
            )}

            <p className='font-medium text-sm opacity-80'>{' · '}</p>

            <div className='flex items-center gap-[6px]'>
              <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} size={16} />
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
    <div className='pb-4 h-full border-b-1 sm:border-b-0 border-border-light/60 dark:border-border-dark/60'>
      <article className='h-full w-full flex flex-col gap-3'>
        <div className='shrink-0 aspect-[3/2] h-[200px] sm:h-fit max-h-[300px] w-full bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-sm shadow-sm overflow-hidden'>
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

        <div className='h-full w-full flex flex-col justify-between gap-[10px]'>
          <div>
            <UserInfoCardShowcase authorID={authorId} date={date} />

            <Link href={blogURL} className='w-full'>
              <BlogTitle
                className='pt-2 font-semibold text-[1.12rem] sm:text-[1.25rem] leading-[1.4] hover:underline underline-offset-2 line-clamp-2'
                title={titleContent || 'Untitled Post'}
              />
            </Link>

            {descriptionContent !== '' && (
              <BlogDescription
                description={descriptionContent}
                className='pt-[6px] text-[0.9rem] sm:text-[1rem] line-clamp-2 opacity-90'
              />
            )}
          </div>

          <div className='pt-3 w-full flex items-center gap-2'>
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
              <p className='shrink-0 text-sm opacity-90'>Untagged</p>
            )}

            <p className='font-medium text-sm opacity-80'>{' · '}</p>

            <div className='flex items-center gap-[6px]'>
              <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} size={16} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
