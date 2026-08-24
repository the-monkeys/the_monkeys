'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import { useGroupMembers } from '@/hooks/groups/useGroupQueries';
import {
  useBanMember,
  useRemoveMember,
  useUpdateMemberRole,
} from '@/hooks/groups/useGroupQueries';
import { canEditGroup, canManageGroup } from '@/lib/groupPerms';
import { groupError } from '@/services/groups/groupsApi';
import {
  GroupItem,
  GroupMember,
  GroupRole,
  MemberRoleBody,
} from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

const ROLE_LABEL: Record<GroupRole, string> = {
  organizer: 'Organizer',
  co_organizer: 'Co-organizer',
  moderator: 'Moderator',
  member: 'Member',
  viewer: 'Viewer',
};

const EDITABLE_ROLES: MemberRoleBody['role'][] = [
  'co_organizer',
  'moderator',
  'member',
];

/**
 * Active-member roster with staff moderation controls. Read-only for regular
 * members; staff can change roles (organizer/co-organizer), remove and ban.
 */
export function GroupMembersManager({
  group,
  viewerUsername,
}: {
  group: GroupItem;
  viewerUsername?: string;
}) {
  const { data, isLoading } = useGroupMembers(
    group.slug,
    { status: 'active', limit: 100 },
    true
  );

  const members = data?.members || [];
  const canManage = canManageGroup(group);
  const canEditRoles = canEditGroup(group);

  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader size={28} />
      </div>
    );
  }

  if (members.length === 0) {
    return <p className='font-inter text-sm text-gray-500'>No members yet.</p>;
  }

  return (
    <ul className='divide-y divide-border-light dark:divide-border-dark/40'>
      {members.map((m) => (
        <MemberRow
          key={m.id}
          slug={group.slug}
          member={m}
          canManage={canManage}
          canEditRoles={canEditRoles}
          isSelf={!!viewerUsername && viewerUsername === m.username}
        />
      ))}
    </ul>
  );
}

function MemberRow({
  slug,
  member,
  canManage,
  canEditRoles,
  isSelf,
}: {
  slug: string;
  member: GroupMember;
  canManage: boolean;
  canEditRoles: boolean;
  isSelf: boolean;
}) {
  const { toast } = useToast();
  const updateRole = useUpdateMemberRole(slug);
  const remove = useRemoveMember(slug);
  const ban = useBanMember(slug);
  const [editing, setEditing] = useState(false);

  const isOrganizer = member.role === 'organizer';
  // The organizer row and the viewer's own row are never moderated here.
  const showControls = canManage && !isOrganizer && !isSelf;

  const onRoleChange = async (role: MemberRoleBody['role']) => {
    try {
      await updateRole.mutateAsync({
        username: member.username,
        body: { role },
      });
      toast({ title: 'Role updated' });
    } catch (err) {
      toast({ title: 'Could not update role', description: groupError(err) });
    }
  };

  const onRemove = async () => {
    try {
      await remove.mutateAsync(member.username);
      toast({ title: 'Member removed' });
    } catch (err) {
      toast({ title: 'Could not remove', description: groupError(err) });
    }
  };

  const onBan = async () => {
    try {
      await ban.mutateAsync({ username: member.username });
      toast({ title: 'Member banned' });
    } catch (err) {
      toast({ title: 'Could not ban', description: groupError(err) });
    }
  };

  return (
    <li className='flex flex-wrap items-center gap-3 py-3'>
      <Link href={`/${member.username}`} aria-label={member.username}>
        <ProfileFrame className='h-10 w-10'>
          <ProfileImage username={member.username} />
        </ProfileFrame>
      </Link>

      <div className='min-w-0 flex-1'>
        <Link
          href={`/${member.username}`}
          className='block truncate font-dm_sans font-medium hover:text-brand-orange'
        >
          @{member.username}
        </Link>
        <span className='font-inter text-xs text-gray-500'>
          {ROLE_LABEL[member.role]}
        </span>
      </div>

      {showControls && (
        <div className='flex items-center gap-2'>
          {!editing ? (
            <Button
              size='sm'
              variant='ghost'
              onClick={() => setEditing(true)}
              aria-label={`Edit @${member.username}`}
            >
              <Icon
                name='RiPencil'
                type='Fill'
                size={16}
                className='text-brand-orange'
              />
            </Button>
          ) : (
            <>
              {canEditRoles && (
                <select
                  aria-label={`Role for ${member.username}`}
                  value={
                    EDITABLE_ROLES.includes(
                      member.role as MemberRoleBody['role']
                    )
                      ? (member.role as MemberRoleBody['role'])
                      : 'member'
                  }
                  onChange={(e) =>
                    onRoleChange(e.target.value as MemberRoleBody['role'])
                  }
                  disabled={updateRole.isPending}
                  className='rounded-md border-2 border-border-light bg-transparent px-2 py-1 font-inter text-sm dark:border-border-dark'
                >
                  {EDITABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>
              )}
              <ConfirmDialog
                trigger={
                  <Button size='sm' variant='ghost'>
                    Remove
                  </Button>
                }
                title={`Remove @${member.username}?`}
                description='They can re-join later if the group allows it.'
                confirmLabel='Remove'
                onConfirm={onRemove}
              />
              <ConfirmDialog
                trigger={
                  <Button size='sm' variant='ghost' className='text-alert-red'>
                    Ban
                  </Button>
                }
                title={`Ban @${member.username}?`}
                description='They will be removed and blocked from re-joining.'
                confirmLabel='Ban'
                destructive
                onConfirm={onBan}
              />
              <Button
                size='sm'
                variant='ghost'
                onClick={() => setEditing(false)}
                aria-label='Done editing'
              >
                Done
              </Button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
