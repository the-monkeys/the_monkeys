import { IconName } from '@/components/icon';

export const HOME_ROUTE = '/';
export const LOGIN_ROUTE = '/auth/login';
export const FEED_ROUTE = '/feed';
export const ABOUT_ROUTE = '/about';
export const ACTIVITY_ROUTE = '/activity';
export const LIBRARY_ROUTE = '/library';
export const DRAFT_ROUTE = '/library?source=drafts';
export const SCHEDULE_ROUTE = '/library?source=scheudle';
export const BOOKMARK_ROUTE = '/library?source=bookmarks';
export const BLOG_ROUTE = '/blog';
export const SNAPSHOT_ROUTE = '/snapshot';
export const EXPLORE_TOPICS_ROUTE = '/topics/explore';
export const TOPIC_ROUTE = '/topics';
export const TOPIC_SITEMAP_ROUTE = '/topics/sitemap.xml';
export const NOTIFICATIONS_ROUTE = '/notifications';
export const SETTINGS_ROUTE = '/settings';
export const CREATE_ROUTE = '/create';
export const EVENTS_ROUTE = '/events';
export const GROUPS_ROUTE = '/groups';
export const PARENT_COMPANY_ROUTE = 'https://buddhicintaka.com/';

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  requiresAuth?: boolean;
};

export const DISCOVER_ITEMS: NavItem[] = [
  {
    href: FEED_ROUTE,
    label: 'For You',
    icon: 'RiNewspaper',
    requiresAuth: true,
  },
  { href: EVENTS_ROUTE, label: 'Events', icon: 'RiGroup' },
  {
    // Studio (Image template + X screenshot) is open to everyone; only the
    // Business Card tab inside it is gated (see CardsAuthGuard).
    href: '/snapshot/new',
    label: 'Studio',
    icon: 'RiCameraLens',
  },
  {
    href: BOOKMARK_ROUTE,
    label: 'Library',
    icon: 'RiBookShelf',
    requiresAuth: true,
  },
  {
    href: SETTINGS_ROUTE,
    label: 'Settings',
    icon: 'RiSettings3',
    requiresAuth: true,
  },
  { href: EXPLORE_TOPICS_ROUTE, label: 'Topics', icon: 'RiCompass' },
];
