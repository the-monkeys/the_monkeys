import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { directoryPageState } from '@/lib/directoryPageData';
import { GROUPS_SEO, pageMetadata } from '@/lib/seo';
import { groupsHubGraph } from '@/lib/seoSchema';
import { HydrationBoundary } from '@tanstack/react-query';

import GroupsPageClient from './GroupsPageClient';

export const metadata: Metadata = pageMetadata({
  ...GROUPS_SEO,
  rss: '/groups/feed.xml',
});

export default async function GroupsPage() {
  const state = await directoryPageState();
  const graph = groupsHubGraph([]);
  graph['@graph'] = graph['@graph'].filter(
    (node) => node['@type'] !== 'FAQPage'
  );
  return (
    <>
      <JsonLd data={graph} />
      <HydrationBoundary state={state}>
        <GroupsPageClient />
      </HydrationBoundary>
    </>
  );
}
