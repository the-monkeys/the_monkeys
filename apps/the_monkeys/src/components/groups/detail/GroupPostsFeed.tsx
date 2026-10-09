'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
import { DiscussionFeedActions } from '@/components/discussions/DiscussionFeedActions';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { useGroupBlogs } from '@/hooks/groups/useGroupQueries';
import { groupFeedEmptyCopy, isActiveGroupMember } from '@/lib/groupPerms';
import { mergeGroupFeedItems } from '@/lib/mergeGroupFeedItems';
import { listDiscussions } from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';
import { fromBlog } from '@/utils/blogCardAdapters';
import { Button } from '@the-monkeys/ui/atoms/button';
import axios from 'axios';

export function GroupPostsFeed({
  group,
  focusComposerToken = 0,
}: {
  group: GroupItem;
  focusComposerToken?: number;
}) {
  const { data: session } = useAuth();
  const blogsQuery = useGroupBlogs(group.slug);
  const [discussions, setDiscussions] = useState<Discussion[] | null>(null);
  const [discussionError, setDiscussionError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);
  const slug = group.slug;

  const loadDiscussions = useCallback(async () => {
    try {
      const page = await listDiscussions({ kind: 'group', slug });
      setDiscussions(Array.isArray(page?.discussions) ? page.discussions : []);
      setDiscussionError(null);
    } catch (err) {
      setDiscussionError(
        axios.isAxiosError(err) && err.response?.status === 404
          ? 'This group is not available.'
          : 'Could not load discussions.'
      );
    }
  }, [slug]);

  useEffect(() => {
    void loadDiscussions();
  }, [loadDiscussions]);

  useEffect(() => {
    if (!focusComposerToken) return;
    setComposerOpen(true);
  }, [focusComposerToken]);

  useEffect(() => {
    if (!composerOpen) return;
    const node = composerRef.current;
    node?.scrollIntoView({ block: 'center' });
    const field = node?.querySelector('textarea');
    if (field instanceof HTMLTextAreaElement) field.focus();
  }, [composerOpen, focusComposerToken]);

  const blogs =
    blogsQuery.data?.pages.flatMap((page) => page.blogs ?? []) ?? [];
  const items = mergeGroupFeedItems(blogs, discussions ?? []);
  const discussionsLoading = discussions === null && !discussionError;
  const loading = blogsQuery.isLoading || discussionsLoading;
  const locked = !session
    ? 'login'
    : !isActiveGroupMember(group)
      ? 'join'
      : null;

  return (
    <div className='min-w-0 py-4'>
      {locked ? (
        <DiscussionComposer
          chooseAudience={group.visibility === 'public'}
          locked={locked}
          scope={{ kind: 'group', slug }}
        />
      ) : composerOpen ? (
        <div ref={composerRef} className='space-y-2'>
          <div className='flex justify-end'>
            <button
              className='font-inter text-sm text-gray-500 hover:text-brand-orange'
              onClick={() => setComposerOpen(false)}
              type='button'
            >
              Cancel
            </button>
          </div>
          <DiscussionComposer
            chooseAudience={group.visibility === 'public'}
            locked={null}
            onPosted={() => {
              setComposerOpen(false);
              void loadDiscussions();
            }}
            scope={{ kind: 'group', slug }}
          />
        </div>
      ) : (
        <button
          className='flex w-full items-center gap-3 rounded-xl border border-border-light bg-background-light px-4 py-3 text-left font-inter text-sm text-gray-500 transition-colors hover:border-brand-orange/40 dark:border-border-dark dark:bg-background-dark'
          onClick={() => setComposerOpen(true)}
          type='button'
        >
          <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <Icon name='RiChat1' size={18} />
          </span>
          Start a discussion
        </button>
      )}

      {discussionError ? (
        <p className='mt-4 font-inter text-sm text-alert-red' role='alert'>
          {discussionError}
        </p>
      ) : null}
      {blogsQuery.isError ? (
        <p className='mt-4 font-inter text-sm text-alert-red' role='alert'>
          Posts are unavailable right now. Please try again shortly.
        </p>
      ) : null}

      {loading ? (
        <div className='flex justify-center py-12' aria-label='Loading posts'>
          <Loader size={28} />
        </div>
      ) : items.length === 0 ? (
        <div className='mt-4 rounded-xl border border-dashed border-border-light px-4 py-10 text-center dark:border-border-dark'>
          <p className='font-inter text-sm text-gray-500'>
            {groupFeedEmptyCopy({
              kind: 'posts',
              member: isActiveGroupMember(group),
              signedIn: !!session,
            })}
          </p>
        </div>
      ) : (
        <ul className='mt-2 min-w-0 divide-y divide-border-light dark:divide-border-dark'>
          {items.map((item) => (
            <li className='min-w-0 py-4' key={`${item.kind}:${item.id}`}>
              {item.kind === 'blog' ? (
                <FeedBlogCard blog={fromBlog(item.blog)} variant='compact' />
              ) : (
                <DiscussionCard
                  embedded
                  footer={<DiscussionFeedActions post={item.discussion} />}
                  linked
                  post={item.discussion}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {blogsQuery.hasNextPage ? (
        <div className='flex justify-center pt-2'>
          <Button
            className='min-h-11 w-full sm:w-auto sm:min-w-40'
            disabled={blogsQuery.isFetchingNextPage}
            onClick={() => blogsQuery.fetchNextPage()}
            type='button'
            variant='outline'
          >
            {blogsQuery.isFetchingNextPage
              ? 'Loading posts...'
              : 'Load more posts'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
