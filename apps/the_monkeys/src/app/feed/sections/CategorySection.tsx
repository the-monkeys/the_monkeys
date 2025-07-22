import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { TrendingBlogCardS } from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
import { FeedCategorySectionSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetCategoryBlogs from '@/hooks/posts/useGetCategoryBlogs';
import { Separator } from '@the-monkeys/ui/atoms/separator';

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
    <Container className='px-4 py-6'>
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
        <FeedCategorySectionSkeleton />
      ) : (
        <div className='space-y-8 lg:space-y-10'>
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-6'>
            {blogs?.blogs.slice(0, 6).map((blog) => {
              return (
                <div className='col-span-3 md:col-span-1' key={blog?.blog_id}>
                  <TrendingBlogCardS blog={blog} />
                </div>
              );
            })}
          </div>

          <Separator className='mx-auto w-1/2' />

          <div className='grid grid-cols-2 gap-6'>
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
