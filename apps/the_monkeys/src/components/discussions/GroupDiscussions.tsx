'use client';

import { useCallback, useEffect, useState } from 'react';

import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
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

  const signedIn = Boolean(session);
  const member = isActiveGroupMember(group);
  const lockedMessage = !signedIn
    ? 'Log in to post a discussion.'
    : !member
      ? 'Join the group to post a discussion.'
      : null;

  return (
    <div className='flex min-w-0 flex-col gap-6 py-4'>
      <DiscussionComposer
        lockedMessage={lockedMessage}
        onPosted={load}
        scope={{ kind: 'group', slug }}
      />
      {error ? (
        <p className='font-inter text-base' role='alert'>
          {error}
        </p>
      ) : posts === null ? null : posts.length === 0 ? (
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
    </div>
  );
}
