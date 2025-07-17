import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
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
        <Container className='px-4 py-8 md:py-10'>
          <div className='grid grid-cols-2 gap-6 md:gap-5'>
            <div className='col-span-2 lg:col-span-1'>
              <TrendingBlogCardL blog={blogs[0]} />
            </div>

            <div className='col-span-2 lg:col-span-1 grid grid-cols-2 gap-6 md:gap-5'>
              {blogs.slice(1, 5).map((blog) => (
                <div className='col-span-2 sm:col-span-1' key={blog.blog_id}>
                  <TrendingBlogCardS blog={blog} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className='py-6 bg-foreground-light/40 dark:bg-foreground-dark/40'>
        <Container className='px-4 grid grid-cols-3 gap-8'>
          <div className='col-span-3 md:col-span-2'>
            <div className='flex flex-col gap-6'>
              {blogs.slice(6, 16).map((blog) => {
                return <FeedBlogCard blog={blog} key={blog.blog_id} />;
              })}
            </div>
          </div>

          <div className='col-span-3 md:col-span-1 space-y-8'>
            <div>
              <div className='px-3 py-2 bg-brand-orange rounded-tl-sm rounded-tr-sm'>
                <h5 className='font-dm_sans font-medium text-xl text-white'>
                  Latest Headlines
                </h5>
              </div>

              <div className='py-2 flex flex-col rounded-bl-sm rounded-br-sm border-1 border-t-0 border-border-light dark:border-border-dark divide-y-1 divide-border-light dark:divide-border-dark'>
                {blogs.slice(16, 26).map((blog) => {
                  return <HeadlineBlogCard key={blog.blog_id} blog={blog} />;
                })}
              </div>
            </div>

            {/* <ContributeAndSponsorCard className='p-4 lg:p-6' /> */}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TrendingSection;
