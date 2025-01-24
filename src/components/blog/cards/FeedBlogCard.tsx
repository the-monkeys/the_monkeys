import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { UserInfoCard } from '@/components/user/userInfo';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { Blog } from '@/services/blog/blogTypes';

import { ReactionsInfo } from '../ReactionsInfo';
import { BlogShareDialog } from '../actions/BlogShareDialog';
import { RemoveBookmarkButton } from '../buttons/RemoveBookmarkButton';
import {
  BlogDescription,
  BlogImage,
  BlogTitle,
  getCardContent,
} from '../getBlogContent';

export const FeedBlogCard = ({
  blog,
  removeBookmarkOption = false,
}: {
  blog: Blog;
  removeBookmarkOption?: boolean;
}) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time || blog?.blog?.time;

  const { titleContent, descriptionContent, imageContent } = getCardContent({
    blog,
  });
  const blogTitle = blog?.blog?.blocks[0]?.data?.text;
  const blogSlug = generateSlug(blogTitle);

  const likesCount = blog?.LikeCount || blog?.like_count;
  const bookmarksCount = blog?.BookmarkCount || blog?.bookmark_count;

  return (
    <div className='w-full px-0 lg:px-6'>
      <div className='space-y-3'>
        <UserInfoCard id={authorId} date={date} />

        <Link
          href={{
            pathname: `${BLOG_ROUTE}/${blogSlug}-${blogId}`,
          }}
          className='group flex flex-col sm:flex-row gap-2 sm:gap-4'
        >
          <div className='flex-1 flex flex-col space-y-1 sm:space-y-2 overflow-hidden'>
            <BlogTitle
              title={titleContent}
              className='font-bold text-xl lg:text-[22px] line-clamp-3 group-hover:opacity-80'
            />
            <BlogDescription
              description={descriptionContent}
              className='line-clamp-2 opacity-65'
            />
          </div>

          {imageContent && (
            <div className='h-[185px] sm:h-[120px] w-full sm:w-[165px] overflow-hidden rounded-md group-hover:opacity-90'>
              <BlogImage image={imageContent} title={titleContent} />
            </div>
          )}
        </Link>
      </div>

      <div className='mt-3 flex justify-between items-center gap-4'>
        <ReactionsInfo
          likesCount={likesCount}
          bookmarksCount={bookmarksCount}
        />

        <div className='flex items-center gap-1'>
          {removeBookmarkOption && (
            <RemoveBookmarkButton blogId={blog?.blog_id} />
          )}

          <BlogShareDialog
            blogURL={`${LIVE_URL}${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          />
        </div>
      </div>
    </div>
  );
};
