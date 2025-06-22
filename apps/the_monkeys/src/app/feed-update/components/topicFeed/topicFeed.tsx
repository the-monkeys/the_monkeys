import { topicsData } from './data';
import TopicGrid from './topicGrid';

export default function TopicFeedComponent() {
  return (
    <>
      <TopicGrid {...topicsData.business} />
      <TopicGrid {...topicsData.ai} />
      <TopicGrid {...topicsData.travel} />
      <TopicGrid {...topicsData.entertainment} />
    </>
  );
}
