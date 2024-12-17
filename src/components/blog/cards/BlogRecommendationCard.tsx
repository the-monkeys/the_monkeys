import Link from 'next/link';

import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';
import moment from 'moment';

import { getCardContent } from '../getBlogContent';

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className='px-4 flex flex-col'>
      <UserInfoCardCompact id={blog?.owner_account_id} />

      <Link href={`/blog/id=${blog?.blog_id}`} className='group pt-2 pb-1'>
        {getCardContent({ blog }).recommendationTitleDiv}
      </Link>

      <p className='font-roboto text-xs opacity-80'>
        {moment(blog?.blog?.time).format('MMM DD, YYYY')}
      </p>
    </div>
  );
};
