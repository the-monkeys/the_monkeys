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
      <header className='mb-6'>
        <p className='font-inter text-[11px] font-bold uppercase tracking-[0.22em] text-brand-orange'>
          Community
        </p>
        <h1 className='mt-1 font-newsreader text-4xl font-bold md:text-5xl'>
          Discussions
        </h1>
        <p className='mt-2 font-inter text-sm text-gray-500 dark:text-gray-400'>
          Short posts and replies from the Monkeys community.
        </p>
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
