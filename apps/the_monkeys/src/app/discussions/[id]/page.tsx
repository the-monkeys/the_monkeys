import { cache } from 'react';

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { DiscussionThread } from '@/components/discussions/DiscussionThread';
import { JsonLd } from '@/components/seo/JsonLd';
import { loadDiscussion } from '@/lib/discussionPageData';
import {
  buildDiscussionJsonLd,
  buildDiscussionMetadata,
} from '@/lib/discussionSeo';
import { noIndexPage } from '@/lib/seo';

interface Props {
  params: { id: string };
}

// Dedupe the no-store fetch between generateMetadata and the page per request.
const loadDiscussionForRequest = cache(loadDiscussion);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await loadDiscussionForRequest(params.id, cookies().toString());
  if (found.state === 'missing') {
    return noIndexPage('Discussion not found | Monkeys');
  }
  if (found.state === 'unavailable') {
    return noIndexPage('Discussion temporarily unavailable | Monkeys');
  }
  return buildDiscussionMetadata(found.discussion, found.indexable);
}

export default async function DiscussionPage({ params }: Props) {
  const found = await loadDiscussionForRequest(params.id, cookies().toString());
  if (found.state === 'missing') notFound();

  if (found.state === 'unavailable') {
    return (
      <div className='mx-auto w-full min-w-0 max-w-2xl pb-24 lg:pb-0'>
        <p className='font-inter text-base leading-relaxed'>
          This discussion is temporarily unavailable.
        </p>
      </div>
    );
  }

  return (
    <>
      {found.indexable ? (
        <JsonLd data={buildDiscussionJsonLd(found.discussion)} />
      ) : null}
      <DiscussionThread post={found.discussion} />
    </>
  );
}
