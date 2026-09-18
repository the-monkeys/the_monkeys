import type { SocialPostFilters } from '@/features/studio/types';

export const socialPostKeys = {
  all: ['social-posts'] as const,
  lists: () => [...socialPostKeys.all, 'list'] as const,
  list: (filters: SocialPostFilters = {}) =>
    [...socialPostKeys.lists(), filters] as const,
  detail: (id: string) => [...socialPostKeys.all, 'detail', id] as const,
  accounts: ['social-accounts'] as const,
  media: (filters: Record<string, unknown> = {}) =>
    ['social-media', filters] as const,
};
