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

        <div className='w-[100px] h-[2px] bg-brand-orange' />
      </div>

      {isLoading ? (
        <FeedCategorySectionSkeleton />
      ) : (
        <div className='space-y-4 sm:space-y-10'>
          <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
            {blogs?.blogs.slice(0, 2).map((blog) => {
              return (
                <div className='col-span-2 sm:col-span-1' key={blog?.blog_id}>
                  <TrendingBlogCardSmall blog={blog} />
                </div>
              );
            })}
          </div>

          <div className='max-w-4xl'>
            <div className='flex flex-col gap-4'>
              {blogs?.blogs.slice(2, 7).map((blog) => {
                return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
              })}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CategorySection;
