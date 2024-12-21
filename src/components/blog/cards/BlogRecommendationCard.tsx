import Link from 'next/link';

import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';
import moment from 'moment';

import { getCardContent } from '../getBlogContent';

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className='px-4 flex flex-col'>
      <UserInfoCardCompact id={blog?.owner_account_id} />

      <Link href={`/blog?id=${blog?.blog_id}`} className='group mt-1 mb-2'>
        {getCardContent({ blog }).recommendationTitleDiv}
      </Link>

      <div className='flex items-center gap-[6px]'>
        <p className='text-xs opacity-80'>
          {moment(blog?.blog?.time).format('MMM DD, YYYY')}
        </p>
      </div>
    </div>
  );
};
