import Link from 'next/link';

import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import {
  TrendingBlogCardLarge,
  TrendingBlogCardSmall,
} from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { TopicLinksContainer } from '@/components/topics/topicsContainer';
import { RecommendedUserCard } from '@/components/user/userInfo';
import { TOPIC_ROUTE } from '@/constants/routeConstants';
import { recommendedUsers } from '@/constants/social';
import { recommendedTopics } from '@/constants/topics';
import { MetaBlog } from '@/services/blog/blogTypes';

const TrendingSection = ({ blogs }: { blogs: MetaBlog[] }) => {
  return (
    <div className='space-y-6'>
      <Container className='px-4 pt-8 md:pt-10'>
        <div className='grid grid-cols-2 gap-8'>
          <div className='col-span-2 [@media(min-width:1200px)]:col-span-1'>
            <TrendingBlogCardLarge blog={blogs[0]} />
          </div>

          <div className='col-span-2 [@media(min-width:1200px)]:col-span-1 grid grid-cols-2 gap-8'>
            {blogs.slice(1, 5).map((blog) => (
              <div className='col-span-2 sm:col-span-1' key={blog.blog_id}>
                <TrendingBlogCardSmall blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </Container>

      <Container className='sm:pt-12 px-4 pb-6 grid grid-cols-3 gap-10 lg:gap-12'>
        <div className='col-span-3 lg:col-span-2 max-w-4xl'>
          <div className='flex flex-col gap-8'>
            {blogs.slice(5, 15).map((blog) => {
              return <FeedBlogCard blog={blog} key={blog.blog_id} />;
            })}
          </div>
        </div>

        <div className='col-span-3 lg:col-span-1 h-fit grid grid-cols-2 lg:grid-cols-1 gap-10'>
          <div className='col-span-2 sm:col-span-1 flex flex-col gap-6'>
            <ContributeAndSponsorCard />
          </div>

          <div className='col-span-2 sm:col-span-1 flex flex-col gap-6'>
            <h6 className='px-1 pb-2 font-dm_sans font-medium text-lg border-b-1 border-border-light dark:border-border-dark'>
              Topics on the rise
            </h6>

            <TopicLinksContainer topics={recommendedTopics} />

            <LinksRedirectArrow target='_blank' link={`${TOPIC_ROUTE}/explore`}>
              <p className='px-2 text-sm'>Explore more topics</p>
            </LinksRedirectArrow>
          </div>

          <div className='col-span-2 lg:col-span-1 flex flex-col gap-6'>
            <h6 className='px-1 pb-2 font-dm_sans font-medium text-lg border-b-1 border-border-light dark:border-border-dark'>
              Authors making headlines
            </h6>

            <div className='grid grid-cols-2 gap-6'>
              {recommendedUsers.map((user, index) => {
                return (
                  <div
                    className='col-span-2 sm:col-span-1 lg:col-span-2'
                    key={index}
                  >
                    <RecommendedUserCard id={user.userID} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TrendingSection;
