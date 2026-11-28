import Link from 'next/link';

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
      <nav
        className='flex flex-wrap gap-x-6 gap-y-3 py-4'
        aria-label='Learning and creator tools'
      >
        <Link
          href='/learn'
          className='inline-flex min-h-11 items-center text-brand-orange hover:underline'
        >
          Developer learning resources
        </Link>
        <Link
          href='/snapshot'
          className='inline-flex min-h-11 items-center text-brand-orange hover:underline'
        >
          Explore Studio
        </Link>
      </nav>
    </>
  );
}
