import { IconName } from '@/components/icon';

export const HOME_ROUTE = '/';
export const CREATE_ROUTE = '/create';
export const LOGIN_ROUTE = '/auth/login';
export const FEED_ROUTE = '/feed';
export const ABOUT_ROUTE = '/about';
export const ACTIVITY_ROUTE = '/activity';
export const LIBRARY_ROUTE = '/library';
export const BLOG_ROUTE = '/blog';
export const EXPLORE_TOPICS_ROUTE = '/topics/explore';
export const TOPIC_ROUTE = '/topics';
export const TOPIC_SITEMAP_ROUTE = '/topics/sitemap.xml';
export const NOTIFICATIONS_ROUTE = '/notifications';
export const SETTINGS_ROUTE = '/settings';
export const PARENT_COMPANY_ROUTE = 'https://buddhicintaka.com/';

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  requiresAuth?: boolean;
};

export const DISCOVER_ITEMS: NavItem[] = [
  { href: HOME_ROUTE, label: 'Feed', icon: 'RiNewspaper' },
  { href: FEED_ROUTE, label: 'For You', icon: 'RiBard', requiresAuth: true },
  { href: EXPLORE_TOPICS_ROUTE, label: 'Topics', icon: 'RiCompass' },
  {
    href: ACTIVITY_ROUTE,
    label: 'Activity',
    icon: 'RiMenu4',
    requiresAuth: true,
  },
  {
    href: SETTINGS_ROUTE,
    label: 'Settings',
    icon: 'RiSettings3',
    requiresAuth: true,
  },
];
