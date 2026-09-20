import type {
  HistorySortOrder,
  HistoryStatusFilter,
} from '@/features/studio/history/HistoryFilterBar';
import { extractPlatforms } from '@/features/studio/queue/QueueItem';
import type { SocialPost, SocialPostList } from '@/features/studio/types';

export function extractPosts(
  data: SocialPostList | SocialPost[] | null | undefined
): SocialPost[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items ?? data.posts ?? [];
}

export function filterAndSortPosts(
  posts: SocialPost[],
  searchQuery: string,
  statusFilter: HistoryStatusFilter,
  platformFilter: string,
  sortOrder: HistorySortOrder
): SocialPost[] {
  const filtered = posts.filter((post) => {
    // Search filter
    if (searchQuery.trim()) {
      const text = post.base_text || post.text || '';
      if (!text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
    }

    // Status filter
    if (statusFilter === 'published') {
      const isPub =
        post.status === 'published' ||
        post.status === 'published_with_errors' ||
        post.state === 'published' ||
        post.state === 'published_with_errors';
      if (!isPub) return false;
    } else if (statusFilter === 'failed') {
      const isFailed = post.status === 'failed' || post.state === 'failed';
      if (!isFailed) return false;
    } else if (statusFilter === 'draft') {
      const isDraft = post.status === 'draft' || post.state === 'draft';
      if (!isDraft) return false;
    }

    // Platform filter
    if (platformFilter !== 'all') {
      const platforms = extractPlatforms(post);
      if (!platforms.includes(platformFilter)) {
        return false;
      }
    }

    return true;
  });

  if (sortOrder) {
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
      const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }

  return filtered;
}
