import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { loadDiscoveryGroups } from '@/lib/publicDiscovery';
import { GROUPS_SEO, pageMetadata } from '@/lib/seo';
import { groupsHubGraph } from '@/lib/seoSchema';

import GroupsPageClient from './GroupsPageClient';

export const metadata: Metadata = pageMetadata({
  ...GROUPS_SEO,
  rss: '/groups/feed.xml',
});

export default async function GroupsPage() {
  const initialGroups = await loadDiscoveryGroups();
  return (
    <>
      <JsonLd data={groupsHubGraph(GROUPS_SEO.faqs)} />
      <GroupsPageClient initialGroups={initialGroups} />
    </>
  );
}
