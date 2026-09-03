import { queryKeys } from '@/lib/queryKeys';
import {
  acceptInvite,
  addGroupRule,
  addMember,
  approveJoinRequest,
  banMember,
  createGroup,
  createGroupEvent,
  createInvite,
  deleteGroup,
  deleteGroupRule,
  getGroup,
  getInvite,
  joinGroup,
  leaveGroup,
  listGroups,
  listInvites,
  listMembers,
  listUserGroups,
  publishGroup,
  rejectJoinRequest,
  removeMember,
  revokeInvite,
  updateGroup,
  updateGroupRule,
  updateMemberRole,
  uploadGroupImage,
} from '@/services/groups/groupsApi';
import {
  AddMemberBody,
  BanBody,
  CreateInviteBody,
  GroupBody,
  GroupEventBody,
  GroupImageKind,
  GroupListFilters,
  GroupRuleBody,
  JoinBody,
  MemberListParams,
  MemberRoleBody,
} from '@/services/groups/groupsTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

export function useGroupList(filters: GroupListFilters = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.groups.list(filters),
    queryFn: () => listGroups(filters),
    enabled,
  });
}

export function useUserGroups(
  username: string | undefined,
  filters: GroupListFilters = {},
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.groups.user(username, filters),
    queryFn: () => listUserGroups(username!, filters),
    enabled: enabled && !!username,
  });
}

export function useGroupDetail(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.groups.detail(slug),
    queryFn: () => getGroup(slug!),
    enabled: !!slug,
  });
}

export function useGroupMembers(
  slug: string | undefined,
  params?: MemberListParams,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.groups.members(slug, params as Record<string, unknown>),
    queryFn: () => listMembers(slug!, params),
    enabled: enabled && !!slug,
  });
}

// Invite links are staff-only; gate the query with `enabled` so a non-staff
// viewer never fires the request the gateway would reject.
export function useGroupInvites(slug: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.groups.invites(slug),
    queryFn: () => listInvites(slug!),
    enabled: enabled && !!slug,
  });
}

// -----------------------------------------------------------------------------
// Cache invalidation helper
// -----------------------------------------------------------------------------

// Invalidates the group list plus, when a slug is supplied, that group's detail,
// members, and invite caches so mutations reflect immediately across the UI.
export function useRefreshGroups(slug?: string) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.groups.all });
    if (slug) {
      qc.invalidateQueries({ queryKey: queryKeys.groups.detail(slug) });
      qc.invalidateQueries({ queryKey: queryKeys.groups.members(slug) });
      qc.invalidateQueries({ queryKey: queryKeys.groups.invites(slug) });
    }
  };
}

// -----------------------------------------------------------------------------
// Group lifecycle mutations
// -----------------------------------------------------------------------------

export function useCreateGroup() {
  const refresh = useRefreshGroups();
  return useMutation({
    mutationFn: (body: GroupBody) => createGroup(body),
    onSuccess: refresh,
  });
}

export function useUpdateGroup(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (body: GroupBody) => updateGroup(slug, body),
    onSuccess: refresh,
  });
}

export function useDeleteGroup(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: () => deleteGroup(slug),
    onSuccess: refresh,
  });
}

export function usePublishGroup(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: () => publishGroup(slug),
    onSuccess: refresh,
  });
}

// -----------------------------------------------------------------------------
// Membership mutations
// -----------------------------------------------------------------------------

export function useJoinGroup(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (body?: JoinBody) => joinGroup(slug, body),
    onSuccess: refresh,
  });
}

export function useLeaveGroup(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: () => leaveGroup(slug),
    onSuccess: refresh,
  });
}

export function useUpdateMemberRole(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (vars: { username: string; body: MemberRoleBody }) =>
      updateMemberRole(slug, vars.username, vars.body),
    onSuccess: refresh,
  });
}

export function useRemoveMember(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (username: string) => removeMember(slug, username),
    onSuccess: refresh,
  });
}

export function useBanMember(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (vars: { username: string; body?: BanBody }) =>
      banMember(slug, vars.username, vars.body),
    onSuccess: refresh,
  });
}

export function useApproveJoinRequest(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (username: string) => approveJoinRequest(slug, username),
    onSuccess: refresh,
  });
}

export function useRejectJoinRequest(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (username: string) => rejectJoinRequest(slug, username),
    onSuccess: refresh,
  });
}

// -----------------------------------------------------------------------------
// Direct add + invite mutations
// -----------------------------------------------------------------------------

export function useAddMember(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (body: AddMemberBody) => addMember(slug, body),
    onSuccess: refresh,
  });
}

export function useCreateInvite(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (body?: CreateInviteBody) => createInvite(slug, body),
    onSuccess: refresh,
  });
}

export function useRevokeInvite(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (id: number) => revokeInvite(slug, id),
    onSuccess: refresh,
  });
}

// Accepting an invite is addressed by token and admits the caller to whichever
// group the token belongs to, so it invalidates the whole groups cache.
export function useAcceptInvite() {
  const refresh = useRefreshGroups();
  return useMutation({
    mutationFn: (token: string) => acceptInvite(token),
    onSuccess: refresh,
  });
}

// Previews an invite by token on the public accept page.
export function useInvitePreview(token: string | undefined) {
  return useQuery({
    queryKey: queryKeys.groups.invites(token),
    queryFn: () => getInvite(token!),
    enabled: !!token,
  });
}

// Uploads a group logo or cover, then persists the returned URL on the group.
export function useUploadGroupImage(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (vars: { kind: GroupImageKind; file: File }) =>
      uploadGroupImage(slug, vars.kind, vars.file),
    onSuccess: refresh,
  });
}

// -----------------------------------------------------------------------------
// Rule mutations
// -----------------------------------------------------------------------------

export function useAddGroupRule(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (body: GroupRuleBody) => addGroupRule(slug, body),
    onSuccess: refresh,
  });
}

export function useUpdateGroupRule(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (vars: { id: number; body: GroupRuleBody }) =>
      updateGroupRule(slug, vars.id, vars.body),
    onSuccess: refresh,
  });
}

export function useDeleteGroupRule(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (id: number) => deleteGroupRule(slug, id),
    onSuccess: refresh,
  });
}

// -----------------------------------------------------------------------------
// Group-scoped event creation
// -----------------------------------------------------------------------------

export function useCreateGroupEvent(slug: string) {
  const refresh = useRefreshGroups(slug);
  return useMutation({
    mutationFn: (body: GroupEventBody) => createGroupEvent(slug, body),
    onSuccess: refresh,
  });
}
