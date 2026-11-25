'use client';

import { useContext, useEffect, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { ContentLabelToggle } from '@/components/moderation/ContentLabelToggle';
import { canSnapshotDiscussion } from '@/features/snapshot/adapters/fromDiscussion';
import { copyDiscussionSnap } from '@/features/snapshot/lib/discussionClipboard';
import useAuth from '@/hooks/auth/useAuth';
import { discussionPath } from '@/lib/discussionSeo';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { isSensitive } from '@/services/moderation/moderationTypes';
import { QueryClientContext } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

import { DiscussionReportDialog } from './DiscussionReportDialog';

function DiscussionCardMenuContent({
  post,
  canLabel = false,
}: {
  post: Discussion;
  canLabel?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [fallback, setFallback] = useState<Blob>();
  const [previewUrl, setPreviewUrl] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [labelOpen, setLabelOpen] = useState(false);
  const available =
    !isSensitive(post) &&
    !post.content_unavailable &&
    canSnapshotDiscussion(post);
  const path = discussionPath(post.public_id);
  const studioPath = `/snapshot/discussion/${encodeURIComponent(post.public_id)}`;

  useEffect(() => {
    if (!fallback) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(fallback);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [fallback]);

  async function copySnap() {
    if (busy || !available) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await copyDiscussionSnap(`${path}/image?variant=snapshot`);
      if (result.copied) {
        setMessage('Discussion image copied.');
        toast({
          title: 'Snap copied',
          description: 'Paste the image into your chat or social post.',
        });
      } else {
        setFallback(result.blob);
      }
    } catch {
      setMessage('The discussion image could not be loaded.');
      toast({
        variant: 'error',
        title: 'Unable to copy snap',
        description: 'Please try again or open Studio.',
      });
    } finally {
      setBusy(false);
    }
  }

  const file = fallback
    ? new File([fallback], `discussion-${post.public_id}.png`, {
        type: 'image/png',
      })
    : undefined;
  const canShare =
    typeof navigator !== 'undefined' &&
    file &&
    navigator.canShare?.({ files: [file] });

  return (
    <div className='relative z-10 shrink-0'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type='button'
            aria-label='Discussion options'
            disabled={busy}
            className='inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-500 hover:bg-brand-orange/5 hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange disabled:opacity-50'
          >
            <Icon
              name={busy ? 'RiLoader5' : 'RiMore'}
              size={20}
              className={busy ? 'animate-spin' : ''}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          sideOffset={8}
          className='mr-1 w-72 max-w-[calc(100vw_-_1.5rem)] rounded-2xl p-2'
        >
          <DropdownMenuItem
            disabled={!available || busy}
            onSelect={() => {
              void copySnap();
            }}
            className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3 font-dm_sans text-sm sm:text-base'
          >
            <Icon name='RiClipboard' size={18} className='shrink-0' />
            <span className='flex-1 text-left'>Copy snap</span>
          </DropdownMenuItem>
          {available ? (
            <DropdownMenuItem asChild>
              <Link
                href={studioPath}
                className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3 font-dm_sans text-sm sm:text-base'
              >
                <Icon name='RiPencil' size={18} className='shrink-0' />
                <span className='flex-1'>Open Studio</span>
                <Icon
                  name='RiArrowRightS'
                  size={16}
                  className='shrink-0 opacity-50'
                />
              </Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setReportOpen(true)}
            className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3 font-dm_sans text-sm sm:text-base'
          >
            <Icon name='RiErrorWarning' size={18} className='shrink-0' />
            <span className='flex-1 text-left'>Report</span>
            <Icon
              name='RiArrowRightS'
              size={16}
              className='shrink-0 opacity-50'
            />
          </DropdownMenuItem>
          {canLabel ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setLabelOpen(true)}
                className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3 font-dm_sans text-sm sm:text-base'
              >
                <Icon name='RiErrorWarning' size={18} className='shrink-0' />
                <span>Content rating</span>
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {message ? (
        <p className='sr-only' role='status'>
          {message}
        </p>
      ) : null}
      <Dialog
        open={Boolean(fallback)}
        onOpenChange={(open) => {
          if (!open) setFallback(undefined);
        }}
      >
        <DialogContent className='max-h-[85vh] w-[calc(100vw_-_2rem)] max-w-md overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Discussion snap</DialogTitle>
            <DialogDescription>
              Image copying is unavailable in this browser. Download the image
              to share it, or open Studio to customize it.
            </DialogDescription>
          </DialogHeader>
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt='Discussion snap preview'
              className='h-auto w-full rounded-xl'
            />
          ) : null}
          <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
            <Button asChild disabled={!previewUrl}>
              <a
                href={previewUrl || undefined}
                download={`discussion-${post.public_id}.png`}
              >
                Download image
              </a>
            </Button>
            {canShare && file ? (
              <Button
                variant='outline'
                onClick={() =>
                  navigator
                    .share({ files: [file], title: 'Monkeys discussion' })
                    .catch(() => {})
                }
              >
                Share image
              </Button>
            ) : null}
            <Button asChild variant='outline'>
              <Link href={studioPath}>Open Studio</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={labelOpen} onOpenChange={setLabelOpen}>
        <DialogContent className='w-[calc(100vw_-_2rem)] max-w-lg rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Content rating</DialogTitle>
            <DialogDescription>
              Set the rating for content you own.
            </DialogDescription>
          </DialogHeader>
          {labelOpen && canLabel ? (
            <ContentLabelToggle
              target={{ kind: 'discussion', id: post.public_id }}
              initialMarked={isSensitive(post)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
      <DiscussionReportDialog
        target={{ kind: 'discussion', id: post.public_id }}
        open={reportOpen}
        onOpenChange={setReportOpen}
      />
    </div>
  );
}

export function DiscussionCardMenu({ post }: { post: Discussion }) {
  const client = useContext(QueryClientContext);
  return client ? (
    <ViewerDiscussionCardMenu post={post} />
  ) : (
    <DiscussionCardMenuContent key={menuContentKey(post)} post={post} />
  );
}

function ViewerDiscussionCardMenu({ post }: { post: Discussion }) {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || 'anonymous';
  const author =
    !!session?.username &&
    session.username === post.author_username &&
    !post.author_gone;
  return (
    <DiscussionCardMenuContent
      key={`${viewer}:${menuContentKey(post)}`}
      post={post}
      canLabel={author}
    />
  );
}

function menuContentKey(post: Discussion) {
  return `${post.public_id}:${isSensitive(post)}:${!!post.content_unavailable}:${post.content_rating?.revision ?? 0}`;
}
