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
        blogs?.the_blogs.slice(0, 5).map((blog) => {
          return <BlogRecommendationCard key={blog?.blog_id} blog={blog} />;
        })
      ) : (
        <p className='py-4 font-roboto text-sm text-alert-red text-center'>
          No blogs available.
        </p>
      )}
    </div>
  );
};
