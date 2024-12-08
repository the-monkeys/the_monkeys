import { BlogRecommendationCard } from '@/components/blog/cards/BlogRecommendationCard';
import { Loader } from '@/components/loader';
import useGetLatest100Blogs from '@/hooks/blog/useGetLatest100Blogs';

export const BlogRecommendations = () => {
  const { blogs, isLoading, isError } = useGetLatest100Blogs();

  if (isLoading) return <Loader className='mx-auto' />;

  if (isError)
    return (
      <p className='py-4 font-roboto text-sm text-alert-red text-center'>
        Error fetching blogs. Try again.
      </p>
    );

  return (
    <div className='flex flex-col gap-4'>
      {blogs?.the_blogs.length ? (
        blogs?.the_blogs.map((blog) => {
          return blog?.blog?.blocks.length < 5 ? null : (
            <BlogRecommendationCard key={blog?.blog_id} blog={blog} />
          );
        })
      ) : (
        <p className='font-roboto text-sm opacity-80 text-center'>
          No blogs available.
        </p>
      )}
    </div>
  );
};
