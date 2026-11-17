import Link from 'next/link';
import { notFound } from 'next/navigation';

import { canSnapshotDiscussion } from '@/features/snapshot/adapters/fromDiscussion';
import { DiscussionStudio } from '@/features/snapshot/components/DiscussionStudio';
import { loadDiscussion } from '@/lib/discussionPageData';
import { noIndexPage } from '@/lib/seo';

export const metadata = noIndexPage('Discussion Studio | Monkeys');

export default async function DiscussionStudioPage({
  params,
}: {
  params: { id: string };
}) {
  // Reuse the public read path. An export entry must not publish member-only content.
  const found = await loadDiscussion(params.id, '');
  if (found.state === 'missing') notFound();
  if (found.state === 'unavailable') {
    return (
      <div className='mx-auto max-w-md px-4 py-16 text-center'>
        <h1 className='mb-2 font-newsreader text-2xl'>
          Studio temporarily unavailable
        </h1>
        <p className='mb-6 text-foreground/70'>Please try again in a moment.</p>
        <Link
          href={`/discussions/${encodeURIComponent(params.id)}`}
          className='text-brand-orange underline'
        >
          Back to discussion
        </Link>
      </div>
    );
  }
  if (!canSnapshotDiscussion(found.discussion)) notFound();
  return (
    <DiscussionStudio
      key={found.discussion.public_id}
      post={found.discussion}
    />
  );
}
