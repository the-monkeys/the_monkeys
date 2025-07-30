import { ProfileBlogCard } from '@/components/cards/blog/ProfileBlogCard';
import Icon from '@/components/icon';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetAllDraftBlogs from '@/hooks/blog/useGetAllDraftBlogs';
import { IUser } from '@/services/models/user';

export const Drafts = ({
  username,
  user,
}: {
  username: string;
  user?: IUser;
}) => {
  const { blogs, isLoading, isError } = useGetAllDraftBlogs();

  if (isError)
    return (
      <div className='min-h-screen'>
        <p className='w-full opacity-90 text-center'>No drafts created yet.</p>
      </div>
    );

  return (
    <div className='flex flex-col gap-6'>
      {/* TODO: add functionality to let user keep at most 5 posts at a time */}
      {/* <div className='mb-2 p-2 flex justify-center items-center gap-2'>
        <Icon name='RiErrorWarning' className='shrink-0 text-alert-red' />

        <p className='text-sm sm:text-base'>
          A maximum of <span className='font-medium'>5 drafts</span> can be
          saved at once. Drafts are automatically deleted after some time.
        </p>
      </div> */}

      {isLoading ? (
        <FeedBlogCardListSkeleton />
      ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
        <p className='w-full text-sm opacity-80 text-center'>
          No drafts created yet.
        </p>
      ) : (
        blogs?.blogs &&
        blogs?.blogs.map((blog) => {
          return (
            <ProfileBlogCard
              blog={blog}
              isAuthenticated={!!user}
              modificationEnable={user?.username === username}
              isDraft={true}
              key={blog?.blog_id}
            />
          );
        })
      )}
    </div>
  );
};
