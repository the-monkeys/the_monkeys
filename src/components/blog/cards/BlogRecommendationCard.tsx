import Link from 'next/link';

import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';

import { getCardContent } from '../getBlogContent';

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className=' px-4 flex flex-col space-y-1'>
      <UserInfoCardCompact id={blog?.owner_account_id} />

      <Link href={`/blog?id=${blog?.blog_id}`} className='group'>
        {getCardContent({ blog }).recommendationTitleDiv}
      </Link>
    </div>
  );
};
