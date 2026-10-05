'use client';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { discussionTextError } from '@/services/discussions/discussionText';
import {
  createDiscussion,
  discussionError,
} from '@/services/discussions/discussionsApi';
import type { DiscussionScope } from '@/services/discussions/discussionsTypes';

export function DiscussionComposer({
  scope,
  lockedMessage,
}: {
  scope: DiscussionScope;
  lockedMessage: string | null;
}) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (lockedMessage) {
    return (
      <p className='font-inter text-base leading-relaxed'>{lockedMessage}</p>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const invalid = discussionTextError(body);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await createDiscussion(scope, body.trim());
      setBody('');
      router.refresh();
    } catch (err) {
      setError(discussionError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className='flex min-w-0 flex-col gap-2' onSubmit={onSubmit}>
      <textarea
        aria-label='Discussion'
        className='font-inter w-full rounded border p-2 text-base'
        maxLength={2000}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        value={body}
      />
      {error ? (
        <p className='font-inter text-base' role='alert'>
          {error}
        </p>
      ) : null}
      <button
        className='min-h-11 self-start rounded border px-4'
        disabled={busy}
        type='submit'
      >
        Post discussion
      </button>
    </form>
  );
}
