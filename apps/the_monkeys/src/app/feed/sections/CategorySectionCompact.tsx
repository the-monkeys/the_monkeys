import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import {
  TrendingBlogCardS,
  TrendingBlogCardText,
} from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
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
  });

  if (isError || isLoading) return null;

  return (
    <div className='px-4 py-6'>
      <div className='mb-8'>
        <div className='flex items-end'>
          <div className='w-[80px] h-1 bg-brand-orange' />
          <div className='flex-grow h-[1px] bg-border-light dark:bg-border-dark' />
        </div>

        <h5 className='mt-2 py-1 font-dm_sans font-medium text-xl md:text-2xl break-words'>
          {title}
        </h5>
      </div>

      <div className='flex flex-col gap-5'>
        {blogs?.blogs.slice(0, 5).map((blog) => {
          return (
            <div className='col-span-2 lg:col-span-1' key={blog?.blog_id}>
              <FeedBlogCard blog={blog} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySectionCompact;
