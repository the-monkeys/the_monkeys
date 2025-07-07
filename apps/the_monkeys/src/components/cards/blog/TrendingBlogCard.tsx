import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogImage, getCardContent } from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { Blog } from '@/services/blog/blogTypes';

export const TrendingBlogCardL = ({ blog }: { blog: Blog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time || blog?.blog?.time;

  const { titleContent, imageContent } = getCardContent({
    blog,
  });

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='overflow-hidden h-full w-full'>
      <div className='flex flex-col gap-2'>
        {!imageContent ? (
          <div className='h-[200px] bg-brand-orange' />
        ) : (
          <div className='h-[300px] sm:h-[360px] overflow-hidden border-1 border-border-light dark:border-border-dark'>
            <BlogImage title={titleContent} image={imageContent} />
          </div>
        )}

        <div className='space-y-2'>
          <Link href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`} className='group'>
            <h2 className='py-1 font-dm_sans font-bold text-3xl sm:text-4xl leading-tight group-hover:underline decoration-1 underline-offset-2 line-clamp-3'>
              {titleContent}
            </h2>
          </Link>

          <UserInfoCardShowcase authorID={authorId} date={date} />
        </div>
      </div>
    </div>
  );
};

export const TrendingBlogCardS = ({ blog }: { blog: Blog }) => {
  const blogId = blog?.blog_id;

  const { titleContent, imageContent } = getCardContent({
    blog,
  });

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='relative group overflow-hidden h-full w-full border-1 border-border-light dark:border-border-dark pointer-events-none'>
      <div className='flex flex-col gap-2'>
        {!imageContent ? (
          <div className='h-[220px] sm:h-[320px] bg-black' />
        ) : (
          <div className='h-[300px] overflow-hidden group-hover:scale-105 transition-transform'>
            <BlogImage title={titleContent} image={imageContent} />
          </div>
        )}

        {imageContent && (
          <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black/80 via-transparent to-transparent' />
        )}

        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='group absolute top-0 left-0 h-full p-4 flex items-end pointer-events-auto'
        >
          <h2 className='font-dm_sans font-medium text-xl text-white leading-tight group-hover:underline decoration-1 underline-offset-2 line-clamp-3'>
            {titleContent}
          </h2>
        </Link>
      </div>
    </div>
  );
};
