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
    <div className='px-4 pt-6'>
      <div className='mb-10'>
        <h5 className='mt-2 pb-3 font-dm_sans font-semibold text-2xl break-words'>
          {title}
        </h5>

        <div className='w-[100px] h-[2px] bg-brand-orange' />
      </div>

      {isLoading ? (
        <FeedBlogCardListSkeleton />
      ) : (
        <div className='max-w-4xl'>
          <div className='flex flex-col gap-4'>
            {blogs?.blogs.slice(0, 5).map((blog) => {
              return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySectionCompact;
