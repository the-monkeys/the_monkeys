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
    <div className='flex min-w-0 items-start gap-2.5 sm:gap-3'>
      {unread ? <span className='sr-only'>Unread notification</span> : null}

      {unread ? (
        <span
          aria-hidden
          className='mt-2.5 size-2.5 shrink-0 rounded-full bg-brand-orange shadow-[0_0_0_3px_rgba(255,85,66,0.12)]'
        />
      ) : (
        <span aria-hidden className='mt-2.5 size-2.5 shrink-0' />
      )}

      {actor && userHref ? (
        <Link
          href={userHref}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.();
          }}
          className='mt-0.5 size-10 shrink-0 rounded-full outline-none ring-brand-orange/50 transition-shadow focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black'
        >
          <ProfileFrame className='size-full'>
            <ProfileImage username={actor} />
          </ProfileFrame>
        </Link>
      ) : (
        <span className='mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-border-light/70 bg-foreground-light/30 dark:border-border-dark/60 dark:bg-foreground-dark/30'>
          <Icon
            name={icon}
            size={18}
            className={unread ? 'text-brand-orange' : 'text-gray-500'}
          />
        </span>
      )}

      <div className='min-w-0 flex-1'>
        <p
          className={twMerge(
            'break-words font-dm_sans text-sm leading-5',
            unread ? 'font-semibold' : 'font-medium'
          )}
        >
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
        <span
          className={twMerge(
            'whitespace-nowrap font-inter text-[11px] leading-4 sm:text-xs',
            unread
              ? 'font-medium text-[#c93422] dark:text-brand-orange'
              : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {timeAgo(notif.created_at)}
        </span>
        {href ? (
          <Icon
            name='RiArrowRightS'
            size={16}
            className='hidden text-gray-400 transition-transform duration-150 group-hover:translate-x-0.5 sm:block'
          />
        ) : null}
      </div>
    </div>
  );

  const className = twMerge(
    'group block min-w-0 rounded-xl px-2.5 py-3 transition-colors duration-150 sm:px-3',
    unread &&
      'bg-brand-orange/[0.06] ring-1 ring-inset ring-brand-orange/10 dark:bg-brand-orange/[0.09] dark:ring-brand-orange/15',
    href &&
      (unread
        ? 'hover:bg-brand-orange/[0.11] dark:hover:bg-brand-orange/[0.14]'
        : 'hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40')
  );

  return (
    <div
      className={className}
      data-notification-state={unread ? 'unread' : 'read'}
    >
      {inner}
    </div>
  );
}
