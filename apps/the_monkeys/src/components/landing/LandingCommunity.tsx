'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import Icon from '@/components/icon';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';

type PreviewState<T> = { data?: T[]; isPending?: boolean; isError?: boolean };
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark';
const border =
  'rounded-xl border border-border-light/70 bg-background-light dark:border-border-dark/40 dark:bg-background-dark';

function SectionHeader({
  title,
  href,
  link,
}: {
  title: string;
  href: string;
  link: string;
}) {
  return (
    <div className='flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1'>
      <h2 className='font-newsreader text-2xl font-semibold leading-tight text-text-light dark:text-text-dark'>
        {title}
      </h2>
      <Link
        href={href}
        className={`inline-flex min-h-11 items-center gap-1.5 font-inter text-sm font-medium text-brand-orange hover:underline ${focusRing}`}
      >
        {link}
        <Icon name='RiArrowRight' size={16} />
      </Link>
    </div>
  );
}

function Placeholder({ label, message }: { label?: string; message?: string }) {
  return (
    <div
      aria-label={label}
      role={label ? 'status' : undefined}
      className={`${border} px-4 py-6 font-inter text-sm text-gray-500 dark:text-gray-400`}
    >
      {label ? (
        <span className='flex items-center gap-2'>
          <span
            aria-hidden
            className='size-4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700'
          />
          {label}…
        </span>
      ) : (
        message
      )}
    </div>
  );
}

function GroupLogo({ src }: { src?: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const imageRef = useRef<HTMLImageElement>(null);
  const safe = src && (/^https?:\/\//i.test(src) || /^\/(?!\/)/.test(src));
  useEffect(() => {
    // A cached image can finish before hydration attaches its load handler.
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0)
      setLoadedSrc(src);
  }, [src]);
  return (
    <div className='relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-orange/10 text-brand-orange'>
      {loadedSrc !== src || failedSrc === src || !safe ? (
        <Icon name='RiGroup' size={24} />
      ) : null}
      {safe && src !== failedSrc ? (
        <Image
          ref={imageRef}
          src={src}
          alt=''
          width={44}
          height={44}
          unoptimized
          loading='lazy'
          className={`absolute inset-0 size-full object-contain ${loadedSrc === src ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
        />
      ) : null}
    </div>
  );
}

export function LandingDiscussions({
  discussions,
}: {
  discussions: PreviewState<Discussion>;
}) {
  return (
    <section aria-label='Top discussions' className='min-w-0'>
      <SectionHeader
        title='Top discussions'
        href='/discussions'
        link='View all discussions'
      />
      {discussions.isPending ? (
        <Placeholder label='Loading discussions' />
      ) : discussions.isError ? (
        <Placeholder message='Discussions are taking a little longer to load.' />
      ) : discussions.data?.length ? (
        <ul
          className={`${border} divide-y divide-border-light/70 dark:divide-border-dark/40`}
        >
          {discussions.data.slice(0, 3).map((post) => (
            <li key={post.public_id} className='min-w-0 p-3 sm:p-4'>
              <DiscussionCard post={post} linked embedded compact />
            </li>
          ))}
        </ul>
      ) : (
        <Placeholder message='No public discussions to show yet.' />
      )}
    </section>
  );
}

export function LandingGroups({
  groups,
  rail = false,
}: {
  groups: PreviewState<GroupItem>;
  rail?: boolean;
}) {
  return (
    <section aria-label='Discover groups' className='min-w-0'>
      <SectionHeader
        title='Discover groups'
        href='/groups'
        link='View all groups'
      />
      {groups.isPending ? (
        <Placeholder label='Loading groups' />
      ) : groups.isError ? (
        <Placeholder message='Groups are taking a little longer to load.' />
      ) : groups.data?.length ? (
        <ul
          className={`grid min-w-0 gap-3 sm:grid-cols-2 ${rail ? 'xl:grid-cols-1' : ''}`}
        >
          {groups.data.slice(0, 2).map((group) => (
            <li key={group.id} className={`${border} min-w-0`}>
              <Link
                aria-label={`View group ${group.name}`}
                href={`/groups/${encodeURIComponent(group.slug)}`}
                className={`group grid h-full min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-xl p-3 ${focusRing}`}
              >
                <div className='row-span-3'>
                  <GroupLogo src={group.logo_image} />
                </div>
                <div className='min-w-0'>
                  <h3 className='line-clamp-2 break-words font-inter text-sm font-semibold text-text-light [overflow-wrap:anywhere] group-hover:text-brand-orange dark:text-text-dark'>
                    {group.name}
                  </h3>
                  <span className='font-inter text-xs text-gray-500 dark:text-gray-400'>
                    Public group
                  </span>
                </div>
                {group.description ? (
                  <p className='line-clamp-2 break-words font-inter text-sm leading-5 text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400'>
                    {group.description}
                  </p>
                ) : null}
                <span className='inline-flex min-h-7 items-center gap-1.5 font-inter text-sm font-medium text-brand-orange'>
                  View group
                  <Icon name='RiArrowRight' size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Placeholder message='No public groups to discover yet.' />
      )}
    </section>
  );
}

/** Retain the combined presentation for existing callers. */
export function LandingCommunity({
  discussions,
  groups,
}: {
  discussions: PreviewState<Discussion>;
  groups: PreviewState<GroupItem>;
}) {
  return (
    <div className='mb-6 flex min-w-0 flex-col gap-5 sm:mb-8 sm:gap-6'>
      <LandingDiscussions discussions={discussions} />
      <LandingGroups groups={groups} />
    </div>
  );
}
