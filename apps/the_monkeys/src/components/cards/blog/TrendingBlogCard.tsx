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
    <div className='h-full w-full flex flex-col gap-[10px]'>
      <div className='h-[220px] md:h-[360px] bg-foreground-light dark:bg-foreground-dark rounded-sm shadow-sm overflow-hidden'>
        {!imageContent ? (
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
              className='pt-2 font-semibold text-2xl sm:text-3xl !leading-[1.4] hover:underline underline-offset-2 line-clamp-2'
              title={titleContent || 'Untitled Post'}
            />
          </Link>

          {descriptionContent !== '' && (
            <BlogDescription
              description={descriptionContent}
              className='pt-[10px] text-sm lg:text-base line-clamp-3 opacity-90'
            />
          )}
        </div>

        <div className='pt-2 w-full flex items-center gap-2'>
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

          <p className='font-medium opacity-80'>{' · '}</p>

          <div className='flex items-center gap-[6px]'>
            <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TrendingBlogCardSmall = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = purifyHTMLString(blog?.title);
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);
  const blogURL = `${BLOG_ROUTE}/${blogSlug}-${blogId}`;

  return (
    <div className='group h-full w-full flex flex-col gap-[10px]'>
      <div className='h-[220px] bg-foreground-light dark:bg-foreground-dark rounded-sm shadow-sm overflow-hidden'>
        {!imageContent ? (
          <BlogPlaceholderImage title={titleContent} />
        ) : (
          <BlogImage title={titleContent} image={imageContent} />
        )}
      </div>

      <div className='flex-grow w-full flex flex-col justify-between gap-[10px]'>
        <div>
          <UserInfoCardShowcase authorID={authorId} date={date} />

          <Link href={blogURL} className='w-full'>
            <BlogTitle
              className='pt-[6px] font-semibold text-lg leading-normal hover:underline underline-offset-2 line-clamp-2'
              title={titleContent || 'Untitled Post'}
            />
          </Link>
        </div>

        <div className='pt-2 w-full flex items-center gap-2'>
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

          <p className='font-medium opacity-80'>{' · '}</p>

          <div className='flex items-center gap-[6px]'>
            <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
