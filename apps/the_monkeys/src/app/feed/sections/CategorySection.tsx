import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import {
  TrendingBlogCardS,
  TrendingBlogCardText,
} from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
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

  if (isError || isLoading) return null;

  return (
    <Container className='px-4 py-6'>
      <div className='mb-8 pl-2 border-l-4 border-brand-orange'>
        <h5 className='py-1 w-fit font-dm_sans font-semibold text-3xl md:text-4xl break-words'>
          {title}
        </h5>
      </div>

      <div className='space-y-4'>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-6'>
          {blogs?.blogs.slice(0, 6).map((blog) => {
            return (
              <div className='col-span-3 md:col-span-1' key={blog?.blog_id}>
                {blog?.first_image ? (
                  <TrendingBlogCardS blog={blog} />
                ) : (
                  <TrendingBlogCardText blog={blog} />
                )}
              </div>
            );
          })}
        </div>

        <div className='pt-3'>
          <p className='font-dm_sans opacity-90'>more in {title}...</p>
        </div>

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
    </Container>
  );
};

export default CategorySection;
