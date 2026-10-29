import { getCardContent } from '@/components/blog/getBlogContent';
import { discussionHeadline } from '@/lib/discussionSeo';
import { formatEventCardWhen } from '@/lib/eventTime';
import { normalizeSeoText } from '@/lib/seo';
import type { Blog } from '@/services/blog/blogTypes';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import type { EventItem } from '@/services/events/eventTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';
import type { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';

export type LinkPreview = {
  label: string;
  title: string;
  description?: string;
  image?: string;
  avatarUsername?: string;
};

const DESCRIPTION_MAX = 120;

function joinParts(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(' · ') || undefined;
}

function text(value: string | null | undefined, max = DESCRIPTION_MAX) {
  return normalizeSeoText(value ?? '', max) || undefined;
}

export function blogPreview(blog?: Blog): LinkPreview | null {
  if (!blog || blog.is_draft || blog.audience === 'group_only') return null;
  const { titleContent, descriptionContent, imageContent } = getCardContent({
    blog,
  });
  const title = text(titleContent, 100);
  if (!title) return null;
  const description = text(descriptionContent);
  return {
    label: 'Blog',
    title,
    description: description === title ? undefined : description,
    image: imageContent ?? undefined,
  };
}

export function eventPreview(
  event?: EventItem,
  viewingTimezone?: string
): LinkPreview | null {
  if (!event || event.status === 'draft') return null;
  if (event.visibility && event.visibility !== 'public') return null;
  return {
    label: 'Event',
    title: event.title,
    description:
      formatEventCardWhen(
        event.start_time,
        viewingTimezone ?? event.timezone
      ) || text(event.description),
    image: event.cover_image || undefined,
  };
}

export function groupPreview(group?: GroupItem): LinkPreview | null {
  if (!group || group.visibility !== 'public' || group.status !== 'published') {
    return null;
  }
  const members =
    group.member_count === undefined
      ? undefined
      : `${group.member_count} ${group.member_count === 1 ? 'member' : 'members'}`;
  return {
    label: 'Group',
    title: group.name,
    description: joinParts(members, text(group.description)),
    image: group.logo_image || group.cover_image || undefined,
  };
}

export function profilePreview(
  user?: GetPublicUserProfileApiResponse
): LinkPreview | null {
  if (!user?.username) return null;
  const name = [user.first_name, user.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');
  return {
    label: 'Profile',
    title: name || `@${user.username}`,
    description: joinParts(
      name ? `@${user.username}` : undefined,
      text(user.bio)
    ),
    avatarUsername: user.username,
  };
}

export function discussionPreview(post?: Discussion): LinkPreview | null {
  if (!post || post.status !== 'visible' || post.audience === 'group_only') {
    return null;
  }
  const author = post.author_gone ? '' : (post.author_username ?? '').trim();
  return {
    label: 'Discussion',
    title: discussionHeadline(post.body),
    description: author ? `@${author}` : 'Deleted account',
    avatarUsername: author || undefined,
  };
}
