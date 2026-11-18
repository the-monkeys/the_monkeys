import { discussionInstantMs } from '@/lib/discussionTime';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function list(value: unknown, field: string): unknown[] {
  return record(value) && Array.isArray(value[field]) ? value[field] : [];
}

function count(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

/** Active discussions within the API's bounded recent public page, not all-time rankings. */
export function selectLandingDiscussions(value: unknown): Discussion[] {
  const seen = new Set<string>();
  const posts: Discussion[] = [];
  for (const raw of list(value, 'discussions')) {
    if (
      !record(raw) ||
      raw.status !== 'visible' ||
      typeof raw.public_id !== 'string' ||
      !raw.public_id.trim() ||
      typeof raw.body !== 'string' ||
      !raw.body.trim() ||
      (raw.author_username !== undefined &&
        typeof raw.author_username !== 'string') ||
      (raw.group_slug !== undefined && typeof raw.group_slug !== 'string') ||
      !(
        raw.audience === 'public' ||
        (raw.audience === undefined && !raw.group_slug)
      ) ||
      seen.has(raw.public_id)
    )
      continue;
    seen.add(raw.public_id);
    const post = raw as Discussion;
    const created = discussionInstantMs(post.created_at);
    posts.push({
      ...post,
      like_count: count(post.like_count),
      reply_count: count(post.reply_count),
      created_at: Number.isFinite(new Date(created).getTime())
        ? post.created_at
        : undefined,
    });
  }
  return posts
    .sort(
      (a, b) =>
        (b.like_count ?? 0) +
          (b.reply_count ?? 0) -
          ((a.like_count ?? 0) + (a.reply_count ?? 0)) ||
        (discussionInstantMs(b.created_at) || 0) -
          (discussionInstantMs(a.created_at) || 0)
    )
    .slice(0, 3);
}

export function selectLandingGroups(value: unknown): GroupItem[] {
  const seen = new Set<number>();
  const groups: GroupItem[] = [];
  for (const raw of list(value, 'groups')) {
    if (
      !record(raw) ||
      raw.visibility !== 'public' ||
      raw.status !== 'published' ||
      typeof raw.id !== 'number' ||
      !Number.isSafeInteger(raw.id) ||
      raw.id <= 0 ||
      typeof raw.name !== 'string' ||
      !raw.name.trim() ||
      typeof raw.slug !== 'string' ||
      !raw.slug.trim() ||
      seen.has(raw.id)
    )
      continue;
    seen.add(raw.id);
    groups.push({
      ...(raw as GroupItem),
      description:
        typeof raw.description === 'string' ? raw.description : undefined,
      logo_image:
        typeof raw.logo_image === 'string' ? raw.logo_image : undefined,
    });
    if (groups.length === 2) break;
  }
  return groups;
}
