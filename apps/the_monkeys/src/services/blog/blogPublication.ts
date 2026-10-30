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

/** Explicit values are required because each draft save replaces its document. */
export type DraftPublicationScope = Required<BlogPublicationScope>;

export function draftPublicationScope(
  draft?: BlogPublicationScope,
  preferredGroupSlug = ''
): DraftPublicationScope {
  const slug = (draft?.group_slug ?? preferredGroupSlug).trim();
  return {
    group_slug: slug,
    audience: slug
      ? draft?.audience === 'public'
        ? 'public'
        : 'group_only'
      : 'public',
  };
}

export function draftScopeForSelection(
  selection: BlogPublicationSelection
): DraftPublicationScope {
  return {
    group_slug: selection.group?.slug.trim() ?? '',
    audience: effectiveBlogAudience(selection.group, selection.audience),
  };
}

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

/** Group create-post defaults to members only, then follows the usual audience rules. */
export function publicationForGroup(
  groups: GroupItem[] = [],
  slug?: string | null
): BlogPublicationSelection | null {
  const wanted = slug?.trim();
  if (!wanted) return null;
  const group =
    activePublishGroups(groups).find((item) => item.slug === wanted) ?? null;
  if (!group) return null;
  return {
    group,
    audience: effectiveBlogAudience(group, 'group_only'),
  };
}

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
