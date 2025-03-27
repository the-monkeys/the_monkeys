import { LikesCount } from '@/components/blog/LikesCount';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { twMerge } from 'tailwind-merge';

export const BlogReactions = ({
  className,
  blogId,
}: {
  className?: string;
  blogURL?: string | string[];
  blogId?: string;
}) => {
  const { isSuccess, isError } = useAuth();

  if (isError)
    return (
      <p className='p-1 text-sm opacity-80 text-center'>
        You are not logged in.
      </p>
    );

  return (
    <div className={twMerge(className, 'flex justify-between items-center')}>
      <div className='flex-1 flex items-center'>
        <LikeButton blogId={blogId} size={20} />

        {isSuccess && <LikesCount blogId={blogId} />}
      </div>

      <div className='flex items-center gap-[2px]'>
        {/* <CommentButton size={20} isDisable={true} />

        <div className='size-[3px] bg-foreground-dark dark:bg-foreground-light rounded-full' /> */}

        {isSuccess && <BookmarkButton blogId={blogId} size={20} />}
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
      <div className='flex-1 px-4 py-[6px] bg-foreground-light dark:bg-foreground-dark rounded-full shadow-sm border-1 border-border-light/60 dark:border-border-dark/60'>
        <BlogReactions blogURL={blogURL} blogId={blogId} />
      </div>

      <div className='px-3 py-[6px] bg-foreground-light dark:bg-foreground-dark rounded-full shadow-sm border-1 border-border-light/60 dark:border-border-dark/60'>
        <BlogShareDialog blogURL={url} size={20} />
      </div>
    </div>
  );
};
