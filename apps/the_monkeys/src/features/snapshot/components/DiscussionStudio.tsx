'use client';

import { useMemo } from 'react';

import Link from 'next/link';

import useUser from '@/hooks/user/useUser';
import { SITE_URL } from '@/lib/seo';
import type { Discussion } from '@/services/discussions/discussionsTypes';

import { fromDiscussion } from '../adapters/fromDiscussion';
import { useSnapshotAuthor } from '../hooks/useSnapshotAuthor';
import { SnapshotStudio } from './SnapshotStudio';

export function DiscussionStudio({
  post,
  origin = SITE_URL,
}: {
  post: Discussion;
  origin?: string;
}) {
  const handle = post.author_gone ? undefined : post.author_username?.trim();
  const { user, isLoading } = useUser(handle);
  const displayName =
    [user?.first_name?.trim(), user?.last_name?.trim()]
      .filter(Boolean)
      .join(' ') || (handle ? `@${handle}` : 'Deleted account');
  const { author, isReady } = useSnapshotAuthor(handle, displayName);
  const input = useMemo(
    () =>
      fromDiscussion(post, {
        origin,
        author: author
          ? { ...author, isVerified: user?.is_verified === true }
          : undefined,
      }),
    [post, author, user?.is_verified, origin]
  );

  return (
    <div className='mx-auto w-full min-w-0 max-w-6xl px-4 py-6'>
      <div className='mb-4 flex flex-col gap-1'>
        <Link
          href={`/discussions/${encodeURIComponent(post.public_id)}`}
          className='inline-flex min-h-11 items-center text-xs text-foreground/60 hover:text-foreground'
        >
          ← Back to discussion
        </Link>
        <h1 className='font-newsreader text-2xl'>
          Snapshot<span className='text-brand-orange'>.</span>
        </h1>
      </div>
      <SnapshotStudio
        input={input}
        initialTemplateId='quote-card'
        isSourceLoading={Boolean(handle && (isLoading || !isReady))}
      />
      <p className='mt-4 text-sm text-foreground/60'>
        Quote Card and Editorial Portrait include the discussion text. Compact
        templates may show an excerpt.
      </p>
      <p className='mt-4 break-words text-sm text-foreground/60'>
        Original discussion:{' '}
        <Link
          className='text-brand-orange hover:underline'
          href={`/discussions/${encodeURIComponent(post.public_id)}`}
        >
          View discussion →
        </Link>
      </p>
    </div>
  );
}
