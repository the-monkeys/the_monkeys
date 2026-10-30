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

export function createMenuItems(
  variant: CreateMenuVariant,
  options?: { includeEvent?: boolean }
): CreateMenuItem[] {
  const items = variant === 'site' ? SITE_ITEMS : GROUP_ITEMS;
  if (variant === 'group' && options?.includeEvent === false) {
    return items.filter((item) => item.id !== 'event');
  }
  return [...items];
}
