import { Metadata } from 'next';

import { FeedNavigation } from './components/FeedNavigation';
import { BlogFeed } from './components/blogFeed/BlogFeed';
import { FollowingFeed } from './components/followingFeed/FollowingFeed';
import { ShowcaseFeed } from './components/showcaseFeed/ShowcaseFeed';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { source: string };
}): Promise<Metadata> {
  const title = 'Latest Blog Feed';
  const description =
    'Stay in the loop with the latest blogs and news on business, sports, politics, technology from around the world on Monkeys.';

  return {
    title: title,
    description: description,
    alternates: {
      canonical: '/feed',
    },
  };
}

const BlogFeedPage = ({
  searchParams,
}: {
  searchParams: { source: string };
}) => {
  const feedSource = searchParams.source || 'feed';

  return (
    <div>
      <FeedNavigation feedSource={feedSource} />

      <div className='min-h-screen'>
        {feedSource === 'all' && <BlogFeed />}
        {feedSource === 'following' && <FollowingFeed />}
        {feedSource === 'feed' && <ShowcaseFeed />}
      </div>
    </div>
  );
};

export default BlogFeedPage;
