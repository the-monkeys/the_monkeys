import type { IconName } from '@/components/icon';

export type CreateMenuVariant = 'site' | 'group';
export type CreateMenuItemId = 'discussion' | 'post' | 'event' | 'group';

export type CreateMenuItem = {
  id: CreateMenuItemId;
  label: string;
  icon: IconName;
};

const SITE_ITEMS: CreateMenuItem[] = [
  { id: 'discussion', label: 'Create Discussion', icon: 'RiChat1' },
  { id: 'post', label: 'Create Post', icon: 'RiDraft' },
  { id: 'event', label: 'Create Event', icon: 'RiCalendar' },
  { id: 'group', label: 'Create Group', icon: 'RiGroup' },
];

const GROUP_ITEMS: CreateMenuItem[] = [
  { id: 'discussion', label: 'Create Discussion', icon: 'RiChat1' },
  { id: 'post', label: 'Create Post', icon: 'RiDraft' },
  { id: 'event', label: 'Create Event', icon: 'RiCalendar' },
];

export function createMenuItems(variant: CreateMenuVariant): CreateMenuItem[] {
  return variant === 'site' ? [...SITE_ITEMS] : [...GROUP_ITEMS];
}
