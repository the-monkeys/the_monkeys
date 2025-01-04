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
  const title = searchParams.source === 'news' ? 'News' : null;
  const description =
    searchParams.source ===
    'Stay in the loop with the latest headlines and breaking news on business, sports, politics, technology and stock market from around the world on Monkeys.'
      ? 'News'
      : null;

  return {
    title: title,
    description: description,
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
