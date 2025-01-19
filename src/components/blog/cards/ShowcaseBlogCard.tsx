import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { Blog } from '@/services/blog/blogTypes';

import { getCardContent } from '../getBlogContent';

export const ShowcaseBlogCard = ({ blog }: { blog: Blog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time || blog?.blog?.time;
  // Generate the slug for the blog title
  const blogTitle = blog?.blog?.blocks[0]?.data?.text;
  const blogSlug = generateSlug(blogTitle);
  const { titleDiv, descriptionDiv, imageDiv } = getCardContent({ blog });

  if (!imageDiv) return null;

  return (
    <div className='col-span-2 sm:col-span-1 flex flex-col gap-3'>
      <div className='h-[180px] sm:h-[220px] w-full overflow-hidden rounded-sm'>
        {imageDiv}
      </div>

      <UserInfoCardShowcase id={authorId} date={date} />

      <div className='flex-1 flex flex-col justify-between gap-5'>
        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='group flex flex-col gap-2'
        >
          <div className='space-y-1'>
            {titleDiv}
            {descriptionDiv}
          </div>
        </Link>
      </div>
    </div>
  );
};
