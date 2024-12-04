import { BlogActionsDropdown } from '@/components/blog/actions/BlogActionsDropdown';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import { useGetBookmarksCount } from '@/hooks/user/useBookmarkStatus';
import { useGetLikesCount } from '@/hooks/user/useLikeStatus';
import { useSession } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';

export const BlogReactions = ({
  className,
  blogId,
  accountId,
}: {
  className?: string;
  blogId?: string;
  accountId?: string;
}) => {
  const { data, status } = useSession();
  const { likes, likeCountLoading, likeCountError } = useGetLikesCount(blogId);
  const { bookmarks, bookmarkCountLoading, bookmarkCountError } =
    useGetBookmarksCount(blogId);

  return (
    <div
      className={twMerge(className, 'flex justify-between items-center gap-3')}
    >
      <div className='flex items-center gap-2'>
        {status === 'authenticated' ? (
          <>
            <div className='flex items-center'>
              <LikeButton
                blogId={blogId}
                // isDisable={data?.user?.account_id === accountId}
              />

              <p className='font-roboto text-xs sm:text-sm opacity-80'>
                {bookmarkCountLoading
                  ? 0
                  : bookmarkCountError
                    ? 'NA'
                    : likes?.count}
              </p>
            </div>

            <div className='flex items-center'>
              <BookmarkButton
                blogId={blogId}
                // isDisable={data?.user?.account_id === accountId}
              />

              <p className='font-roboto text-xs sm:text-sm opacity-80'>
                {likeCountLoading
                  ? 0
                  : likeCountError
                    ? 'NA'
                    : bookmarks?.count}
              </p>
            </div>
          </>
        ) : (
          <p className='font-roboto text-xs sm:text-sm opacity-80 italic'>
            You are not logged in.
          </p>
        )}
      </div>

      <div className='flex items-center gap-3'>
        <BlogActionsDropdown
          blogId={blogId}
          modificationEnable={data?.user?.account_id === accountId}
        />
      </div>
    </div>
  );
};
