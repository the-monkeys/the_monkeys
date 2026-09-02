import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import { fetcher } from '@/services/fetcher';
import axios, { AxiosError } from 'axios';

import {
  AddMemberBody,
  BanBody,
  BasicResp,
  CreateInviteBody,
  GroupBody,
  GroupEventBody,
  GroupEventResp,
  GroupImageKind,
  GroupImageResp,
  GroupListFilters,
  GroupResp,
  GroupRuleBody,
  GroupRuleResp,
  InviteResp,
  JoinBody,
  ListGroupMembersResp,
  ListGroupsResp,
  ListInvitesResp,
  MemberListParams,
  MemberRoleBody,
} from './groupsTypes';

const root = '/groups';

export function groupError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = (err as AxiosError<{ error?: string; message?: string }>)
      .response?.data;
    return data?.error || data?.message || err.message;
  }
  return 'Something went wrong';
}

function qs(filters: GroupListFilters = {}): string {
  const p = new URLSearchParams();
  if (filters.limit) p.set('limit', String(filters.limit));
  if (filters.offset) p.set('offset', String(filters.offset));
  if (filters.q) p.set('q', filters.q);
  if (filters.status) p.set('status', filters.status);
  if (filters.country) p.set('country', filters.country);
  if (filters.region) p.set('region', filters.region);
  if (filters.city) p.set('city', filters.city);
  // topics repeats the key so the gateway reads it as QueryArray.
  filters.topics?.forEach((t) => t && p.append('topics', t));
  if (filters.user_lat) p.set('user_lat', String(filters.user_lat));
  if (filters.user_lng) p.set('user_lng', String(filters.user_lng));
  if (filters.radius) p.set('radius', String(filters.radius));
  if (filters.public_only) p.set('public_only', '1');
  const s = p.toString();
  return s ? `?${s}` : '';
}

const seg = (v: string) => encodeURIComponent(v);

// -----------------------------------------------------------------------------
// Public reads (auth cookie is still forwarded, so viewer_role hydrates when
// the caller is signed in).
// -----------------------------------------------------------------------------

export const listGroups = (filters?: GroupListFilters) =>
  fetcher(`${root}${qs(filters)}`) as Promise<ListGroupsResp>;

export const listUserGroups = (username: string, filters?: GroupListFilters) =>
  fetcher(
    `${root}/user/${seg(username)}${qs(filters)}`
  ) as Promise<ListGroupsResp>;

export const getGroup = (slug: string) =>
  axiosInstanceNoAuth
    .get<GroupResp>(`${root}/${seg(slug)}`)
    .then((r) => r.data);

// -----------------------------------------------------------------------------
// Group lifecycle
// -----------------------------------------------------------------------------

export const createGroup = (body: GroupBody) =>
  axiosInstance.post<GroupResp>(root, body).then((r) => r.data);

export const updateGroup = (slug: string, body: GroupBody) =>
  axiosInstance
    .put<GroupResp>(`${root}/${seg(slug)}`, body)
    .then((r) => r.data);

export const deleteGroup = (slug: string) =>
  axiosInstance.delete<BasicResp>(`${root}/${seg(slug)}`).then((r) => r.data);

export const publishGroup = (slug: string) =>
  axiosInstance
    .post<GroupResp>(`${root}/${seg(slug)}/publish`)
    .then((r) => r.data);

// -----------------------------------------------------------------------------
// Membership
// -----------------------------------------------------------------------------

export const joinGroup = (slug: string, body?: JoinBody) =>
  axiosInstance
    .post<BasicResp>(`${root}/${seg(slug)}/join`, body ?? {})
    .then((r) => r.data);

export const leaveGroup = (slug: string) =>
  axiosInstance
    .delete<BasicResp>(`${root}/${seg(slug)}/membership`)
    .then((r) => r.data);

export const listMembers = (slug: string, params?: MemberListParams) =>
  axiosInstance
    .get<ListGroupMembersResp>(`${root}/${seg(slug)}/members`, { params })
    .then((r) => r.data);

