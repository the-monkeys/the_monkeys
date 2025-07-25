import Link from 'next/link';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { HeadlineBlogCard } from '@/components/cards/blog/HeadlineBlogCard';
import {
  TrendingBlogCardL,
  TrendingBlogCardS,
} from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
import { TopicLinksContainer } from '@/components/topics/topicsContainer';
import { TOPIC_ROUTE } from '@/constants/routeConstants';
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
        <Container className='px-4 grid grid-cols-3 gap-8 lg:gap-12 xl:gap-16'>
          <div className='col-span-3 lg:col-span-2'>
            <div className='flex flex-col gap-6'>
              {blogs.slice(5, 15).map((blog) => {
                return <FeedBlogCard blog={blog} key={blog.blog_id} />;
              })}
            </div>
          </div>

          <div className='col-span-3 lg:col-span-1 h-fit grid grid-cols-2 lg:grid-cols-1 gap-6'>
            {/* Headline blogs section - will replace with some other section in future */}

            <div className='col-span-2 md:col-span-1 flex flex-col gap-3'>
              <h6 className='py-2 font-dm_sans font-semibold'>
                Topics on the rise
              </h6>

              <TopicLinksContainer topics={recommendedTopics} />

              <Link
                href={`${TOPIC_ROUTE}/explore`}
                className='w-fit text-sm opacity-90 hover:underline'
              >
                Explore more topics
              </Link>
            </div>

            <div className='col-span-2 md:col-span-1 flex flex-col gap-3'>
              <h6 className='py-2 font-dm_sans font-semibold'>
                People to follow
              </h6>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TrendingSection;
