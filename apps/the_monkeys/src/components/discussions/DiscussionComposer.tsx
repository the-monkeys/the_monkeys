'use client';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DiscussionLoginPrompt } from '@/components/discussions/DiscussionLoginPrompt';
import { MentionTextArea } from '@/components/discussions/MentionTextArea';
import { cn } from '@/lib/utils';
import {
  DISCUSSION_MAX_RUNES,
  discussionRuneCount,
  discussionTextError,
} from '@/services/discussions/discussionText';
import {
  createDiscussion,
  discussionError,
} from '@/services/discussions/discussionsApi';
import type {
  DiscussionAudience,
  DiscussionScope,
} from '@/services/discussions/discussionsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

export type DiscussionLock = 'login' | 'join' | null;

export function DiscussionComposer({
  scope,
  locked,
  chooseAudience = false,
  onPosted,
}: {
  scope: DiscussionScope;
  locked: DiscussionLock;
  chooseAudience?: boolean;
  onPosted?: () => void;
}) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<DiscussionAudience>('group_only');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (locked === 'login') {
    return <DiscussionLoginPrompt action='to post a discussion.' />;
  }
  if (locked === 'join') {
    return (
      <p className='font-inter text-sm text-gray-500'>
        Join the group to post a discussion.
      </p>
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
      await createDiscussion(
        scope,
        body.trim(),
        scope.kind === 'group' ? audience : undefined
      );
      setBody('');
      router.refresh();
      onPosted?.();
    } catch (err) {
      setError(discussionError(err));
    } finally {
      setBusy(false);
    }
  }

  const count = discussionRuneCount(body);

  const audienceOption = (value: DiscussionAudience, label: string) => {
    const selected = audience === value;
    return (
      <label
        className={cn(
          'inline-flex min-h-8 cursor-pointer items-center rounded-full px-3 font-inter text-xs font-medium',
          selected
            ? 'bg-brand-orange text-white'
            : 'text-gray-600 hover:bg-foreground-light/60 dark:text-gray-300 dark:hover:bg-foreground-dark/60'
        )}
      >
        <input
          checked={selected}
          className='sr-only'
          name='discussion-audience'
          onChange={() => setAudience(value)}
          type='radio'
          value={value}
        />
        {label}
      </label>
    );
  };

  return (
    <form
      className='overflow-hidden rounded-xl border border-border-light bg-background-light dark:border-border-dark dark:bg-background-dark'
      onSubmit={onSubmit}
    >
      <MentionTextArea
        aria-label='Discussion'
        className='min-h-[88px] border-0 bg-transparent px-4 py-3 text-[15px] focus-visible:border-transparent'
        maxLength={2000}
        onValueChange={setBody}
        placeholder='Start a discussion'
        value={body}
      />
      {error ? (
        <p className='px-4 pb-2 font-inter text-sm text-alert-red' role='alert'>
          {error}
        </p>
      ) : null}
      <div className='flex flex-wrap items-center justify-between gap-2 border-t border-border-light px-3 py-2 dark:border-border-dark'>
        <div className='flex min-w-0 flex-wrap items-center gap-2'>
          {chooseAudience ? (
            <fieldset className='inline-flex rounded-full border border-border-light p-0.5 dark:border-border-dark'>
              <legend className='sr-only'>Who can read this</legend>
              {audienceOption('public', 'Public')}
              {audienceOption('group_only', 'Members only')}
            </fieldset>
          ) : null}
          <span
            className={`font-inter text-xs tabular-nums ${
              count > DISCUSSION_MAX_RUNES ? 'text-alert-red' : 'text-gray-500'
            }`}
          >
            {count}/{DISCUSSION_MAX_RUNES}
          </span>
        </div>
        <Button disabled={busy} size='sm' type='submit' variant='brand'>
          Post discussion
        </Button>
      </div>
    </form>
  );
}
