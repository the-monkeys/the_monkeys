import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { TrendingBlogCardSmall } from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
import { FeedCategorySectionSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetCategoryBlogs from '@/hooks/posts/useGetCategoryBlogs';

const CategorySection = ({
  title,
  category,
}: {
  title: string;
  category: string;
}) => {
  const { blogs, isError, isLoading } = useGetCategoryBlogs({
    category: category,
  });

  if (!blogs?.blogs) {
    return null;
  }

  if (isError) return null;

  return (
    <Container className='px-4 pt-6'>
      <div className='mb-10'>
        <h5 className='mt-2 pb-3 font-dm_sans font-semibold text-2xl break-words'>
          {title}
        </h5>

        <div className='flex items-end'>
          <div className='w-[80px] h-1 bg-brand-orange' />
          <div className='flex-grow h-[1px] bg-border-light/60 dark:bg-border-dark/60' />
        </div>
      </div>

      {isLoading ? (
        <FeedCategorySectionSkeleton />
      ) : (
        <div className='space-y-8 sm:space-y-12 lg:space-y-14'>
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogs?.blogs.slice(0, 6).map((blog) => {
              return (
                <div className='col-span-2 md:col-span-1' key={blog?.blog_id}>
                  <TrendingBlogCardSmall blog={blog} />
                </div>
              );
            })}
          </div>

          <div className='grid grid-cols-2 gap-8'>
            {blogs?.blogs.slice(6, 12).map((blog) => {
              return (
                <div className='col-span-2 lg:col-span-1' key={blog?.blog_id}>
                  <FeedBlogCard blog={blog} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Container>
  );
};

export default CategorySection;
