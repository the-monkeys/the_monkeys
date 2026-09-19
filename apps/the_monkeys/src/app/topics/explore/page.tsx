import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildTopicCatalogJsonLd,
  fetchTopicCatalog,
  summarizeTopicCatalog,
} from '@/lib/topicCatalog';

import TopicsExplorerClient from './TopicsExplorerClient';

export default async function ExploreTopicsPage() {
  const categories = await fetchTopicCatalog();
  const initialCategories = summarizeTopicCatalog(categories);

  return (
    <>
      <JsonLd data={buildTopicCatalogJsonLd(categories)} />
      <TopicsExplorerClient initialCategories={initialCategories} />
    </>
  );
}
