import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { GROUPS_SEO, pageMetadata } from '@/lib/seo';
import { groupsHubGraph } from '@/lib/seoSchema';

import GroupsPageClient from './GroupsPageClient';

export const metadata: Metadata = pageMetadata({
  ...GROUPS_SEO,
  rss: '/groups/feed.xml',
});

export default function GroupsPage() {
  return (
    <>
      <JsonLd data={groupsHubGraph(GROUPS_SEO.faqs)} />
      <GroupsPageClient />
    </>
  );
}
