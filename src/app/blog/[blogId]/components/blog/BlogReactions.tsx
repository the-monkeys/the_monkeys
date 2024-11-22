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
  const { data, status } = useSession();

  return (
    <div
      className={twMerge(className, 'flex justify-between items-center gap-3')}
    >
      <div className='flex items-center'>
        {status === 'authenticated' ? (
          <>
            <LikeButton
              blogId={blogId}
              // isDisable={data?.user?.account_id === accountId}
            />

            <BookmarkButton blogId={blogId} />
          </>
        ) : (
          <p className='font-jost text-alert-red italic'>
            You are not logged in
          </p>
        )}
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
