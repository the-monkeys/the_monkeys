export const GROUP_COMMUNITY_TABS = [
  'posts',
  'events',
  'about',
  'members',
  'requests',
  'invites',
] as const;

export type GroupCommunityTab = (typeof GROUP_COMMUNITY_TABS)[number];

export const DEFAULT_GROUP_COMMUNITY_TAB: GroupCommunityTab = 'posts';

const TAB_ALIASES: Record<string, GroupCommunityTab> = {
  blogs: 'posts',
};

const STAFF_ONLY_TABS = new Set<GroupCommunityTab>(['requests', 'invites']);

export function groupCommunityTabs(staff: boolean): GroupCommunityTab[] {
  if (staff) return [...GROUP_COMMUNITY_TABS];
  return GROUP_COMMUNITY_TABS.filter((tab) => !STAFF_ONLY_TABS.has(tab));
}

export function parseGroupCommunityTab(
  hash: string,
  staff: boolean
): GroupCommunityTab {
  const raw = hash.replace(/^#/, '').trim().toLowerCase();
  if (!raw) return DEFAULT_GROUP_COMMUNITY_TAB;
  const mapped = TAB_ALIASES[raw] ?? raw;
  const allowed = groupCommunityTabs(staff);
  return allowed.includes(mapped as GroupCommunityTab)
    ? (mapped as GroupCommunityTab)
    : DEFAULT_GROUP_COMMUNITY_TAB;
}

/** Default tab uses no fragment so crawlers keep a single canonical group URL. */
export function groupCommunityHash(tab: GroupCommunityTab): string {
  return tab === DEFAULT_GROUP_COMMUNITY_TAB ? '' : `#${tab}`;
}

export function groupCommunityLocation(
  pathname: string,
  search: string,
  tab: GroupCommunityTab
): string {
  return `${pathname}${search}${groupCommunityHash(tab)}`;
}
