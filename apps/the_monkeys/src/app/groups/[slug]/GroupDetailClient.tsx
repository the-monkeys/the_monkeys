'use client';

import Link from 'next/link';

import { GroupEmpty } from '@/components/groups/GroupCard';
import { GroupCommunity } from '@/components/groups/detail/GroupCommunity';
import { GroupJoinButton } from '@/components/groups/detail/GroupJoinButton';
import { GroupRules } from '@/components/groups/detail/GroupRules';
import Icon, { IconName } from '@/components/icon';
import { Loader } from '@/components/loader';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { canManageGroup } from '@/lib/groupPerms';
import { GroupVisibility } from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

const VISIBILITY: Record<
  GroupVisibility,
  { label: string; icon: IconName | null }
> = {
  public: { label: 'Public group', icon: null },
  private: { label: 'Private group', icon: 'RiLock' },
  unlisted: { label: 'Unlisted group', icon: 'RiEyeClose' },
};

export default function GroupDetailClient({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useGroupDetail(slug);
  const group = data?.group;

  if (isLoading) {
    return (
      <div className='flex justify-center py-24'>
        <Loader size={32} />
      </div>
    );
  }

  if (isError || !group) {
    return (
      <GroupEmpty
        title='Group not found'
        hint='It may be private or removed.'
      />
    );
  }

  const visibility = VISIBILITY[group.visibility] ?? VISIBILITY.public;
  const place = [group.city, group.region, group.country]
    .filter(Boolean)
    .join(', ');
  const memberCount = group.member_count ?? 0;
  const manage = canManageGroup(group);

  return (
    <div className='mx-auto max-w-4xl pb-16'>
      {/* Banner */}
      <div
        className='relative overflow-hidden rounded-2xl bg-foreground-light/40 dark:bg-foreground-dark/30'
        style={{ aspectRatio: '3 / 1' }}
      >
        {group.cover_image ? (
          <img
            src={group.cover_image}
            alt=''
            className='h-full w-full object-cover'
            loading='eager'
          />
        ) : (
          <div className='h-full w-full bg-gradient-to-br from-brand-orange/40 to-black/40' />
        )}
      </div>

      <div className='relative z-10 -mt-10 px-4 sm:px-6'>
        {/* Logo overlaps the banner; organizers get an inline edit affordance
            beside it (mirrors the profile page's pencil-next-to-avatar). */}
        <div className='flex items-end gap-2'>
          <div className='h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-background-light bg-foreground-light/40 dark:border-background-dark dark:bg-foreground-dark/30'>
            {group.logo_image ? (
              <img
                src={group.logo_image}
                alt=''
                className='h-full w-full object-cover'
                loading='lazy'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-brand-orange'>
                <Icon name='RiGroup' size={32} />
              </div>
            )}
          </div>

          {manage && (
            <Link
              href={`${GROUPS_ROUTE}/${group.slug}/manage`}
              aria-label={`Edit ${group.name}`}
              title='Edit group'
              className='mb-1 inline-flex h-9 w-9 items-center justify-center rounded-full opacity-100 transition-opacity hover:opacity-80'
            >
              <Icon
                name='RiPencil'
                type='Fill'
                size={18}
                className='text-brand-orange'
              />
            </Link>
          )}
        </div>

        <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2 font-inter text-xs text-gray-500'>
              <span className='inline-flex items-center gap-1'>
                {visibility.icon && <Icon name={visibility.icon} size={13} />}
                {visibility.label}
              </span>
              {place && (
                <>
                  <span aria-hidden>·</span>
                  <span className='inline-flex items-center gap-1'>
                    <Icon name='RiMapPinUser' size={13} />
                    {place}
                  </span>
                </>
              )}
            </div>

            <h1
              className='mt-1 font-newsreader font-bold leading-tight'
              style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)' }}
            >
              {group.name}
            </h1>

            <p className='mt-1 font-inter text-sm text-gray-500'>
              {memberCount.toLocaleString()} member
              {memberCount === 1 ? '' : 's'}
              {group.organizer_username && (
                <>
                  {' · organized by '}
                  <Link
                    href={`/${group.organizer_username}`}
                    className='hover:text-brand-orange'
                  >
                    @{group.organizer_username}
                  </Link>
                </>
              )}
            </p>

            {group.topics && group.topics.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {group.topics.map((topic) => (
                  <span
                    key={topic}
                    className='rounded-full border border-border-light px-3 py-1 font-inter text-xs text-gray-600 dark:border-border-dark dark:text-gray-400'
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            {manage && (
              <Button asChild variant='outline'>
                <Link href={`${GROUPS_ROUTE}/${group.slug}/events/new`}>
                  Create event
                </Link>
              </Button>
            )}
            <GroupJoinButton group={group} />
          </div>
        </div>

        {/* ── Body: Single column for tabs and content ────────────────────── */}
        <div className='mt-8'>
          <div className='min-w-0'>
            {/* Events / About / Members / Join requests / Invites tabs */}
            <GroupCommunity group={group} />
          </div>
        </div>
      </div>
    </div>
  );
}
