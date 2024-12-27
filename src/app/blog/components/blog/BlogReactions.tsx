import { LikesCount } from '@/components/blog/LikesCount';
import { BlogActionsDropdown } from '@/components/blog/actions/BlogActionsDropdown';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
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

  if (status === 'unauthenticated')
    return (
      <div
        className={twMerge(
          className,
          'flex justify-between items-center gap-3'
        )}
      >
        <p className='text-sm opacity-80'>You are not logged in.</p>

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

          {status === 'authenticated' && (
            <LikesCount blogId={blogId} showSeparator={true} />
          )}
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
