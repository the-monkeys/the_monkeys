'use client';

import { useRef, useState } from 'react';

import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
import { DiscussionFeedActions } from '@/components/discussions/DiscussionFeedActions';
import useAuth from '@/hooks/auth/useAuth';
import { publicDiscussionPage } from '@/lib/discussionPagination';
import { listDiscussions } from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

export function DiscussionListClient({
  initial,
  nextBeforeId,
}: {
  initial: Discussion[];
  nextBeforeId?: string | null;
}) {
  const session = useAuth().data as { username?: string } | null | undefined;
  const signedIn = Boolean(session?.username);
  const [posts, setPosts] = useState<Discussion[]>(initial);
  const [cursor, setCursor] = useState(
    nextBeforeId === undefined
      ? publicDiscussionPage({ discussions: initial })?.nextBeforeId
      : nextBeforeId ?? undefined
  );
  const visited = useRef(new Set<string>());
  const loading = useRef(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function loadOlder() {
    if (loading.current || !cursor) return;
    loading.current = true;
    setBusy(true);
    setFailed(false);
    try {
      const page = publicDiscussionPage(
        await listDiscussions({ kind: 'site' }, cursor)
      );
      if (!page) throw new Error('Invalid discussion page');
      visited.current.add(cursor);
      setPosts((current) => {
        const ids = new Set(current.map((post) => post.public_id));
        return [
          ...current,
          ...page.discussions.filter((post) => {
            if (ids.has(post.public_id)) return false;
            ids.add(post.public_id);
            return true;
          }),
        ];
      });
      setCursor(
        page.nextBeforeId && !visited.current.has(page.nextBeforeId)
          ? page.nextBeforeId
          : undefined
      );
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
      loading.current = false;
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
      {cursor ? (
        <div className='mt-6 flex justify-center'>
          <Button asChild size='sm' variant='outline'>
            <a
              aria-busy={busy}
              aria-disabled={busy || undefined}
              href={`/discussions?before_id=${encodeURIComponent(cursor)}`}
              onClick={(event) => {
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                // Keep incremental loads on the current history entry. Thread
                // navigation and Back retain the existing feed behavior.
                void loadOlder();
              }}
            >
              Older discussions
            </a>
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
