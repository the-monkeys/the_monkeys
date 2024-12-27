import Link from 'next/link';

import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';

import { getCardContent } from '../getBlogContent';

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.blog?.time;

  return (
    <div className=' px-4 flex flex-col space-y-1'>
      <UserInfoCardCompact id={authorId} date={date} />

      <Link href={`/blog?id=${blogId}`} className='group'>
        {getCardContent({ blog }).recommendationTitleDiv}
      </Link>
    </div>
  );
};
