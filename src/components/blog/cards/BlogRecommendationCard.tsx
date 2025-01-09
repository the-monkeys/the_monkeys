import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { UserInfoCardCompact } from '@/components/user/userInfo';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { Blog } from '@/services/blog/blogTypes';

import { getCardContent } from '../getBlogContent';

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.blog?.time;
  const blogSlug = generateSlug(blog?.blog?.blocks[0]?.data?.text);
  return (
    <div className=' px-4 flex flex-col space-y-2'>
      <UserInfoCardCompact id={authorId} date={date} />

      <Link href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`} className='group'>
        {getCardContent({ blog }).recommendationTitleDiv}
      </Link>
    </div>
  );
};
