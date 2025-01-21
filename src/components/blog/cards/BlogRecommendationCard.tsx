import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { Blog } from '@/services/blog/blogTypes';
import moment from 'moment';

import { BlogTitle, getCardContent } from '../getBlogContent';

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  const blogId = blog?.blog_id;
  const date = blog?.blog?.time;
  const blogSlug = generateSlug(blog?.blog?.blocks[0]?.data?.text);

  const { titleContent } = getCardContent({ blog });

  return (
    <div className='px-4 flex flex-col space-y-1'>
      <Link
        href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
        target='_blank'
        className='group'
      >
        <BlogTitle
          title={titleContent}
          className='font-semibold text-base md:text-lg'
        />
      </Link>

      <p className='font-dm_sans text-[13px] opacity-80'>
        {moment(date).format('MMMM DD, 2025')}
      </p>
    </div>
  );
};
