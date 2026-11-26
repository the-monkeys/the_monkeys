import type { Metadata } from 'next';
import { cookies } from 'next/headers';

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
  const list = await loadSiteDiscussions(undefined, cookies().toString());

  return (
    <div className='mx-auto w-full min-w-0 max-w-3xl'>
      <JsonLd data={buildDiscussionFeedJsonLd()} />
      <header className='mb-3'>
        <h1 className='font-newsreader text-2xl font-semibold'>Discussions</h1>
      </header>
      {list ? (
        <DiscussionListClient
          initial={list.discussions ?? []}
          key={list.discussions?.[0]?.public_id ?? 'empty'}
        />
      ) : (
        <p className='font-inter text-sm text-gray-500'>
          Discussions are temporarily unavailable.
        </p>
      )}
    </div>
  );
}
