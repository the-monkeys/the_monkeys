'use client';

import Link from 'next/link';

import { GroupEmpty } from '@/components/groups/GroupCard';
import { GroupMembersManager } from '@/components/groups/members/GroupMembersManager';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { canManageGroup, canViewGroupMembers } from '@/lib/groupPerms';

export default function GroupMembersPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: session } = useAuth();
  const { data, isLoading } = useGroupDetail(params.slug);
  const group = data?.group;

  if (isLoading) {
    return (
      <div className='flex justify-center py-24'>
        <Loader size={32} />
      </div>
    );
  }

  if (!group) {
    return (
      <GroupEmpty
        title='Group not found'
        hint='It may be private or removed.'
      />
    );
  }

  return (
    <div className='mx-auto max-w-3xl pb-16'>
      <Link
        href={`${GROUPS_ROUTE}/${group.slug}`}
        className='inline-flex items-center gap-1 font-inter text-sm text-gray-500 hover:text-brand-orange'
      >
        <Icon name='RiArrowLeftS' size={16} /> {group.name}
      </Link>
      <h1 className='mb-6 mt-1 font-newsreader text-3xl font-bold md:text-4xl'>
        Members
      </h1>

      {canViewGroupMembers(group) || canManageGroup(group) ? (
        <GroupMembersManager group={group} viewerUsername={session?.username} />
      ) : (
        <p className='font-inter text-sm text-gray-500'>
          Join this group to see its members.
        </p>
      )}
    </div>
  );
}
