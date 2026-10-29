'use client';

import Link from 'next/link';

import { DiscussionAvatar } from '@/components/discussions/DiscussionAvatar';
import { useViewerTimezone } from '@/hooks/events/useViewerTimezone';
import {
  type LinkPreview,
  blogPreview,
  discussionPreview,
  eventPreview,
  groupPreview,
  profilePreview,
} from '@/lib/discussionLinkPreview';
import type { InternalTarget } from '@/lib/discussionLinks';
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import type { Blog } from '@/services/blog/blogTypes';
import { getDiscussion } from '@/services/discussions/discussionsApi';
import type { EventResp } from '@/services/events/eventTypes';
import { getGroup } from '@/services/groups/groupsApi';
import type { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { useQuery } from '@tanstack/react-query';

const seg = (v: string) => encodeURIComponent(v);

// Plain axios calls: the shared fetchers log every failure, and a link to a
// missing or private item is an expected miss here.
const getJson = <T,>(client: typeof axiosInstanceNoAuth, path: string) =>
  client.get<T>(path).then((r) => r.data);

// Cards sit above the feed card's full-card link so they stay clickable.
const cardClass =
  'relative z-10 mt-3 flex h-[76px] min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-border-light p-2.5 dark:border-border-dark/60';

async function loadPreview(
  target: InternalTarget,
  viewingTimezone?: string
): Promise<LinkPreview | null> {
  try {
    switch (target.kind) {
      case 'blog':
        return blogPreview(
          await getJson<Blog>(axiosInstanceNoAuthV2, `/blog/${seg(target.id)}`)
        );
      case 'event':
        return eventPreview(
          (
            await getJson<EventResp>(
              axiosInstanceNoAuth,
              `/events/${seg(target.slug)}`
            )
          ).event,
          viewingTimezone
        );
      case 'group':
        return groupPreview((await getGroup(target.slug)).group);
      case 'profile':
        return profilePreview(
          await getJson<GetPublicUserProfileApiResponse>(
            axiosInstanceNoAuth,
            `/user/public/${seg(target.username)}`
          )
        );
      case 'discussion':
        return discussionPreview(await getDiscussion(target.id));
    }
  } catch {
    return null;
  }
}

export function DiscussionLinkPreview({
  target,
  href,
}: {
  target: InternalTarget;
  href: string;
}) {
  const viewingTimezone = useViewerTimezone();
  const eventTimezone = target.kind === 'event' ? viewingTimezone : undefined;
  const { data, isPending } = useQuery({
    queryKey: ['discussion-link-preview', target, eventTimezone],
    queryFn: () => loadPreview(target, eventTimezone),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isPending) {
    return (
      <div aria-hidden className={`${cardClass} animate-pulse`}>
        <span className='size-14 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700' />
        <span className='h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700' />
      </div>
    );
  }
  if (!data) return null;

  return (
    <Link
      className={`${cardClass} transition-colors hover:border-brand-orange/60`}
      href={href}
    >
      {data.image ? (
        <img
          alt=''
          className='size-14 shrink-0 rounded-lg object-cover'
          loading='lazy'
          src={data.image}
        />
      ) : data.avatarUsername ? (
        <DiscussionAvatar username={data.avatarUsername} />
      ) : null}
      <span className='min-w-0 flex-1 font-inter'>
        <span className='block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-orange'>
          {data.label}
        </span>
        <span className='block truncate text-sm font-semibold'>
          {data.title}
        </span>
        {data.description ? (
          <span className='block truncate text-xs text-gray-500'>
            {data.description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
