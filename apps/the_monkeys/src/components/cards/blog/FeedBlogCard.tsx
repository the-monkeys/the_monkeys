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
          <div className='h-[220px] sm:h-[130px] w-full sm:w-[200px] bg-background-dark dark:background-light' />
        ) : (
          <div className='h-[220px] sm:h-[130px] w-full sm:w-[200px] rounded-sm overflow-hidden'>
            <BlogImage title={titleContent} image={imageContent} />
          </div>
        )}
      </div>

      <div className='w-full flex flex-col gap-[6px]'>
        <div className='pb-1 flex'>
          <Link
            href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
            className='shrink-0 px-[5px] py-[2px] border-1 rounded-sm border-border-light dark:border-border-dark hover:border-brand-orange dark:hover:border-brand-orange capitalize'
          >
            <p className='text-sm'>{blog?.tags[0]}</p>
          </Link>
        </div>

        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='font-semibold text-lg md:text-xl line-clamp-2 hover:underline underline-offset-2'
        >
          {titleContent}
        </Link>

        <UserInfoCardShowcase authorID={authorId} date={date} />
      </div>
    </div>
  );
};
