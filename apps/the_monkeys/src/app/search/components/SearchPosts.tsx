import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { useGetSearchBlog } from '@/hooks/blog/useGetSearchBlog';

export const SearchPosts = ({ query }: { query: string }) => {
  const { searchBlogs, searchBlogsLoading, searchBlogsError } =
    useGetSearchBlog(query.trim() ? query : undefined);

  if (searchBlogsLoading) {
    return <FeedBlogCardListSkeleton />;
  }

  if (searchBlogsError) {
    return (
      <div className='p-2 flex items-center justify-center'>
        <p className='opacity-90'>No results found.</p>
      </div>
    );
  }

  const blogs = searchBlogs?.blogs;

  return (
    <>
      {!blogs || blogs === null ? (
        <p className='py-2 text-sm opacity-90 text-center'>
          No posts found for your search
        </p>
      ) : (
        <div className='max-w-4xl'>
          <div className='flex flex-col gap-4'>
            {blogs.slice(0, 8).map((blog) => {
              return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};
