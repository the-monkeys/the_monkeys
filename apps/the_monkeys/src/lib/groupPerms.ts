import { GroupItem, GroupRole } from '@/services/groups/groupsTypes';

// Roles that can access management surfaces (settings, rules, moderation).
const STAFF_ROLES: GroupRole[] = ['organizer', 'co_organizer', 'moderator'];

/** The single organizer who owns the group; only they may delete it. */
export function isGroupOwner(group?: GroupItem | null): boolean {
  return group?.viewer_role === 'organizer';
}

/** Staff (organizer, co-organizer, moderator) see the management surface. */
export function canManageGroup(group?: GroupItem | null): boolean {
  return !!group?.viewer_role && STAFF_ROLES.includes(group.viewer_role);
}

/** Editing the group profile/settings is limited to organizer + co-organizer. */
export function canEditGroup(group?: GroupItem | null): boolean {
  return (
    group?.viewer_role === 'organizer' || group?.viewer_role === 'co_organizer'
  );
}

/** Members roster is open on public groups; otherwise it needs standing. */
export function canViewGroupMembers(group?: GroupItem | null): boolean {
  return (
    group?.visibility === 'public' || group?.viewer_member_status === 'active'
  );
}
