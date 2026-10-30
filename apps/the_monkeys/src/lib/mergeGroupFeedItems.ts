import { discussionInstantMs } from '@/lib/discussionTime';
import type { Blog } from '@/services/blog/blogTypes';
import type { Discussion } from '@/services/discussions/discussionsTypes';

export type GroupFeedItem =
  | { kind: 'blog'; id: string; createdAtMs: number; blog: Blog }
  | {
      kind: 'discussion';
      id: string;
      createdAtMs: number;
      discussion: Discussion;
    };

function blogMs(blog: Blog): number {
  const ms = Date.parse(blog.published_time);
  return Number.isFinite(ms) ? ms : 0;
}

export function mergeGroupFeedItems(
  blogs: Blog[],
  discussions: Discussion[]
): GroupFeedItem[] {
  const items: GroupFeedItem[] = [
    ...blogs.map((blog) => ({
      kind: 'blog' as const,
      id: blog.blog_id,
      createdAtMs: blogMs(blog),
      blog,
    })),
    ...discussions.map((discussion) => {
      const ms = discussionInstantMs(discussion.created_at);
      return {
        kind: 'discussion' as const,
        id: discussion.public_id,
        createdAtMs: Number.isFinite(ms) ? ms : 0,
        discussion,
      };
    }),
  ];
  return items.sort((a, b) => {
    if (b.createdAtMs !== a.createdAtMs) return b.createdAtMs - a.createdAtMs;
    if (a.kind !== b.kind) return a.kind < b.kind ? -1 : 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}
