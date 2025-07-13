import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogImage } from '@/components/blog/getBlogContent';
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
        {!imageContent ? (
          <div className='h-[200px] bg-brand-orange' />
        ) : (
          <div className='h-[220px] sm:h-[360px] lg:h-[400px] rounded-sm overflow-hidden'>
            <BlogImage title={titleContent} image={imageContent} />
          </div>
        )}

        <div className='space-y-2'>
          <div className='py-2 flex'>
            <Link
              href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
              className='shrink-0 px-[10px] py-[2px] border-1 rounded-sm border-border-light dark:border-border-dark hover:border-brand-orange dark:hover:border-brand-orange capitalize'
            >
              <p className='text-sm'>{blog?.tags[0]}</p>
            </Link>
          </div>

          <Link href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`} className='group'>
            <h2 className='py-1 font-dm_sans font-bold text-2xl sm:text-3xl leading-tight group-hover:underline underline-offset-2 line-clamp-3'>
              {titleContent}
            </h2>
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
      <div className='h-[220px] rounded-sm overflow-hidden'>
        <BlogImage title={titleContent} image={imageContent} />
      </div>

      <div className='space-y-2'>
        <div className='py-2 flex'>
          <Link
            href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
            className='shrink-0 px-[10px] py-[2px] border-1 rounded-sm border-border-light dark:border-border-dark hover:border-brand-orange dark:hover:border-brand-orange capitalize'
          >
            <p className='text-sm'>{blog?.tags[0]}</p>
          </Link>
        </div>

        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='group w-full'
        >
          <h2 className='py-1 font-dm_sans font-semibold text-xl leading-tight hover:underline underline-offset-2 line-clamp-2'>
            {titleContent}
          </h2>
        </Link>

        <UserInfoCardShowcase authorID={authorId} date={date} />
      </div>
    </div>
  );
};
