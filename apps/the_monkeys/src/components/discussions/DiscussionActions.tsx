'use client';

import { FormEvent, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { MentionTextArea } from '@/components/discussions/MentionTextArea';
import { discussionCountLabel } from '@/components/discussions/discussionChrome';
import Icon from '@/components/icon';
import useAuth from '@/hooks/auth/useAuth';
import { loginHref } from '@/lib/authRedirect';
import { discussionInstantMs } from '@/lib/discussionTime';
import { cn } from '@/lib/utils';
import { discussionTextError } from '@/services/discussions/discussionText';
import {
  deleteDiscussion,
  discussionError,
  editDiscussion,
  likeDiscussion,
} from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

const iconButtonClass =
  'inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 font-inter text-sm text-gray-500 transition-colors hover:text-brand-orange disabled:opacity-50';

export function DiscussionActions({ post }: { post: Discussion }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAuth().data as { username?: string } | null | undefined;
  const username = session?.username;
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likes, setLikes] = useState(post.like_count ?? 0);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(post.body);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isAuthor = Boolean(username) && username === post.author_username;
  const editUntil = discussionInstantMs(post.edited_until);
  const canEdit =
    isAuthor && !Number.isNaN(editUntil) && editUntil > Date.now();
  const replies = post.reply_count ?? 0;

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await action();
    } catch (err) {
      setError(discussionError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onLike() {
    if (!username) {
      router.push(loginHref(pathname));
      return;
    }
    if (busy) return;
    const before = likes;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes(before + (wasLiked ? -1 : 1));
    setBusy(true);
    setError(null);
    try {
      // The server toggles, so its answer wins if our liked flag was stale.
      const res = await likeDiscussion(post.public_id);
      setLiked(res.liked);
      setLikes(Math.max(0, before + (res.liked ? 1 : -1)));
    } catch (err) {
      setLiked(wasLiked);
      setLikes(before);
      setError(discussionError(err));
    } finally {
      setBusy(false);
    }
  }

  const onDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    return run(async () => {
      await deleteDiscussion(post.public_id);
      router.refresh();
    });
  };

  async function onSave(e: FormEvent) {
    e.preventDefault();
    const invalid = discussionTextError(body);
    if (invalid) {
      setError(invalid);
      return;
    }
    await run(async () => {
      await editDiscussion(post.public_id, body.trim());
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <div className='mt-3 space-y-3'>
      <div className='-ml-1 flex flex-wrap items-center gap-1'>
        <button
          aria-label={`Like, ${discussionCountLabel(likes, 'like', 'likes')}`}
          aria-pressed={liked}
          className={cn(
            'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-4 font-inter text-sm transition-colors disabled:opacity-70',
            liked
              ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
              : 'border-border-light text-gray-600 hover:border-brand-orange hover:text-brand-orange dark:border-border-dark/40 dark:text-gray-400'
          )}
          disabled={busy}
          onClick={onLike}
          type='button'
        >
          <Icon name='RiThumbUp' size={16} type={liked ? 'Fill' : 'Line'} />
          <span className='font-medium'>Like</span>
          {likes > 0 ? <span className='tabular-nums'>{likes}</span> : null}
        </button>
        <span
          aria-label={discussionCountLabel(replies, 'reply', 'replies')}
          className='inline-flex min-h-9 items-center gap-1.5 px-3 font-inter text-sm text-gray-500'
        >
          <Icon name='RiChat1' size={16} />
          <span aria-hidden className='tabular-nums'>
            {replies}
          </span>
        </span>
        {canEdit && !editing ? (
          <button
            aria-label='Edit'
            className={iconButtonClass}
            onClick={() => setEditing(true)}
            title='Edit'
            type='button'
          >
            <Icon name='RiEdit2' size={16} />
          </button>
        ) : null}
        {isAuthor ? (
          confirmingDelete ? (
            <button
              className={cn(
                iconButtonClass,
                'text-alert-red hover:text-alert-red'
              )}
              disabled={busy}
              onClick={onDelete}
              type='button'
            >
              Confirm delete
            </button>
          ) : (
            <button
              aria-label='Delete'
              className={cn(iconButtonClass, 'hover:text-alert-red')}
              onClick={onDelete}
              title='Delete'
              type='button'
            >
              <Icon name='RiDeleteBin6' size={16} />
            </button>
          )
        ) : null}
      </div>
      {editing ? (
        <form className='space-y-2' onSubmit={onSave}>
          <MentionTextArea
            aria-label='Edit discussion'
            autoFocus
            maxLength={2000}
            onValueChange={setBody}
            value={body}
          />
          <div className='flex items-center gap-2'>
            <Button disabled={busy} size='sm' type='submit' variant='brand'>
              Save
            </Button>
            <Button
              onClick={() => setEditing(false)}
              size='sm'
              type='button'
              variant='ghost'
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
      {error ? (
        <p className='font-inter text-sm text-alert-red' role='alert'>
          {error}
        </p>
      ) : null}
    </div>
  );
}
