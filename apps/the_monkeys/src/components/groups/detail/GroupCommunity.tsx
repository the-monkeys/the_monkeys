'use client';

import { useState } from 'react';

import Link from 'next/link';

import { EventGridCard } from '@/components/events/EventGridCard';
import { GroupAddMember } from '@/components/groups/members/GroupAddMember';
import { GroupInvites } from '@/components/groups/members/GroupInvites';
import { GroupJoinRequests } from '@/components/groups/members/GroupJoinRequests';
import { GroupMembersManager } from '@/components/groups/members/GroupMembersManager';
import { Loader } from '@/components/loader';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useGroupEvents } from '@/hooks/events/useEventQueries';
import { canManageGroup, canViewGroupMembers } from '@/lib/groupPerms';
import { GroupItem } from '@/services/groups/groupsTypes';

type Tab = 'events' | 'members' | 'requests' | 'invites';

/**
 * Team-page community panel. Leads with the group's event agenda, then the
 * member roster (with admin/co-admin role labels), and — for staff only —
 * "Join requests" and "Invites" tabs. Every staff tab is UI-gated here and
 * enforced server-side, so non-staff viewers never see or act on them.
 */
export function GroupCommunity({ group }: { group: GroupItem }) {
  const { data: session } = useAuth();
  const staff = canManageGroup(group);
  const canView = canViewGroupMembers(group);
  const [tab, setTab] = useState<Tab>('events');

  // Private/unlisted groups hide the panel from non-members and non-staff.
  if (!canView && !staff) return null;

  return (
    <section>
      <div
        role='tablist'
        aria-label='Group community'
        className='mb-4 flex items-center gap-1 border-b border-border-light dark:border-border-dark'
      >
        <TabButton active={tab === 'events'} onClick={() => setTab('events')}>
          Events
        </TabButton>
        <TabButton active={tab === 'members'} onClick={() => setTab('members')}>
          Members
        </TabButton>
        {staff && (
          <TabButton
            active={tab === 'requests'}
            onClick={() => setTab('requests')}
          >
            Join requests
          </TabButton>
        )}
        {staff && (
          <TabButton
            active={tab === 'invites'}
            onClick={() => setTab('invites')}
          >
            Invites
          </TabButton>
        )}
      </div>

      {tab === 'events' ? (
        <GroupEventsPanel group={group} staff={staff} />
      ) : tab === 'members' ? (
        <>
          {staff && <GroupAddMember group={group} />}
          <GroupMembersManager
            group={group}
            viewerUsername={session?.username}
          />
        </>
      ) : tab === 'requests' ? (
        <GroupJoinRequests group={group} />
      ) : (
        <GroupInvites group={group} />
      )}
    </section>
  );
}

// Lists the events attached to this group. Visibility is enforced server-side:
// members see the full agenda, non-members only see public events of a public
// group.
function GroupEventsPanel({
  group,
  staff,
}: {
  group: GroupItem;
  staff: boolean;
}) {
  const { data, isLoading } = useGroupEvents(group.slug);
  const events = data?.events ?? [];

  if (isLoading) {
    return (
      <div className='flex justify-center py-10'>
        <Loader size={28} />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className='rounded-lg border border-dashed border-border-light py-10 text-center dark:border-border-dark'>
        <p className='font-inter text-sm text-gray-500'>
          No events scheduled yet.
        </p>
        {staff && (
          <Link
            href={`${GROUPS_ROUTE}/${group.slug}/events/new`}
            className='mt-2 inline-block font-dm_sans text-sm font-medium text-brand-orange hover:underline'
          >
            Create the first event
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {events.map((event) => (
        <EventGridCard key={event.slug} event={event} />
      ))}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      role='tab'
      aria-selected={active}
      onClick={onClick}
      className={`-mb-px min-h-[44px] border-b-2 px-3 font-inter text-sm transition-colors ${
        active
          ? 'border-brand-orange text-brand-orange'
          : 'border-transparent text-gray-500 hover:text-text-light dark:hover:text-text-dark'
      }`}
    >
      {children}
    </button>
  );
}
