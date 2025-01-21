import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { Blog } from '@/services/blog/blogTypes';
import moment from 'moment';

import {
  BlogDescription,
  BlogImage,
  BlogTitle,
  getCardContent,
} from '../getBlogContent';

export const ShowcaseBlogCard = ({ blog }: { blog: Blog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time || blog?.blog?.time;
  // Generate the slug for the blog title
  const blogTitle = blog?.blog?.blocks[0]?.data?.text;
  const blogSlug = generateSlug(blogTitle);
  const { titleContent, descriptionContent, imageContent } = getCardContent({
    blog,
  });

  if (!imageContent) return null;

  return (
    <div className='col-span-2 sm:col-span-1 flex flex-col'>
      <div className='h-[200px] sm:h-[250px] w-full overflow-hidden'>
        <BlogImage title={titleContent} image={imageContent} />
      </div>

      <div className='mt-1 mb-4'>
        <p className='text-xs text-right opacity-80'>
          {moment(date).format('MMMM DD, 2025')}
          {' | '}
          {moment(date).utc().format('hh:mm')} UTC
        </p>
      </div>

      <Link
        href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
        className='mb-2 flex-1 group'
      >
        <div className='space-y-1'>
          <BlogTitle
            title={titleContent}
            className='font-bold text-xl lg:text-[22px] group-hover:opacity-80 line-clamp-3'
          />
          <BlogDescription
            description={descriptionContent}
            className='line-clamp-2 opacity-80'
          />
        </div>
      </Link>

      <UserInfoCardShowcase id={authorId} />
    </div>
  );
};
