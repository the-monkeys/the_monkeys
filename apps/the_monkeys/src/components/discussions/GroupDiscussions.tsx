'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
import { DiscussionFeed } from '@/components/discussions/DiscussionListClient';
import useAuth from '@/hooks/auth/useAuth';
import { isActiveGroupMember } from '@/lib/groupPerms';
import { listDiscussions } from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';
import axios from 'axios';

export function GroupDiscussions({ group }: { group: GroupItem }) {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || 'anonymous';
  return (
    <ViewerGroupDiscussions
      key={`${viewer}:${group.slug}`}
      group={group}
      signedIn={!!session}
    />
  );
}

function ViewerGroupDiscussions({
  group,
  signedIn,
}: {
  group: GroupItem;
  signedIn: boolean;
}) {
  const request = useRef(0);
  const [posts, setPosts] = useState<Discussion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const slug = group.slug;

  const load = useCallback(async () => {
    const version = ++request.current;
    try {
      const page = await listDiscussions({ kind: 'group', slug });
      if (request.current !== version) return;
      setPosts(Array.isArray(page?.discussions) ? page.discussions : []);
      setError(null);
    } catch (err) {
      if (request.current !== version) return;
      setError(
        axios.isAxiosError(err) && err.response?.status === 404
          ? 'This group is not available.'
          : 'Could not load discussions.'
      );
    }
  }, [slug]);

  useEffect(() => {
    void load();
    return () => {
      ++request.current;
    };
  }, [load]);

  const locked = !signedIn
    ? 'login'
    : !isActiveGroupMember(group)
      ? 'join'
      : null;

  return (
    <div className='min-w-0 py-4'>
      <DiscussionComposer
        chooseAudience={group.visibility === 'public'}
        locked={locked}
        onPosted={load}
        scope={{ kind: 'group', slug }}
      />
      {error ? (
        <p className='mt-4 font-inter text-sm text-alert-red' role='alert'>
          {error}
        </p>
      ) : posts === null ? null : (
        <DiscussionFeed posts={posts} />
      )}
    </div>
  );
}
