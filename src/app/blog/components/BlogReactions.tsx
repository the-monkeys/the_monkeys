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
      <p className='p-1 text-sm opacity-80 text-center'>
        You are not logged in.
      </p>
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
    <div className='sticky left-0 bottom-[60px] md:bottom-[30px] mx-auto w-full max-w-full sm:max-w-[320px] flex items-center gap-[6px] z-20'>
      <div className='flex-1 px-4 py-[6px] bg-foreground-light dark:bg-foreground-dark rounded-full border-1 border-border-light/80 dark:border-border-dark/80'>
        <BlogReactions blogURL={blogURL} blogId={blogId} />
      </div>

      <div className='px-3 py-[6px] bg-foreground-light dark:bg-foreground-dark rounded-full border-1 border-border-light/80 dark:border-border-dark/80'>
        <BlogShareDialog blogURL={url} size={20} />
      </div>
    </div>
  );
};
