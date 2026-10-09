'use client';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DiscussionLoginPrompt } from '@/components/discussions/DiscussionLoginPrompt';
import { MentionTextArea } from '@/components/discussions/MentionTextArea';
import Icon from '@/components/icon';
import useAuth from '@/hooks/auth/useAuth';
import { discussionTextError } from '@/services/discussions/discussionText';
import {
  discussionError,
  replyToDiscussion,
} from '@/services/discussions/discussionsApi';
import { Button } from '@the-monkeys/ui/atoms/button';

export function ReplyForm({
  id,
  parentId,
  onDone,
}: {
  id: string;
  parentId?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const session = useAuth().data as { username?: string } | null | undefined;
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!session?.username) {
    return <DiscussionLoginPrompt action='to reply.' />;
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
      await replyToDiscussion(id, body.trim(), parentId ?? '');
      setBody('');
      router.refresh();
      onDone?.();
    } catch (err) {
      setError(discussionError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className='space-y-2' onSubmit={onSubmit}>
      <MentionTextArea
        aria-label='Reply'
        autoFocus={Boolean(onDone)}
        className='min-h-20'
        maxLength={2000}
        onValueChange={setBody}
        placeholder='Write a reply'
        value={body}
      />
      {error ? (
        <p className='font-inter text-sm text-alert-red' role='alert'>
          {error}
        </p>
      ) : null}
      <div className='flex items-center gap-2'>
        <Button disabled={busy} size='sm' type='submit' variant='brand'>
          Reply
        </Button>
        {onDone ? (
          <Button onClick={onDone} size='sm' type='button' variant='ghost'>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function ReplyToggle({
  id,
  parentId,
}: {
  id: string;
  parentId: string;
}) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className='mt-3'>
        <ReplyForm id={id} onDone={() => setOpen(false)} parentId={parentId} />
      </div>
    );
  }
  return (
    <button
      className='mt-1 inline-flex items-center gap-1 font-inter text-xs text-gray-500 hover:text-brand-orange'
      onClick={() => setOpen(true)}
      type='button'
    >
      <Icon name='RiChat1' size={14} />
      Reply
    </button>
  );
}
