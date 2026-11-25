'use client';

import { useEffect, useRef, useState } from 'react';

import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
import { DiscussionFeedActions } from '@/components/discussions/DiscussionFeedActions';
import useAuth from '@/hooks/auth/useAuth';
import { listDiscussions } from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

const PAGE_SIZE = 20;

export function DiscussionListClient({ initial }: { initial: Discussion[] }) {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const [owner, setOwner] = useState(viewer);
  const [useInitial, setUseInitial] = useState(true);
  // Reset during render so an account change never commits the old list.
  if (owner !== viewer) {
    setOwner(viewer);
    setUseInitial(false);
  }
  return (
    <ViewerDiscussionList
      key={viewer || 'anonymous'}
      initial={useInitial ? initial : undefined}
      refreshToken={initial}
      signedIn={Boolean(session?.username)}
    />
  );
}

function ViewerDiscussionList({
  initial,
  refreshToken,
  signedIn,
}: {
  initial?: Discussion[];
  refreshToken: Discussion[];
  signedIn: boolean;
}) {
  const [posts, setPosts] = useState<Discussion[]>(initial ?? []);
  const [hasMore, setHasMore] = useState((initial?.length ?? 0) >= PAGE_SIZE);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const request = useRef(0);
  useEffect(() => {
    const version = ++request.current;
    if (initial) {
      setPosts(initial);
      setHasMore(initial.length >= PAGE_SIZE);
    } else {
      setBusy(true);
      void listDiscussions({ kind: 'site' })
        .then((page) => {
          if (request.current !== version) return;
          const fresh = Array.isArray(page?.discussions)
            ? page.discussions
            : [];
          setPosts(fresh);
          setHasMore(fresh.length >= PAGE_SIZE);
        })
        .catch(() => {
          if (request.current === version) setFailed(true);
        })
        .finally(() => {
          if (request.current === version) setBusy(false);
        });
    }
    return () => {
      ++request.current;
    };
  }, [initial, refreshToken]);

  async function loadOlder() {
    const last = posts[posts.length - 1];
    if (busy || !last) return;
    const version = request.current;
    setBusy(true);
    setFailed(false);
    try {
      const page = await listDiscussions({ kind: 'site' }, last.public_id);
      if (request.current !== version) return;
      const older = Array.isArray(page?.discussions) ? page.discussions : [];
      setPosts((current) => [...current, ...older]);
      setHasMore(older.length >= PAGE_SIZE);
    } catch {
      if (request.current === version) setFailed(true);
    } finally {
      if (request.current === version) setBusy(false);
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
