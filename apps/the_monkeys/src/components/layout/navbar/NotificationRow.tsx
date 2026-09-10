'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { useNotificationPost } from '@/hooks/notification/useNotificationPost';
import {
  actorUsername,
  isUnreadStatus,
  notificationCopy,
  notificationHref,
  notificationIcon,
  profileHref,
  timeAgo,
  truncateText,
} from '@/lib/notificationPresentation';
import { FRNNotification } from '@/services/notification/notificationTypes';
import { twMerge } from 'tailwind-merge';

type Props = {
  notif: FRNNotification;
  onNavigate?: () => void;
};

export function NotificationRow({ notif, onNavigate }: Props) {
  const unread = isUnreadStatus(notif.status);
  const actor = actorUsername(notif.content?.data);
  const copy = notificationCopy(notif);
  const href = notificationHref(notif);
  const icon = notificationIcon(notif);
  const userHref = profileHref(copy.actor);
  const post = useNotificationPost(notif.content?.data);
  const quotedRaw = post.title || copy.eventTitle || copy.groupName;
  const quotedHref = post.href || copy.eventHref || copy.groupHref;
  const quotedTitle = quotedRaw ? `"${truncateText(quotedRaw)}"` : undefined;

  const showComposed = !!(copy.actor && copy.rest);
  const showFallbackBody =
    !showComposed &&
    !quotedTitle &&
    !!copy.fallbackBody &&
    copy.fallbackBody !== copy.fallbackTitle;

  const inner = (
    <div className='flex min-w-0 items-start gap-3'>
      {unread ? (
        <span
          aria-hidden
          className='mt-3 size-2 shrink-0 rounded-full bg-brand-orange'
        />
      ) : (
        <span aria-hidden className='mt-3 size-2 shrink-0' />
      )}

      {actor ? (
        <ProfileFrame className='mt-0.5 size-10 shrink-0'>
          <ProfileImage username={actor} />
        </ProfileFrame>
      ) : (
        <span className='mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground-light/40 dark:bg-foreground-dark/40'>
          <Icon name={icon} size={18} className='text-gray-500' />
        </span>
      )}

      <div className='min-w-0 flex-1'>
        <p className='break-words font-dm_sans text-sm font-medium leading-5'>
          {showComposed && userHref ? (
            <>
              <Link
                href={userHref}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.();
                }}
                className='hover:underline'
              >
                @{copy.actor}
              </Link>
              {copy.rest}
            </>
          ) : (
            copy.fallbackTitle
          )}
        </p>
        {quotedTitle && quotedHref ? (
          <Link
            href={quotedHref}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.();
            }}
            className='mt-0.5 block truncate font-inter text-sm leading-5 text-gray-500 hover:underline dark:text-gray-400'
          >
            {quotedTitle}
          </Link>
        ) : quotedTitle ? (
          <p className='mt-0.5 truncate font-inter text-sm leading-5 text-gray-500 dark:text-gray-400'>
            {quotedTitle}
          </p>
        ) : showFallbackBody ? (
          <p className='mt-0.5 line-clamp-2 break-words font-inter text-sm leading-5 text-gray-500 dark:text-gray-400'>
            {copy.fallbackBody}
          </p>
        ) : null}
      </div>

      <div className='flex shrink-0 items-center gap-1 pt-0.5'>
        <span className='whitespace-nowrap font-inter text-xs text-gray-500'>
          {timeAgo(notif.created_at)}
        </span>
        {href ? (
          <Icon
            name='RiArrowRightS'
            size={16}
            className='hidden text-gray-400 sm:block'
          />
        ) : null}
      </div>
    </div>
  );

  const className = twMerge(
    'block min-w-0 rounded-xl px-2 py-2.5',
    href && 'hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
  );

  return <div className={className}>{inner}</div>;
}
