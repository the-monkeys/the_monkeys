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
    <div className='space-y-6 md:space-y-8'>
      <div className='bg-foreground-light dark:bg-foreground-dark'>
        <Container className='px-4 py-8 md:py-10'>
          <div className='grid grid-cols-2 gap-6 sm:gap-5'>
            <div className='col-span-2 lg:col-span-1'>
              <TrendingBlogCardL blog={blogs[0]} />
            </div>

            <div className='col-span-2 lg:col-span-1 grid grid-cols-2 gap-6 sm:gap-5'>
              {blogs.slice(1, 5).map((blog) => (
                <div className='col-span-2 sm:col-span-1' key={blog.blog_id}>
                  <TrendingBlogCardS blog={blog} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className='pb-6'>
        <Container className='px-4 grid grid-cols-3 gap-8'>
          <div className='col-span-3 md:col-span-2 space-y-6 md:space-y-10'>
            <h5 className='font-semibold font-dm_sans text-brand-orange text-4xl md:text-5xl text-center md:text-left'>
              Just In
            </h5>

            <div className='flex flex-col gap-6 lg:gap-8'>
              {blogs.slice(6, 15).map((blog) => {
                return <FeedBlogCard blog={blog} key={blog.blog_id} />;
              })}
            </div>
          </div>

          <div className='col-span-3 md:col-span-1 space-y-8'>
            <div>
              <h5 className='py-2 font-dm_sans font-semibold text-2xl'>
                Quick Reads
              </h5>

              <div className='pl-2 mt-2'>
                <div className='flex flex-col'>
                  {blogs.slice(16, 26).map((blog) => {
                    return <HeadlineBlogCard key={blog.blog_id} blog={blog} />;
                  })}
                </div>
              </div>
            </div>

            <ContributeAndSponsorCard className='p-4 lg:p-6' />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TrendingSection;
