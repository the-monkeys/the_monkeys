'use client';

import { useCallback, useEffect, useState } from 'react';

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
  const [posts, setPosts] = useState<Discussion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const slug = group.slug;

  const load = useCallback(async () => {
    try {
      const page = await listDiscussions({ kind: 'group', slug });
      setPosts(Array.isArray(page?.discussions) ? page.discussions : []);
      setError(null);
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err.response?.status === 404
          ? 'This group is not available.'
          : 'Could not load discussions.'
      );
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  const locked = !session
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
