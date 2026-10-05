'use client';

import { useState } from 'react';

import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
import useAuth from '@/hooks/auth/useAuth';
import { listDiscussions } from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';

const PAGE_SIZE = 20;

export function DiscussionListClient({ initial }: { initial: Discussion[] }) {
  const session = useAuth().data as { username?: string } | null | undefined;
  const signedIn = Boolean(session?.username);
  const [posts, setPosts] = useState<Discussion[]>(initial);
  const [hasMore, setHasMore] = useState(initial.length >= PAGE_SIZE);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function loadOlder() {
    const last = posts[posts.length - 1];
    if (busy || !last) return;
    setBusy(true);
    setFailed(false);
    try {
      const page = await listDiscussions({ kind: 'site' }, last.public_id);
      const older = Array.isArray(page?.discussions) ? page.discussions : [];
      setPosts((current) => [...current, ...older]);
      setHasMore(older.length >= PAGE_SIZE);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className='flex min-w-0 flex-col gap-6'>
      <DiscussionComposer
        lockedMessage={signedIn ? null : 'Log in to post a discussion.'}
        scope={{ kind: 'site' }}
      />
      {posts.length === 0 ? (
        <p className='font-inter text-base leading-relaxed'>
          No discussions yet.
        </p>
      ) : (
        <ul className='flex min-w-0 flex-col gap-6'>
          {posts.map((post) => (
            <li className='min-w-0' key={post.public_id}>
              <DiscussionCard linked post={post} />
            </li>
          ))}
        </ul>
      )}
      {failed ? (
        <p className='font-inter text-base' role='alert'>
          Could not load older discussions.
        </p>
      ) : null}
      {posts.length > 0 && hasMore ? (
        <button
          className='min-h-11 self-start rounded border px-4'
          disabled={busy}
          onClick={loadOlder}
          type='button'
        >
          Older discussions
        </button>
      ) : null}
    </div>
  );
}
