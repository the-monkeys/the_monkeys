'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { notifyContentRating } from '@/lib/contentRatingEvents';
import { setNSFWLabel } from '@/services/moderation/moderationApi';
import type { ContentTarget } from '@/services/moderation/moderationTypes';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export function ContentLabelToggle({
  target,
  initialMarked = false,
  onChange,
  onDirtyChange,
  onPendingChange,
}: {
  target: ContentTarget;
  initialMarked?: boolean;
  onChange?: (marked: boolean) => void;
  onDirtyChange?: (dirty: boolean) => void;
  onPendingChange?: (busy: boolean) => void;
}) {
  const [marked, setMarked] = useState(initialMarked);
  const [confirmed, setConfirmed] = useState(initialMarked);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const id = useId();
  const client = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    setMarked(initialMarked);
    setConfirmed(initialMarked);
    onDirtyChange?.(false);
  }, [initialMarked, onDirtyChange]);
  async function save() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    onPendingChange?.(true);
    setError('');
    try {
      const result = await setNSFWLabel(target, marked);
      notifyContentRating(target, result.access);
      const restricted = result.access?.is_nsfw === true;
      toast({
        title: 'Content rating updated',
        description:
          !marked && restricted
            ? 'Your label was removed. A moderation or media restriction still applies.'
            : restricted
              ? 'This content is now marked NSFW.'
              : 'Your NSFW label was removed.',
      });
      setMarked(restricted);
      setConfirmed(restricted);
      onDirtyChange?.(false);
      onChange?.(restricted);
      await client.invalidateQueries();
      router.refresh();
    } catch {
      setError('Unable to update this rating. Please try again.');
    } finally {
      lock.current = false;
      setBusy(false);
      onPendingChange?.(false);
    }
  }
  return (
    <div className='min-w-0 space-y-3'>
      <label
        htmlFor={id}
        className='flex cursor-pointer items-start gap-3 text-sm'
      >
        <input
          id={id}
          type='checkbox'
          checked={marked}
          disabled={busy}
          onChange={(e) => {
            setMarked(e.target.checked);
            onDirtyChange?.(e.target.checked !== confirmed);
          }}
          className='mt-1 shrink-0 accent-[#ff5145]'
        />
        <span>Mark as NSFW / explicit content</span>
      </label>
      <p className='text-xs leading-5 text-gray-500'>
        Restricted content requires login and a profile birthday showing age 18
        or older. Removing your label does not remove a moderator?s restriction.
      </p>
      {error ? (
        <p role='alert' className='text-sm text-red-600'>
          {error}
        </p>
      ) : null}
      <Button
        type='button'
        size='sm'
        disabled={busy}
        onClick={() => void save()}
      >
        {busy ? 'Saving...' : 'Save rating'}
      </Button>
    </div>
  );
}
