import { FeedBlogCard } from '@/components/blog/cards/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetLatest100Blogs from '@/hooks/blog/useGetLatest100Blogs';

export const LatestBlogs = () => {
  const { blogs, isLoading, isError } = useGetLatest100Blogs();

  if (isError)
    return (
      <p className='w-full text-sm opacity-80 text-center'>
        Oops! Something went wrong. Please try again.
      </p>
    );

  return (
    <div className='mx-auto max-w-3xl flex flex-col gap-10'>
      {isLoading ? (
        <FeedBlogCardListSkeleton />
      ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
        <p className='text-sm text-center opacity-80'>No blogs available.</p>
      ) : (
        blogs?.blogs.map((blog) => {
          return blog.blog.blocks.length < 5 ? null : (
            <FeedBlogCard key={blog.blog_id} blog={blog} />
          );
        })
      )}
    </div>
  );
};
