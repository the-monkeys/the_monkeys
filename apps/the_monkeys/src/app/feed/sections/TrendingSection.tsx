import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { HeadlineBlogCard } from '@/components/cards/blog/HeadlineBlogCard';
import {
  TrendingBlogCardL,
  TrendingBlogCardS,
} from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
import { MetaBlog } from '@/services/blog/blogTypes';

const TrendingSection = ({ blogs }: { blogs: MetaBlog[] }) => {
  return (
    <div className='space-y-6'>
      <div className=''>
        <Container className='px-4 pt-8 md:pt-10'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='col-span-2 lg:col-span-1'>
              <TrendingBlogCardL blog={blogs[0]} />
            </div>

            <div className='col-span-2 lg:col-span-1 grid grid-cols-2 gap-6'>
              {blogs.slice(1, 5).map((blog) => (
                <div className='col-span-2 sm:col-span-1' key={blog.blog_id}>
                  <TrendingBlogCardS blog={blog} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className='py-6'>
        <Container className='px-4 grid grid-cols-3 gap-8'>
          <div className='col-span-3 lg:col-span-2'>
            <div className='flex flex-col gap-6'>
              {blogs.slice(6, 16).map((blog) => {
                return <FeedBlogCard blog={blog} key={blog.blog_id} />;
              })}
            </div>
          </div>

          <div className='hidden lg:block col-span-3 lg:col-span-1 space-y-8'>
            <div className='flex flex-col divide-y-1 divide-border-light dark:divide-border-dark'>
              {blogs.slice(16, 24).map((blog) => {
                return <HeadlineBlogCard key={blog.blog_id} blog={blog} />;
              })}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TrendingSection;
