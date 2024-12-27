import Link from 'next/link';

import { UserInfoCard } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';

import { LikesCount } from '../LikesCount';
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

  const { titleDiv, descriptionDiv, imageDiv } = getCardContent({ blog });

  return (
    <div className='w-full px-0 lg:px-6'>
      <div className='space-y-3'>
        <UserInfoCard id={authorId} date={date} />

        <Link
          href={`/blog?id=${blogId}`}
          className='group flex flex-col sm:flex-row gap-2 sm:gap-4'
        >
          <div className='flex-1 space-y-1 sm:space-y-2'>
            {titleDiv}
            {descriptionDiv}
          </div>

          {imageDiv && (
            <div className='h-full sm:h-[120px] w-full sm:w-[165px] bg-foreground-light dark:bg-foreground-dark overflow-hidden rounded-sm'>
              {imageDiv}
            </div>
          )}
        </Link>
      </div>

      <div className='mt-3 flex justify-between items-center gap-4'>
        <div className='flex items-center gap-[6px]'>
          {status === 'authenticated' && <LikesCount blogId={blog.blog_id} />}
        </div>

        <div className='flex items-center gap-1'>
          {status === 'authenticated' && <BookmarkButton blogId={blogId} />}

          <BlogActionsDropdown blogId={blogId} />
        </div>
      </div>
    </div>
  );
};
