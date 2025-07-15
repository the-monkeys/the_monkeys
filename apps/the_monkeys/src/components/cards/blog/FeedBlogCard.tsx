import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogImage } from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';

export const FeedBlogCard = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='group flex flex-col sm:flex-row gap-2 sm:gap-4'>
      <div className='shrink-0 overflow-hidden'>
        {!imageContent ? (
          <div className='h-[220px] sm:h-[120px] w-full sm:w-[180px] bg-background-dark dark:background-light' />
        ) : (
          <div className='h-[220px] sm:h-[120px] w-full sm:w-[180px] rounded-sm overflow-hidden'>
            <BlogImage title={titleContent} image={imageContent} />
          </div>
        )}
      </div>

      <div className='w-full flex flex-col'>
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
          <h2 className='font-medium text-lg md:text-xl leading-tight hover:underline underline-offset-2 line-clamp-2'>
            {titleContent}
          </h2>
        </Link>

        <UserInfoCardShowcase authorID={authorId} date={date} />
      </div>
    </div>
  );
};
