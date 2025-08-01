import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetCategoryBlogs from '@/hooks/posts/useGetCategoryBlogs';

const CategorySectionCompact = ({
  title,
  category,
}: {
  title: string;
  category: string;
}) => {
  const { blogs, isError, isLoading } = useGetCategoryBlogs({
    category: category,
    limit: 8,
  });

  if (!blogs?.blogs) {
    return null;
  }

  if (isError) return null;

  return (
    <div className='px-4 py-6'>
      <div className='mb-10'>
        <h5 className='mt-2 py-1 font-dm_sans font-medium text-2xl break-words'>
          {title}
        </h5>

        <div className='flex items-end'>
          <div className='w-[80px] h-1 bg-brand-orange' />
          <div className='flex-grow h-[1px] bg-border-light dark:bg-border-dark' />
        </div>
      </div>

      {isLoading ? (
        <FeedBlogCardListSkeleton />
      ) : (
        <div className='flex flex-col gap-5'>
          {blogs?.blogs.slice(0, 5).map((blog) => {
            return (
              <div className='col-span-2 lg:col-span-1' key={blog?.blog_id}>
                <FeedBlogCard blog={blog} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategorySectionCompact;
