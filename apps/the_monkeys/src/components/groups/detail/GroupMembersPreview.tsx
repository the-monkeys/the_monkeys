'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import { useGroupMembers } from '@/hooks/groups/useGroupQueries';
import { GroupItem, GroupRole } from '@/services/groups/groupsTypes';

const ROLE_LABEL: Partial<Record<GroupRole, string>> = {
  organizer: 'Organizer',
  co_organizer: 'Co-organizer',
  moderator: 'Moderator',
};

/**
 * Avatar wall of active members, staff first. The roster is only fetched when
 * the viewer may see it (public groups, or members of a private group);
 * otherwise a count-only prompt is shown.
 */
export function GroupMembersPreview({
  group,
  canView,
}: {
  group: GroupItem;
  canView: boolean;
}) {
  const { data, isLoading } = useGroupMembers(
    group.slug,
    { limit: 24 },
    canView
  );

  const members = (data?.members || []).filter((m) => m.status === 'active');
  const total = data?.total ?? group.member_count ?? members.length;

  // Surface staff ahead of regular members, then cap the preview.
  const staff = members.filter((m) => m.role !== 'member');
  const rest = members.filter((m) => m.role === 'member');
  const shown = [...staff, ...rest].slice(0, 18);

  return (
    <section>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='font-newsreader text-2xl font-bold'>Members</h2>
        <span className='rounded-full bg-foreground-light/40 px-3 py-1 font-inter text-xs text-gray-500 dark:bg-foreground-dark/30'>
          {total.toLocaleString()} member{total === 1 ? '' : 's'}
        </span>
      </div>

      {!canView ? (
        <p className='font-inter text-sm text-gray-500'>
          Join this group to see its members.
        </p>
      ) : isLoading ? (
        <p className='font-inter text-sm text-gray-500'>Loading members…</p>
      ) : shown.length === 0 ? (
        <p className='font-inter text-sm text-gray-500'>No members yet.</p>
      ) : (
        <>
          <ul className='grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-4'>
            {shown.map((m) => (
              <li
                key={m.id}
                className='flex flex-col items-center gap-1 text-center'
              >
                <Link href={`/${m.username}`} aria-label={m.username}>
                  <ProfileFrame className='h-14 w-14'>
                    <ProfileImage username={m.username} />
                  </ProfileFrame>
                </Link>
                <span className='w-full truncate font-inter text-xs text-gray-600 dark:text-gray-400'>
                  @{m.username}
                </span>
                {ROLE_LABEL[m.role] && (
                  <span className='font-inter text-[10px] uppercase tracking-wide text-brand-orange'>
                    {ROLE_LABEL[m.role]}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {total > shown.length && (
            <Link
              href={`${GROUPS_ROUTE}/${group.slug}/members`}
              className='mt-4 inline-flex items-center gap-1 font-inter text-sm text-brand-orange hover:underline'
            >
              See all members <Icon name='RiArrowRight' size={16} />
            </Link>
          )}
        </>
      )}
    </section>
  );
}
