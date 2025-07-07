import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogImage, getCardContent } from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { Blog } from '@/services/blog/blogTypes';

export const FeedBlogCard = ({ blog }: { blog: Blog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time || blog?.blog?.time;

  const { titleContent, imageContent } = getCardContent({
    blog,
  });

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='group first:pt-0 pt-3 pb-4 flex flex-col sm:flex-row gap-4 pointer-events-none'>
      <div className='shrink-0 overflow-hidden'>
        {!imageContent ? (
          <div className='h-[220px] sm:h-[120px] w-full sm:w-[200px] bg-background-dark dark:background-light' />
        ) : (
          <div className='h-[220px] sm:h-[120px] w-full sm:w-[200px] group-hover:scale-105 transition-transform'>
            <BlogImage title={titleContent} image={imageContent} />
          </div>
        )}
      </div>

      <div className='w-full flex flex-col gap-2 pointer-events-auto'>
        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='font-semibold text-lg md:text-xl line-clamp-2 hover:underline decoration-1 underline-offset-2'
        >
          {titleContent}
        </Link>

        <UserInfoCardShowcase authorID={authorId} date={date} />
      </div>
    </div>
  );
};
