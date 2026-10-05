import type { Metadata } from 'next';

import { DiscussionListClient } from '@/components/discussions/DiscussionListClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { loadSiteDiscussions } from '@/lib/discussionPageData';
import { buildDiscussionFeedJsonLd } from '@/lib/discussionSeo';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Discussions | Monkeys',
  description: 'Public discussions on Monkeys. Read a thread or start one.',
  path: '/discussions',
});

export default async function DiscussionsPage() {
  const list = await loadSiteDiscussions();

  return (
    <div className='mx-auto w-full min-w-0 max-w-2xl pb-24 lg:pb-0'>
      <JsonLd data={buildDiscussionFeedJsonLd()} />
      <h1 className='font-inter mb-6 text-2xl font-semibold'>Discussions</h1>
      {list ? (
        <DiscussionListClient
          initial={list.discussions ?? []}
          key={list.discussions?.[0]?.public_id ?? 'empty'}
        />
      ) : (
        <p className='font-inter text-base leading-relaxed'>
          Discussions are temporarily unavailable.
        </p>
      )}
    </div>
  );
}
