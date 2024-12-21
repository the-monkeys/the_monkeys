import { BlogActionsDropdown } from '@/components/blog/actions/BlogActionsDropdown';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import { useGetLikesCount } from '@/hooks/user/useLikeStatus';
import { useSession } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';

export const BlogReactions = ({
  className,
  blogId,
}: {
  className?: string;
  blogId?: string;
}) => {
  const { status } = useSession();
  const { likes, likeCountLoading, likeCountError } = useGetLikesCount(blogId);

  if (status === 'unauthenticated')
    return (
      <div
        className={twMerge(
          className,
          'flex justify-between items-center gap-3'
        )}
      >
        <p className='font-roboto text-xs sm:text-sm opacity-80 italic'>
          You are not logged in.
        </p>

        <BlogActionsDropdown blogId={blogId} />
      </div>
    );

  return (
    <div
      className={twMerge(className, 'flex justify-between items-center gap-3')}
    >
      <div className='flex items-center gap-1'>
        <div className='flex items-center'>
          <LikeButton blogId={blogId} />

          <p className='font-dm_sans text-xs sm:text-sm'>
            {likeCountLoading ? '-' : likeCountError ? null : likes?.count}
          </p>
        </div>

        {/* <CommentButton blogId={blogId} isDisable={true} /> */}
      </div>

      <div className='flex items-center gap-1'>
        <BookmarkButton blogId={blogId} />

        <BlogActionsDropdown blogId={blogId} />
      </div>
    </div>
  );
};
