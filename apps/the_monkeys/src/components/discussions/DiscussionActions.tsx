'use client';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import useAuth from '@/hooks/auth/useAuth';
import { discussionTextError } from '@/services/discussions/discussionText';
import {
  deleteDiscussion,
  discussionError,
  editDiscussion,
  likeDiscussion,
} from '@/services/discussions/discussionsApi';
import type { Discussion } from '@/services/discussions/discussionsTypes';

export function DiscussionActions({ post }: { post: Discussion }) {
  const router = useRouter();
  const session = useAuth().data as { username?: string } | null | undefined;
  const username = session?.username;
  const [liked, setLiked] = useState(post.liked);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(post.body);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!username) return null;

  const isAuthor = username === post.author_username;
  const editUntil = post.edited_until ? Date.parse(post.edited_until) : NaN;
  const canEdit =
    isAuthor && !Number.isNaN(editUntil) && editUntil > Date.now();

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

  const onLike = () =>
    run(async () => {
      const res = await likeDiscussion(post.public_id);
      setLiked(res.liked);
      router.refresh();
    });

  const onDelete = () =>
    run(async () => {
      await deleteDiscussion(post.public_id);
      router.refresh();
    });

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
    <div className='flex min-w-0 flex-col gap-2'>
      <div className='flex flex-wrap gap-2'>
        <button
          aria-pressed={liked}
          className='min-h-11 rounded border px-4'
          disabled={busy}
          onClick={onLike}
          type='button'
        >
          {liked ? 'Liked' : 'Like'}
        </button>
        {canEdit && !editing ? (
          <button
            className='min-h-11 rounded border px-4'
            onClick={() => setEditing(true)}
            type='button'
          >
            Edit
          </button>
        ) : null}
        {isAuthor ? (
          <button
            className='min-h-11 rounded border px-4'
            disabled={busy}
            onClick={onDelete}
            type='button'
          >
            Delete
          </button>
        ) : null}
      </div>
      {editing ? (
        <form className='flex min-w-0 flex-col gap-2' onSubmit={onSave}>
          <textarea
            aria-label='Edit discussion'
            className='font-inter w-full rounded border p-2 text-base'
            maxLength={2000}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            value={body}
          />
          <div className='flex gap-2'>
            <button
              className='min-h-11 rounded border px-4'
              disabled={busy}
              type='submit'
            >
              Save
            </button>
            <button
              className='min-h-11 rounded border px-4'
              onClick={() => setEditing(false)}
              type='button'
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      {error ? (
        <p className='font-inter text-base' role='alert'>
          {error}
        </p>
      ) : null}
    </div>
  );
}
