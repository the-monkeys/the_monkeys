import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { HeadlineBlogCard } from '@/components/cards/blog/HeadlineBlogCard';
import {
  TrendingBlogCardL,
  TrendingBlogCardS,
} from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
import { Blog } from '@/services/blog/blogTypes';

const TrendingSection = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className='space-y-8'>
      <div>
        <Container className='px-4 py-8 md:py-10'>
          <div className='grid grid-cols-2 gap-6 sm:gap-4'>
            <div className='col-span-2 lg:col-span-1'>
              <TrendingBlogCardL blog={blogs[0]} />
            </div>

            <div className='col-span-2 lg:col-span-1 grid grid-cols-2 gap-6 sm:gap-4'>
              {blogs.slice(1, 5).map((blog) => (
                <div className='col-span-2 sm:col-span-1' key={blog.blog_id}>
                  <TrendingBlogCardS blog={blog} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className='py-6 bg-foreground-light dark:bg-foreground-dark'>
        <Container className='px-4 grid grid-cols-3 gap-6 lg:gap-8'>
          <div className='col-span-3 md:col-span-2 space-y-8'>
            <h5 className='font-dm_sans font-extrabold text-brand-orange text-5xl md:text-6xl'>
              Just in
            </h5>

            <div className='divide-y-1 divide-border-light dark:divide-border-dark'>
              {blogs.slice(6, 15).map((blog) => {
                return <FeedBlogCard blog={blog} key={blog.blog_id} />;
              })}
            </div>
          </div>

          <div className='col-span-3 md:col-span-1 space-y-6'>
            <ContributeAndSponsorCard className='p-4 lg:p-6' />

            <div className=''>
              <h5 className='px-1 py-2 font-dm_sans font-semibold text-3xl'>
                Headlines
              </h5>

              <div className='p-4 lg:p-6 border-1 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark'>
                <div className='flex flex-col divide-y-1 divide-border-light dark:divide-border-dark'>
                  {blogs.slice(16, 26).map((blog) => {
                    return <HeadlineBlogCard key={blog.blog_id} blog={blog} />;
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TrendingSection;
