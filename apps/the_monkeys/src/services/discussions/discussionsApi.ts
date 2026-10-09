import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import axios from 'axios';

import {
  Discussion,
  DiscussionAudience,
  DiscussionList,
  DiscussionReply,
  DiscussionScope,
} from './discussionsTypes';

const seg = (v: string) => encodeURIComponent(v);

function listPath(scope: DiscussionScope, beforeId?: string): string {
  const base =
    scope.kind === 'site'
      ? '/discussions'
      : `/groups/${seg(scope.slug)}/discussions`;
  if (!beforeId) return base;
  return `${base}?before_id=${seg(beforeId)}`;
}

export function discussionError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { error?: string; message?: string }
      | undefined;
    return data?.error || data?.message || 'Something went wrong.';
  }
  return 'Something went wrong.';
}

export const listDiscussions = (scope: DiscussionScope, beforeId?: string) =>
  axiosInstanceNoAuth
    .get<DiscussionList>(listPath(scope, beforeId))
    .then((r) => r.data);

export const getDiscussion = (id: string) =>
  axiosInstanceNoAuth
    .get<Discussion>(`/discussions/${seg(id)}`)
    .then((r) => r.data);

export const createDiscussion = (
  scope: DiscussionScope,
  body: string,
  audience?: DiscussionAudience
) => {
  const path =
    scope.kind === 'site'
      ? '/discussions'
      : `/groups/${seg(scope.slug)}/discussions`;
  return axiosInstance
    .post<Discussion>(path, { body, audience })
    .then((r) => r.data);
};

export const replyToDiscussion = (id: string, body: string, parentId = '') =>
  axiosInstance
    .post<DiscussionReply>(`/discussions/${seg(id)}/replies`, {
      body,
      parent_reply_id: parentId,
    })
    .then((r) => r.data);

export const likeDiscussion = (id: string) =>
  axiosInstance
    .post<{ liked: boolean }>(`/discussions/${seg(id)}/like`)
    .then((r) => r.data);

export const editDiscussion = (id: string, body: string) =>
  axiosInstance
    .put<Discussion>(`/discussions/${seg(id)}`, { body })
    .then((r) => r.data);

export const deleteDiscussion = (id: string) =>
  axiosInstance
    .delete<Discussion>(`/discussions/${seg(id)}`)
    .then((r) => r.data);
