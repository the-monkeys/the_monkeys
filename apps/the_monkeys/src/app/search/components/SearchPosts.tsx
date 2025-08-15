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
        <div className='flex flex-col space-y-8'>
          {blogs.map((blog) => {
            return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
          })}
        </div>
      )}
    </>
  );
};
