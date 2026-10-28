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

/** Active standing in the group — not pending, left, or a logged-out stranger. */
export function isActiveGroupMember(group?: GroupItem | null): boolean {
  return group?.viewer_member_status === 'active';
}

export function groupFeedEmptyCopy({
  kind,
  member,
  signedIn,
  when,
}: {
  kind: 'posts' | 'events';
  member: boolean;
  signedIn: boolean;
  when?: 'upcoming' | 'past';
}): string {
  if (member) {
    if (kind === 'events') {
      return when === 'past'
        ? 'No past events yet.'
        : 'No events scheduled yet.';
    }
    return 'No posts have been published to this group yet.';
  }
  if (kind === 'events') {
    return signedIn
      ? 'Join this group to see events.'
      : 'Log in and join this group to see events.';
  }
  return signedIn
    ? 'Join this group to see posts.'
    : 'Log in and join this group to see posts.';
}
