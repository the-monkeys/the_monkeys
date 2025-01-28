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
    <div className='pt-4 pb-6 px-2 flex flex-col space-y-1'>
      <Link
        href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
        target='_blank'
        className='group'
      >
        <BlogTitle
          title={titleContent}
          className='font-semibold text-base md:text-lg opacity-90 group-hover:opacity-100'
        />
      </Link>

      <p className='font-dm_sans text-[13px] opacity-80'>
        {moment(date).format('MMM DD, 2025')} at{' '}
        {moment(date).utc().format('hh:mm')} UTC
      </p>
    </div>
  );
};
