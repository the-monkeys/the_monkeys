import { API_URL } from '@/constants/api';
import { discussionInstantMs } from '@/lib/discussionTime';
import type { Block, Blog } from '@/services/blog/blogTypes';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';

/** Anonymous previews only; never seed a viewer's infinite-query cache. */
export type GroupPublicActivity = {
  slug: string;
  blogs?: Blog[];
  discussions?: Discussion[];
};

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue =>
  value && typeof value === 'object' ? (value as RecordValue) : {};
const text = (value: unknown) => (typeof value === 'string' ? value : '');
const flagged = (value: unknown) =>
  value === true || value === 1 || value === 'true';

function publicChild(post: RecordValue, slug: string) {
  return (
    (!post.audience || post.audience === 'public') &&
    (!post.visibility || post.visibility === 'public') &&
    (!post.group_slug || post.group_slug === slug) &&
    ![
      'is_draft',
      'is_scheduled',
      'is_archived',
      'is_removed',
      'is_deleted',
    ].some((key) => flagged(post[key])) &&
    !post.removed_at &&
    !post.deleted_at
  );
}

export function isPublicGroupBlog(value: unknown, slug: string): boolean {
  const post = record(value);
  const published = Date.parse(text(post.published_time));
  return (
    publicChild(post, slug) &&
    (!post.status || post.status === 'published') &&
    (!Number.isFinite(published) || published <= Date.now())
  );
}

export function isPublicGroupDiscussion(value: unknown, slug: string): boolean {
  const post = record(value);
  const created = discussionInstantMs(
    post.created_at as Discussion['created_at']
  );
  return (
    publicChild(post, slug) &&
    post.status === 'visible' &&
    (!Number.isFinite(created) || created <= Date.now())
  );
}

function previewBlog(value: unknown, slug: string): Blog | undefined {
  const post = record(value);
  const document = record(post.blog);
  if (!text(post.blog_id) || !isPublicGroupBlog(post, slug)) return;
  if (!Array.isArray(document.blocks) || !document.blocks.length) return;
  const blocks = document.blocks.map((block) => record(block));
  // Keep the historical card's first block, first excerpt and first image,
  // plus its canonical header if different. Never serialize the full document.
  const excerpt = blocks.findIndex((block, i) => {
    const data = record(block.data);
    return (
      i > 0 &&
      ['list', 'quote', 'paragraph', 'header'].includes(text(block.type)) &&
      (text(data.text) || (Array.isArray(data.items) && data.items.length))
    );
  });
  const image = blocks.findIndex(
    (block) =>
      block.type === 'image' && text(record(record(block.data).file).url)
  );
  const header = blocks.findIndex(
    (block) => block.type === 'header' && text(record(block.data).text)
  );
  const selected = new Set([0, excerpt, image, header]);
  const preview = blocks.flatMap((block, i): Block[] => {
    if (!selected.has(i)) return [];
    const data = record(block.data);
    return [
      {
        id: text(block.id),
        type: text(block.type),
        author: [],
        time: 0,
        data: {
          ...(typeof data.text === 'string'
            ? { text: data.text.slice(0, 1000) }
            : {}),
          ...(typeof data.level === 'number' ? { level: data.level } : {}),
          ...(Array.isArray(data.items)
            ? {
                items: data.items
                  .filter((item): item is string => typeof item === 'string')
                  .slice(0, 10)
                  .map((item) => item.slice(0, 200)),
              }
            : {}),
          ...(block.type === 'image'
            ? { file: { url: text(record(data.file).url) } }
            : {}),
        },
      },
    ];
  });
  const likes =
    typeof post.like_count === 'number'
      ? post.like_count
      : typeof post.LikeCount === 'number'
        ? post.LikeCount
        : 0;
  return {
    blog_id: text(post.blog_id),
    owner_account_id: text(post.owner_account_id),
    published_time: text(post.published_time),
    is_draft: false,
    audience: 'public',
    group_slug: slug,
    tags: Array.isArray(post.tags)
      ? post.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    LikeCount: likes,
    like_count: likes,
    BookmarkCount: 0,
    bookmark_count: 0,
    blog: {
      time: typeof document.time === 'number' ? document.time : 0,
      blocks: preview,
    },
  };
}

function previewDiscussion(
  value: unknown,
  slug: string
): Discussion | undefined {
  const post = record(value);
  if (
    !text(post.public_id) ||
    typeof post.body !== 'string' ||
    !isPublicGroupDiscussion(post, slug)
  )
    return;
  const created = post.created_at;
  const seconds = record(created).seconds;
  return {
    public_id: text(post.public_id),
    body: post.body,
    status: 'visible',
    audience: 'public',
    group_slug: slug,
    author_username: text(post.author_username),
    author_gone: post.author_gone === true,
    ...(typeof created === 'string'
      ? { created_at: created }
      : typeof seconds === 'string' || typeof seconds === 'number'
        ? { created_at: { seconds } }
        : {}),
    ...(typeof post.like_count === 'number'
      ? { like_count: post.like_count }
      : {}),
    ...(typeof post.reply_count === 'number'
      ? { reply_count: post.reply_count }
      : {}),
  };
}

export async function loadGroupPublicActivity(
  group: GroupItem
): Promise<GroupPublicActivity | undefined> {
  if (
    !API_URL ||
    !group.slug ||
    group.visibility !== 'public' ||
    (group.status && group.status !== 'published')
  )
    return;
  const base = `${API_URL.replace(/\/$/, '')}/groups/${encodeURIComponent(group.slug)}`;
  async function read(
    kind: 'blogs' | 'discussions'
  ): Promise<unknown[] | undefined> {
    try {
      const response = await fetch(`${base}/${kind}?limit=20&offset=0`, {
        cache: 'no-store',
        credentials: 'omit',
        redirect: 'error',
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return;
      const values = record(await response.json())[kind];
      return Array.isArray(values) ? values.slice(0, 20) : undefined;
    } catch {
      return undefined;
    }
  }
  const [blogs, discussions] = await Promise.all([
    read('blogs'),
    read('discussions'),
  ]);
  return {
    slug: group.slug,
    ...(blogs
      ? { blogs: blogs.flatMap((post) => previewBlog(post, group.slug) ?? []) }
      : {}),
    ...(discussions
      ? {
          discussions: discussions.flatMap(
            (post) => previewDiscussion(post, group.slug) ?? []
          ),
        }
      : {}),
  };
}
