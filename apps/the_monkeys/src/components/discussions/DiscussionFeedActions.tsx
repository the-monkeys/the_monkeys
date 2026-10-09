'use client';

import { useState } from 'react';

import { usePathname } from 'next/navigation';

import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import Icon from '@/components/icon';
import { LIVE_URL } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';
import { discussionPath } from '@/lib/discussionSeo';
import { formatCount } from '@/lib/utils';
import {
  discussionError,
  likeDiscussion,
} from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export function DiscussionFeedActions({ post }: { post: Discussion }) {
  const pathname = usePathname();
  const session = useAuth().data as { username?: string } | null | undefined;
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likes, setLikes] = useState(post.like_count ?? 0);
  const [busy, setBusy] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const shareUrl = `${LIVE_URL ?? ''}${discussionPath(post.public_id)}`;

  async function onLike() {
    if (!session?.username) {
      setAuthOpen(true);
      return;
    }
    if (busy) return;
    const before = likes;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes(Math.max(0, before + (wasLiked ? -1 : 1)));
    setBusy(true);
    try {
      const res = await likeDiscussion(post.public_id);
      setLiked(res.liked);
      setLikes(Math.max(0, before + (res.liked ? 1 : -1)));
    } catch (err) {
      setLiked(wasLiked);
      setLikes(before);
      toast({
        variant: 'error',
        title: 'Error',
        description: discussionError(err),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className='mt-2 flex items-center justify-end gap-2 text-gray-400 dark:text-gray-500'>
      <div className='flex items-center transition-colors hover:text-brand-orange'>
        <button
          aria-label={liked ? 'Unlike discussion' : 'Like discussion'}
          aria-pressed={liked}
          className='flex cursor-pointer items-center justify-center p-1 disabled:cursor-default disabled:opacity-80'
          disabled={busy}
          onClick={onLike}
          title={liked ? 'Unlike discussion' : 'Like discussion'}
          type='button'
        >
          <Icon
            className={liked ? 'text-brand-orange' : ''}
            name='RiHeart3'
            size={16}
            type={liked ? 'Fill' : undefined}
          />
        </button>
        <span
          aria-label={`${likes} ${likes === 1 ? 'like' : 'likes'}`}
          className='min-w-4 text-center font-dm_sans text-sm tabular-nums'
        >
          {formatCount(likes)}
        </span>
      </div>
      <div className='transition-colors hover:text-brand-orange'>
        <BlogShareDialog
          blogURL={shareUrl}
          copiedDescription='The link to this discussion has been copied.'
          copiedTitle='Discussion link copied'
          dialogTitle='Share discussion'
          size={16}
          triggerTitle='Share discussion'
        />
      </div>
      <AuthPromptDialog
        callbackPath={pathname}
        description='Join Monkeys now to let the author know you like their discussion.'
        iconName='RiHeart3'
        onOpenChange={setAuthOpen}
        open={authOpen}
        title='Like a discussion to share the love.'
      />
    </div>
  );
}