export const updateMemberRole = (
  slug: string,
  username: string,
  body: MemberRoleBody
) =>
  axiosInstance
    .put<BasicResp>(`${root}/${seg(slug)}/members/${seg(username)}/role`, body)
    .then((r) => r.data);

export const removeMember = (slug: string, username: string) =>
  axiosInstance
    .delete<BasicResp>(`${root}/${seg(slug)}/members/${seg(username)}`)
    .then((r) => r.data);

export const banMember = (slug: string, username: string, body?: BanBody) =>
  axiosInstance
    .post<BasicResp>(
      `${root}/${seg(slug)}/members/${seg(username)}/ban`,
      body ?? {}
    )
    .then((r) => r.data);

export const approveJoinRequest = (slug: string, username: string) =>
  axiosInstance
    .post<BasicResp>(`${root}/${seg(slug)}/members/${seg(username)}/approve`)
    .then((r) => r.data);

export const rejectJoinRequest = (slug: string, username: string) =>
  axiosInstance
    .post<BasicResp>(`${root}/${seg(slug)}/members/${seg(username)}/reject`)
    .then((r) => r.data);

// -----------------------------------------------------------------------------
// Direct add + invite links
// -----------------------------------------------------------------------------

export const addMember = (slug: string, body: AddMemberBody) =>
  axiosInstance
    .post<BasicResp>(`${root}/${seg(slug)}/members`, body)
    .then((r) => r.data);

export const createInvite = (slug: string, body?: CreateInviteBody) =>
  axiosInstance
    .post<InviteResp>(`${root}/${seg(slug)}/invites`, body ?? {})
    .then((r) => r.data);

export const listInvites = (slug: string) =>
  axiosInstance
    .get<ListInvitesResp>(`${root}/${seg(slug)}/invites`)
    .then((r) => r.data);

export const revokeInvite = (slug: string, id: number) =>
  axiosInstance
    .delete<BasicResp>(`${root}/${seg(slug)}/invites/${id}`)
    .then((r) => r.data);

// Invite links are addressed by token on a separate top-level surface so the
// token never collides with the group :slug wildcard. Preview is public; accept
// carries the auth cookie.
export const getInvite = (token: string) =>
  axiosInstanceNoAuth
    .get<InviteResp>(`/group-invites/${seg(token)}`)
    .then((r) => r.data);

export const acceptInvite = (token: string) =>
  axiosInstance
    .post<BasicResp>(`/group-invites/${seg(token)}/accept`)
    .then((r) => r.data);

// -----------------------------------------------------------------------------
// Group imagery. The write route lives on the /groups surface so it reuses the
// group permission guard; it returns a domain-free URL the caller then persists
// on the group via updateGroup.
// -----------------------------------------------------------------------------

export const uploadGroupImage = (
  slug: string,
  kind: GroupImageKind,
  file: File
) => {
  const form = new FormData();
  form.append('image', file);
  return axiosInstance
    .post<GroupImageResp>(`${root}/${seg(slug)}/images/${kind}`, form)
    .then((r) => r.data);
};

// -----------------------------------------------------------------------------
// Rules
// -----------------------------------------------------------------------------

export const addGroupRule = (slug: string, body: GroupRuleBody) =>
  axiosInstance
    .post<GroupRuleResp>(`${root}/${seg(slug)}/rules`, body)
    .then((r) => r.data);

export const updateGroupRule = (
  slug: string,
  id: number,
  body: GroupRuleBody
) =>
  axiosInstance
    .put<GroupRuleResp>(`${root}/${seg(slug)}/rules/${id}`, body)
    .then((r) => r.data);

export const deleteGroupRule = (slug: string, id: number) =>
  axiosInstance
    .delete<BasicResp>(`${root}/${seg(slug)}/rules/${id}`)
    .then((r) => r.data);

// -----------------------------------------------------------------------------
// Group-scoped event creation (delegated to the events service).
// -----------------------------------------------------------------------------

export const createGroupEvent = (slug: string, body: GroupEventBody) =>
  axiosInstance
    .post<GroupEventResp>(`${root}/${seg(slug)}/events`, body)
    .then((r) => r.data);
