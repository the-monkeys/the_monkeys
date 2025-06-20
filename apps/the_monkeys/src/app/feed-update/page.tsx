import { Metadata } from 'next';

import HeroGrid from './components/hero/grid';
import TopicFeedComponent from './components/topicFeed/topicFeed';
import TrendingCategories from './components/trending/trending';

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
      <HeroGrid />
      <TrendingCategories />
      <TopicFeedComponent />
    </div>
  );
};

export default BlogFeedPage;
