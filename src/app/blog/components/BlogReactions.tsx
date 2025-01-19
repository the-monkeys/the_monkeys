import { LikesCount } from '@/components/blog/LikesCount';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { CommentButton } from '@/components/blog/buttons/CommentButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { useSession } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';

export const BlogReactions = ({
  className,
  blogId,
}: {
  className?: string;
  blogURL?: string | string[];
  blogId?: string;
}) => {
  const { status } = useSession();

  if (status === 'unauthenticated')
    return (
      <p className='p-1 text-sm opacity-80 text-center'>Log in to interact</p>
    );

  return (
    <div className={twMerge(className, 'flex justify-between items-center')}>
      <div className='flex-1 flex items-center'>
        <LikeButton blogId={blogId} size={20} />

        {status === 'authenticated' && <LikesCount blogId={blogId} />}
      </div>

      <div className='flex items-center gap-[2px]'>
        {/* <CommentButton size={20} isDisable={true} />

        <div className='size-[3px] bg-foreground-dark dark:bg-foreground-light rounded-full' /> */}

        <BookmarkButton blogId={blogId} size={20} />
      </div>
    </div>
  );
};

export const BlogReactionsContainer = ({
  blogId,
  blogURL,
}: {
  blogId?: string;
  blogURL: string | string[];
}) => {
  const url = `${LIVE_URL}${BLOG_ROUTE}/${blogURL}`;

  return (
    <div className='sticky left-0 bottom-[60px] md:bottom-[30px] mx-auto w-full max-w-[320px] flex items-center gap-2 z-20'>
      <div className='flex-1 px-6 py-[8px] text-text-dark dark:text-text-light bg-background-dark dark:bg-background-light shadow-md rounded-full'>
        <BlogReactions blogURL={blogURL} blogId={blogId} />
      </div>

      <div className='px-3 py-[8px] text-text-dark dark:text-text-light bg-background-dark dark:bg-background-light shadow-md rounded-full'>
        <BlogShareDialog blogURL={url} size={20} />
      </div>
    </div>
  );
};
