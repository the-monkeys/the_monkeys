import { BlogAudience } from '@/services/blog/blogTypes';
import { GroupItem } from '@/services/groups/groupsTypes';
import axios, { AxiosError } from 'axios';

export type BlogPublicationSelection = {
  group: GroupItem | null;
  audience: BlogAudience;
};

export type BlogPublicationScope = {
  group_slug?: string;
  audience?: BlogAudience;
};

export const activePublishGroups = (groups: GroupItem[] = []) =>
  groups.filter((group) => group.viewer_member_status === 'active');

export const effectiveBlogAudience = (
  group: GroupItem | null,
  requested: BlogAudience = 'public'
): BlogAudience => {
  if (!group) return 'public';
  if (group.visibility === 'private' || group.visibility === 'unlisted') {
    return 'group_only';
  }
  return requested === 'group_only' ? 'group_only' : 'public';
};

export const publicationScope = (
  group: GroupItem | null,
  requested: BlogAudience
): BlogPublicationScope => {
  if (!group) return {};

  return {
    group_slug: group.slug.trim(),
    audience: effectiveBlogAudience(group, requested),
  };
};

export function blogApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = (error as AxiosError<{ error?: string; message?: string }>)
      .response?.data;
    return data?.error || data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong';
}
