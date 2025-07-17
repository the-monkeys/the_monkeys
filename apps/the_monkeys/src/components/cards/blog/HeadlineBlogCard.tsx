import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';

export const HeadlineBlogCard = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='p-3 pt-2'>
      <div className='flex flex-col gap-[6px]'>
        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='font-medium text-lg hover:underline underline-offset-2 line-clamp-2'
        >
          {titleContent}
        </Link>

        <UserInfoCardShowcase authorID={authorId} date={date} />
      </div>
    </div>
  );
};
