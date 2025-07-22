import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { HeadlineBlogCard } from '@/components/cards/blog/HeadlineBlogCard';
import {
  TrendingBlogCardL,
  TrendingBlogCardS,
} from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
import { TopicLinksContainer } from '@/components/topics/topicsContainer';
import { recommendedTopics } from '@/constants/topics';
import { MetaBlog } from '@/services/blog/blogTypes';

const TrendingSection = ({ blogs }: { blogs: MetaBlog[] }) => {
  return (
    <div className='space-y-6'>
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

      <div className='py-6'>
        <Container className='px-4 grid grid-cols-3 gap-8'>
          <div className='col-span-3 lg:col-span-2'>
            <div className='flex flex-col gap-6'>
              {blogs.slice(6, 16).map((blog) => {
                return <FeedBlogCard blog={blog} key={blog.blog_id} />;
              })}
            </div>
          </div>

          <div className='col-span-3 lg:col-span-1 h-fit grid grid-cols-2 lg:grid-cols-1 gap-6'>
            <div className='col-span-2 md:col-span-1 flex flex-col divide-y-1 divide-border-light dark:divide-border-dark rounded-md overflow-hidden'>
              {blogs.slice(16, 22).map((blog) => {
                return <HeadlineBlogCard key={blog.blog_id} blog={blog} />;
              })}
            </div>

            <div className='col-span-2 md:col-span-1 space-y-3'>
              <h6 className='p-1 font-dm_sans font-medium'>
                Recommended Topics
              </h6>

              <TopicLinksContainer topics={recommendedTopics} />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TrendingSection;
