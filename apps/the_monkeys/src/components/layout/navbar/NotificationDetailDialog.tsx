'use client';

import { ReactNode } from 'react';

import Link from 'next/link';

import {
  notificationCopy,
  notificationHref,
  profileHref,
} from '@/lib/notificationPresentation';
import { FRNNotification } from '@/services/notification/notificationTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';

type Props = {
  notification: FRNNotification | null;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
};

// FRN can return templates or already-rendered messages. Link only whole actor
// handles in the resolved text, never a name embedded inside another word.
function messageWithActor(
  body: string,
  actor: string | undefined,
  onNavigate: () => void
): ReactNode {
  const username = actor?.replace(/^@/, '');
  if (!username) return body;
  const escaped = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `(^|[^\\p{L}\\p{N}_@])@?${escaped}(?=$|[^\\p{L}\\p{N}_])`,
    'gu'
  );
  const parts: ReactNode[] = [];
  let end = 0;
  for (const match of Array.from(body.matchAll(pattern))) {
    const start = match.index! + match[1].length;
    parts.push(body.slice(end, start));
    parts.push(
      <Link
        key={start}
        href={profileHref(encodeURIComponent(username))!}
        onClick={onNavigate}
        className='rounded-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange'
      >
        @{username}
      </Link>
    );
    end = match.index! + match[0].length;
  }
  parts.push(body.slice(end));
  return parts;
}

/** Read the existing authenticated payload, without another request or raw data. */
export function NotificationDetailDialog({
  notification,
  onOpenChange,
  onCloseAutoFocus,
}: Props) {
  const copy = notification ? notificationCopy(notification) : null;
  const href = notification ? notificationHref(notification) : undefined;
  const date = notification ? new Date(notification.created_at) : null;
  const validDate = date && Number.isFinite(date.getTime()) ? date : null;
  const data = notification?.content?.data;
  const actionLabel = data?.event_slug
    ? 'View event'
    : data?.group_slug
      ? 'View group'
      : data?.blog_id
        ? 'View post'
        : copy?.actor
          ? 'View profile'
          : 'View settings';

  return (
    <Dialog open={!!notification} onOpenChange={onOpenChange}>
      {copy && (
        <DialogContent
          className='max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl [overflow-wrap:anywhere] [&>button]:top-2 [&>button]:min-h-11 [&>button]:min-w-11'
          onCloseAutoFocus={onCloseAutoFocus}
        >
          <DialogHeader className='min-w-0 pr-10 text-left'>
            <DialogTitle className='leading-snug'>
              {copy.actor ? 'Notification' : copy.fallbackTitle}
            </DialogTitle>
            <DialogDescription className='sr-only'>
              Full notification message and related activity.
            </DialogDescription>
          </DialogHeader>
          <div className='min-w-0 space-y-2'>
            <p className='whitespace-pre-wrap font-inter text-sm leading-6'>
              {messageWithActor(
                copy.fallbackBody ||
                  (notification?.content?.title
                    ? copy.fallbackTitle
                    : 'No additional details are available.'),
                copy.actor,
                () => onOpenChange(false)
              )}
            </p>
            {validDate && (
              <time
                dateTime={validDate.toISOString()}
                className='font-inter text-xs text-gray-500 dark:text-gray-400'
              >
                {validDate.toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </time>
            )}
          </div>
          {href && (
            <DialogFooter>
              <Button asChild variant='brand' className='min-h-11'>
                <Link href={href} onClick={() => onOpenChange(false)}>
                  {actionLabel}
                </Link>
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
