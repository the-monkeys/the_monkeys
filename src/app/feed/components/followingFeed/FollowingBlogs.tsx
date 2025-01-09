import { FeedBlogCard } from '@/components/blog/cards/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetFollowingAuthorsBlogs from '@/hooks/blog/useGetFollowingAuthorsBlogs';

export const FollowingBlogs = ({
  status,
}: {
  status: 'authenticated' | 'loading' | 'unauthenticated';
}) => {
  const { blogs, isLoading, isError } = useGetFollowingAuthorsBlogs();

  if (status === 'unauthenticated')
    return (
      <p className='w-full text-sm opacity-80 text-center'>
        Login to view blogs.
      </p>
    );

  if (isError)
    return (
      <p className='w-full text-sm opacity-80 text-center'>
        Oops! Something went wrong. Please try again.
      </p>
    );

  return (
    <div className='mx-auto max-w-3xl flex flex-col gap-8 lg:gap-10'>
      {isLoading ? (
        <FeedBlogCardListSkeleton />
      ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
        <p className='text-sm text-center opacity-80'>No blogs available.</p>
      ) : (
        blogs?.blogs.map((blog) => (
          <FeedBlogCard key={blog.blog_id} blog={blog} status={status} />
        ))
      )}
    </div>
  );
};
