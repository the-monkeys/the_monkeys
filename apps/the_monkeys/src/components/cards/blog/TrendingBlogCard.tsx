import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogDescription,
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';

export const TrendingBlogCardL = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;
  const descriptionContent = blog?.first_paragraph;
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='h-full w-full flex flex-col gap-[10px]'>
      <div className='h-[230px] md:h-[360px] bg-foreground-light dark:bg-foreground-dark rounded-md overflow-hidden'>
        {!imageContent ? (
          <BlogPlaceholderImage title={titleContent} />
        ) : (
          <BlogImage title={titleContent} image={imageContent} />
        )}
      </div>

      <div className='space-y-[10px]'>
        {blog?.tags.length && (
          <div className='w-fit flex items-center gap-1'>
            <Link
              href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
              className='shrink-0 font-medium text-sm text-brand-orange capitalize hover:underline'
            >
              {blog?.tags[0]}
            </Link>
          </div>
        )}

        <div className='space-y-2'>
          <Link
            href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
            className='mb-[6px]'
          >
            <BlogTitle
              className='font-semibold text-2xl sm:text-3xl hover:underline underline-offset-2 line-clamp-2'
              title={titleContent}
            />
          </Link>

          <UserInfoCardShowcase authorID={authorId} date={date} />

          <BlogDescription
            description={descriptionContent}
            className='pt-1 text-sm lg:text-base line-clamp-3 md:line-clamp-4 opacity-90'
          />
        </div>
      </div>
    </div>
  );
};

export const TrendingBlogCardS = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='group flex flex-col gap-[10px] h-full w-full'>
      <div className='h-[220px] sm:h-[200px] bg-foreground-light dark:bg-foreground-dark rounded-md overflow-hidden'>
        {!imageContent ? (
          <BlogPlaceholderImage title={titleContent} />
        ) : (
          <BlogImage title={titleContent} image={imageContent} />
        )}
      </div>

      <div className='space-y-[10px]'>
        {blog?.tags.length && (
          <div className='w-fit flex items-center gap-1'>
            <Link
              href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
              className='shrink-0 font-medium text-sm text-brand-orange capitalize hover:underline'
            >
              {blog?.tags[0]}
            </Link>
          </div>
        )}

        <div className='flex flex-col gap-2'>
          <Link href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`} className='w-full'>
            <BlogTitle
              className='font-semibold text-lg leading-normal hover:underline underline-offset-2 line-clamp-2'
              title={titleContent}
            />
          </Link>

          <UserInfoCardShowcase authorID={authorId} date={date} />
        </div>
      </div>
    </div>
  );
};
