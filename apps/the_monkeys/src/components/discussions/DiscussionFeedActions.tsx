'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import {
  discussionActionClass,
  discussionCountLabel,
} from '@/components/discussions/discussionChrome';
import Icon from '@/components/icon';
import { LIVE_URL } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';
import { discussionPath } from '@/lib/discussionSeo';
import { cn, formatCount } from '@/lib/utils';
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
    <div className='-ml-2 mt-3 flex flex-wrap items-center gap-x-1 gap-y-0.5'>
      <button
        aria-label={liked ? 'Unlike discussion' : 'Like discussion'}
        aria-pressed={liked}
        className={cn(
          discussionActionClass,
          liked && 'text-brand-orange dark:text-brand-orange'
        )}
        disabled={busy}
        onClick={onLike}
        title={liked ? 'Unlike discussion' : 'Like discussion'}
        type='button'
      >
        <Icon
          className={liked ? 'text-brand-orange' : ''}
          name='RiHeart3'
          size={20}
          type={liked ? 'Fill' : undefined}
        />
        <span>Like</span>
        <span
          aria-label={`${likes} ${likes === 1 ? 'like' : 'likes'}`}
          className='min-w-4 text-center font-dm_sans text-sm tabular-nums'
        >
          {formatCount(likes)}
        </span>
      </button>
      <Link
        aria-label={`Reply, ${discussionCountLabel(post.reply_count ?? 0, 'reply', 'replies')}`}
        className={discussionActionClass}
        href={`${discussionPath(post.public_id)}#replies`}
      >
        <Icon name='RiChat1' size={20} />
        <span>Reply</span>
        {(post.reply_count ?? 0) > 0 ? (
          <span className='tabular-nums'>
            {formatCount(post.reply_count ?? 0)}
          </span>
        ) : null}
      </Link>
      <BlogShareDialog
        blogURL={shareUrl}
        copiedDescription='The link to this discussion has been copied.'
        copiedTitle='Discussion link copied'
        dialogTitle='Share discussion'
        size={20}
        triggerClassName={discussionActionClass}
        triggerLabel='Share'
        triggerTitle='Share discussion'
      />
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
