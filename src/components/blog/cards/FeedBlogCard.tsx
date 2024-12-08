import Link from 'next/link';

import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';
import moment from 'moment';

import { BlogActionsDropdown } from '../actions/BlogActionsDropdown';
import { BookmarkButton } from '../buttons/BookmarkButton';
import { getCardContent } from '../getBlogContent';

export const FeedBlogCard = ({
  blog,
  status,
}: {
  blog: Blog;
  status: 'authenticated' | 'loading' | 'unauthenticated';
}) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.blog?.time;

  const { titleDiv, descriptionDiv, imageDiv } = getCardContent(blog);

  return (
    <div className='w-full px-0 sm:px-4 md:px-6'>
      <div className='space-y-2'>
        <UserInfoCardCompact id={authorId} />

        <Link
          href={`/blog/${blogId}`}
          className='group flex flex-col sm:flex-row gap-4'
        >
          <div className='flex-1'>
            {titleDiv}
            {descriptionDiv}
          </div>

          {imageDiv && (
            <div className='h-[180px] sm:h-[120px] w-full sm:w-[160px] bg-foreground-light dark:bg-foreground-dark overflow-hidden rounded-md shadow-md'>
              {imageDiv}
            </div>
          )}
        </Link>
      </div>

      <div className='mt-2 flex justify-between items-center gap-4'>
        <div className='flex items-center gap-2'>
          <p className='font-roboto text-xs'>
            {moment(date).format('MMM DD, YYYY')}
          </p>

          {status === 'authenticated' && <BookmarkButton blogId={blogId} />}
        </div>

        <div className='flex items-center gap-1'>
          {<BlogActionsDropdown blogId={blogId} />}
        </div>
      </div>
    </div>
  );
};
