import { BlogActionsDropdown } from '@/components/blog/actions/BlogActionsDropdown';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
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
  const { data } = useSession();

  return (
    <div
      className={twMerge(className, 'flex justify-between items-center gap-3')}
    >
      <div className='flex items-center gap-2'>
        <LikeButton blogId={blogId} />
        <BookmarkButton blogId={blogId} />
      </div>

      <div className='flex items-center gap-3'>
        <BlogActionsDropdown
          blogId={blogId}
          editEnable={data?.user?.account_id === accountId}
        />
      </div>
    </div>
  );
};
