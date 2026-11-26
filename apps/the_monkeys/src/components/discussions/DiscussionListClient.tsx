'use client';

import { useState } from 'react';

import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
import { DiscussionFeedActions } from '@/components/discussions/DiscussionFeedActions';
import useAuth from '@/hooks/auth/useAuth';
import { listDiscussions } from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

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
    <div className='min-w-0'>
      <DiscussionComposer
        locked={signedIn ? null : 'login'}
        scope={{ kind: 'site' }}
      />
      <DiscussionFeed posts={posts} />
      {failed ? (
        <p className='mt-4 font-inter text-sm text-alert-red' role='alert'>
          Could not load older discussions.
        </p>
      ) : null}
      {posts.length > 0 && hasMore ? (
        <div className='mt-6 flex justify-center'>
          <Button
            disabled={busy}
            onClick={loadOlder}
            size='sm'
            type='button'
            variant='outline'
          >
            Older discussions
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function DiscussionFeed({ posts }: { posts: Discussion[] }) {
  if (posts.length === 0) {
    return (
      <p className='py-10 text-center font-inter text-sm text-gray-500'>
        No discussions yet.
      </p>
    );
  }
  return (
    <ul className='mt-4 min-w-0 space-y-4'>
      {posts.map((post) => (
        <li className='min-w-0' key={post.public_id}>
          <DiscussionCard
            footer={<DiscussionFeedActions post={post} />}
            linked
            post={post}
          />
        </li>
      ))}
    </ul>
  );
}
