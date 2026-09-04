import { EventResp, EventType, ProtoTime } from '@/services/events/eventTypes';

export type GroupVisibility = 'public' | 'private' | 'unlisted';

export type GroupStatus = 'draft' | 'published' | 'archived' | 'suspended';

// viewer_role adds 'viewer' for non-members; management roles are the first
// four. Keep the union aligned with the group service enum.
export type GroupRole =
  | 'organizer'
  | 'co_organizer'
  | 'moderator'
  | 'member'
  | 'viewer';

export type GroupMemberStatus =
  | 'active'
  | 'pending'
  | 'left'
  | 'removed'
  | 'banned'
  | '';

export type GroupRule = {
  id: number;
  group_id?: number;
  title: string;
  body: string;
  sort_order?: number;
  created_at?: ProtoTime;
  updated_at?: ProtoTime;
};

export type GroupMember = {
  id: number;
  group_id?: number;
  account_id?: string;
  username: string;
  role: GroupRole;
  status: GroupMemberStatus;
  joined_at?: ProtoTime;
  permissions?: string[];
};

export type GroupItem = {
  id: number;
  slug: string;
  name: string;
  description?: string;
  visibility: GroupVisibility;
  status: GroupStatus;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  cover_image?: string;
  logo_image?: string;
  organizer_account_id?: string;
  organizer_username?: string;
  member_count?: number;
  topics?: string[];
  created_at?: ProtoTime;
  updated_at?: ProtoTime;
  // Viewer-scoped hydration, resolved when the request carries the auth cookie.
  viewer_role?: GroupRole;
  viewer_member_status?: GroupMemberStatus;
  // Populated on single-group detail reads only.
  rules?: GroupRule[];
};

export type GroupBody = {
  name: string;
  description?: string;
  visibility: GroupVisibility;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  cover_image?: string;
  logo_image?: string;
  topics?: string[];
};

export type JoinBody = {
  answers?: Record<string, string>;
};

// Ownership transfer is deliberately excluded: 'organizer' is not a role edit.
export type MemberRoleBody = {
  role: 'co_organizer' | 'moderator' | 'member';
};

export type BanBody = {
  reason?: string;
};

// Direct add enrolls a user as an active member, bypassing the pending queue.
// Role is optional and defaults to plain member.
export type AddMemberBody = {
  username: string;
  role?: 'co_organizer' | 'moderator' | 'member';
};

// Invite links are tokened, shareable admittances. max_uses = 0 is unlimited;
// expires_in_hours = 0 never expires.
export type CreateInviteBody = {
  role?: 'co_organizer' | 'moderator' | 'member';
  max_uses?: number;
  expires_in_hours?: number;
};

export type GroupInvite = {
  id: number;
  group_id?: number;
  token: string;
  role: GroupRole;
  max_uses: number;
  uses: number;
  expires_at?: ProtoTime;
  created_by_username?: string;
  created_at?: ProtoTime;
  revoked: boolean;
  // Hydrated on the public accept page:
  group_slug?: string;
  group_name?: string;
  group_visibility?: GroupVisibility;
  active: boolean;
};

export type InviteResp = {
  message?: string;
  invite?: GroupInvite;
  error?: string;
};

export type ListInvitesResp = {
  invites?: GroupInvite[];
  error?: string;
};

// Group image upload returns a domain-free URL the caller persists on the group.
export type GroupImageKind = 'logo' | 'cover';

export type GroupImageResp = {
  bucket?: string;
  object?: string;
  url?: string;
  etag?: string;
  size?: number;
  contentType?: string;
  blurhash?: string;
  width?: number;
  height?: number;
};

export type GroupRuleBody = {
  title: string;
  body: string;
  sort_order?: number;
};

export type GroupEventVisibility =
  | 'public'
  | 'group_members'
  | 'private'
  | 'unlisted';

export type GroupEventBody = {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  timezone?: string;
  event_type: EventType;
  location?: string;
  meeting_link?: string;
  capacity?: number;
  cover_image?: string;
  tags?: string[];
  visibility?: GroupEventVisibility;
};

export type GroupListFilters = {
  limit?: number;
  offset?: number;
  topics?: string[];
  status?: string;
  country?: string;
  region?: string;
  city?: string;
  q?: string;
  user_lat?: number;
  user_lng?: number;
  radius?: number;
  public_only?: boolean;
};

export type MemberListParams = {
  limit?: number;
  offset?: number;
  status?: string;
};

export type GroupResp = {
  message?: string;
  group?: GroupItem;
  error?: string;
};

export type ListGroupsResp = {
  groups?: GroupItem[];
  total?: number;
  error?: string;
};

export type ListGroupMembersResp = {
  members?: GroupMember[];
  total?: number;
  error?: string;
};

export type GroupRuleResp = {
  message?: string;
  rule?: GroupRule;
  error?: string;
};

export type BasicResp = {
  message?: string;
  error?: string;
  success?: boolean;
};

// Group-scoped event creation is delegated to the events service and returns
// the standard event response shape.
export type GroupEventResp = EventResp;
