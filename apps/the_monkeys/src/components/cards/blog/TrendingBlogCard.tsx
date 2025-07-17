import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogDescription,
  BlogImage,
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
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='overflow-hidden h-full w-full'>
      <div className='flex flex-col gap-2'>
        <div className='h-[200px] sm:h-[360px] lg:h-[400px] overflow-hidden'>
          {!imageContent ? (
            <div className='h-full w-full bg-brand-orange/40' />
          ) : (
            <BlogImage title={titleContent} image={imageContent} />
          )}
        </div>

        <div className='flex flex-col'>
          <div className='pb-2 flex'>
            <Link
              href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
              className='shrink-0 hover:opacity-80 capitalize'
            >
              <p className='font-[450] text-sm text-brand-orange'>
                {blog?.tags[0]}
              </p>
            </Link>
          </div>

          <Link
            href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
            className='mb-[6px]'
          >
            <BlogTitle
              className='font-semibold text-2xl sm:text-4xl leading-tight hover:underline underline-offset-2 line-clamp-3'
              title={titleContent}
            />
          </Link>

          <UserInfoCardShowcase authorID={authorId} date={date} />
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
    <div className='group flex flex-col gap-2 h-full w-full'>
      <div className='h-[200px] sm:h-[220px] overflow-hidden'>
        {!imageContent ? (
          <div className='h-full w-full bg-brand-orange/40' />
        ) : (
          <BlogImage title={titleContent} image={imageContent} />
        )}
      </div>

      <div className='flex flex-col'>
        <div className='pb-2 flex'>
          <Link
            href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
            className='shrink-0 hover:opacity-80 capitalize'
          >
            <p className='font-[450] text-sm text-brand-orange'>
              {blog?.tags[0]}
            </p>
          </Link>
        </div>

        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='mb-[6px] w-full'
        >
          <BlogTitle
            className='font-medium text-xl leading-tight hover:underline underline-offset-2 line-clamp-2'
            title={titleContent}
          />
        </Link>

        <UserInfoCardShowcase authorID={authorId} date={date} />
      </div>
    </div>
  );
};

export const TrendingBlogCardText = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;
  const descriptionContent = blog?.first_paragraph;

  const blogSlug = generateSlug(blog?.title);

  return (
    <div className='p-4 flex flex-col justify-end gap-2 h-full w-full bg-orange-100 dark:bg-orange-950'>
      <Link
        href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
        className='shrink-0 hover:opacity-80 capitalize'
      >
        <p className='font-[450] text-sm text-brand-orange'>{blog?.tags[0]}</p>
      </Link>

      <Link href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`} className='w-full'>
        <BlogTitle
          className='font-semibold text-xl leading-tight hover:underline underline-offset-2 line-clamp-3'
          title={titleContent}
        />
      </Link>

      <UserInfoCardShowcase authorID={authorId} date={date} />

      <div className='mt-3'>
        <BlogDescription
          className='text-sm font-light line-clamp-3'
          description={descriptionContent}
        />
      </div>
    </div>
  );
};
