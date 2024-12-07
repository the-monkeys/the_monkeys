import Link from 'next/link';

import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Block, Blog } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';

import { BlogActionsDropdown } from '../actions/BlogActionsDropdown';

const BlogContent = ({ titleBlock }: { titleBlock: Block }) => {
  const title = titleBlock.data.text;

  return (
    <h2
      dangerouslySetInnerHTML={{ __html: purifyHTMLString(title) }}
      className='flex-1 font-roboto font-medium text-base sm:text-lg capitalize line-clamp-2 group-hover:opacity-80'
    ></h2>
  );
};

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className='md:p-2 flex flex-col gap-2'>
      <UserInfoCardCompact id={blog?.owner_account_id} />

      <Link href={`/blog/${blog?.blog_id}`} className='group'>
        <BlogContent titleBlock={blog?.blog?.blocks[0]} />
      </Link>

      <p className='font-roboto text-xs opacity-80'>
        {moment(blog?.blog?.time).format('MMM DD, YYYY')}
      </p>
    </div>
  );
};
