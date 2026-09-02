'use client';

import { useState } from 'react';

import Link from 'next/link';

import { EventGridCard } from '@/components/events/EventGridCard';
import { TextTabs } from '@/components/TextTabs';
import { GroupRules } from '@/components/groups/detail/GroupRules';
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

type Tab = 'events' | 'about' | 'members' | 'requests' | 'invites';

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
      <TextTabs
        aria-label='Group community'
        value={tab}
        onChange={setTab}
        items={
          (
            [
              { id: 'events', label: 'Events' },
              { id: 'about', label: 'About' },
              { id: 'members', label: 'Members' },
              ...(staff
                ? [
                    { id: 'requests', label: 'Join requests' },
                    { id: 'invites', label: 'Invites' },
                  ]
                : []),
            ] as { id: Tab; label: string }[]
          )
        }
      />

      {tab === 'events' ? (
        <GroupEventsPanel group={group} staff={staff} />
      ) : tab === 'about' ? (
        <GroupAboutPanel group={group} />
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
  const [when, setWhen] = useState<'upcoming' | 'past'>('upcoming');
  const { data, isLoading } = useGroupEvents(group.slug, {
    date: when,
    limit: 24,
  });
  const events = data?.events ?? [];

  return (
    <div>
      <TextTabs
        aria-label='Group events'
        value={when}
        onChange={setWhen}
        items={[
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'past', label: 'Past' },
        ]}
      />
      {isLoading ? (
        <div className='flex justify-center py-10'>
          <Loader size={28} />
        </div>
      ) : events.length === 0 ? (
        <div className='rounded-lg border border-dashed border-border-light py-10 text-center dark:border-border-dark'>
          <p className='font-inter text-sm text-gray-500'>
            {when === 'past'
              ? 'No past events yet.'
              : 'No events scheduled yet.'}
          </p>
          {staff && when === 'upcoming' && (
            <Link
              href={`${GROUPS_ROUTE}/${group.slug}/events/new`}
              className='mt-2 inline-block font-dm_sans text-sm font-medium text-brand-orange hover:underline'
            >
              Create the first event
            </Link>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {events.map((event) => (
            <EventGridCard key={event.slug} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupAboutPanel({ group }: { group: GroupItem }) {
  return (
    <div className='space-y-8 py-4'>
      {group.description && (
        <section>
          <h2 className='mb-3 font-newsreader text-2xl font-bold'>About us</h2>
          <p className='whitespace-pre-line font-inter text-[15px] leading-relaxed text-gray-700 dark:text-gray-300'>
            {group.description}
          </p>
        </section>
      )}

      {group.rules && group.rules.length > 0 && (
        <GroupRules rules={group.rules} />
      )}

      {!group.description && (!group.rules || group.rules.length === 0) && (
        <p className='font-inter text-sm text-gray-500 py-6'>
          This group hasn&apos;t added an about section or rules yet.
        </p>
      )}
    </div>
  );
}
