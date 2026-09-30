# Group-Scoped Blogs Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the existing post editor, group pages, article pages, profiles, bookmarks, and SEO catalogs to the shipped group-scoped blog contract without exposing members-only content.

**Architecture:** Add a small publication-scope domain module, extend the existing group and blog service layers, and reuse current cards and article routes. Public discovery continues to trust backend collection filtering, while article rendering uses viewer-aware no-store reads and sitemap/RSS normalization adds a defense-in-depth members-only filter.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, TanStack Query 5, Axios, react-select, Tailwind CSS, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-09-19-group-scoped-blogs-design.md`

## Global Constraints

- Work only in the visible repository at `C:\Users\Dave\the_monkeys\the_monkeys_engine\local\the_monkeys` on branch `codex/group-scoped-blogs`.
- Do not stage or modify the unrelated pre-existing landing-page files already shown by `git status`.
- The backend contract is already shipped. Do not change Go services or gateway routes.
- The only new read route is `GET /api/v1/groups/:slug/blogs`; publish and schedule keep their existing URLs.
- Never call `/api/v1/admin/*` from `apps/the_monkeys`.
- Do not add discussions, group chat, or blog-comment APIs.
- Missing `audience` means `public`.
- Only `viewer_member_status === 'active'` permits group selection. Viewer role alone is insufficient.
- Hidden or inaccessible articles always use the existing 404 experience. Never reveal that the article is private or members-only.
- Do not send `group_slug` or `audience` through draft autosave or the draft websocket.
- Viewer-authorized server reads use `cache: 'no-store'` and must never enter a shared cache.
- Public posts retain existing canonical URLs, metadata, JSON-LD, sitemap entries, RSS entries, and social cards.
- Explicit `group_only` records are excluded from sitemap, RSS, public metadata, JSON-LD, and public share controls.
- Do not add em dashes to visible copy or SEO metadata.

## Review Focus

- An unknown or missing audience must follow the backend default and behave as public, while explicit `group_only` remains private.
- Organizer, moderator, or member roles without `viewer_member_status: 'active'` must not make a group selectable.
- An article 404 must prevent activity, likes, bookmark status, counts, profile lookup, and group lookup from starting.
- A temporary upstream 500 must remain distinguishable from a confirmed 404 so recovery behavior does not become a false not-found response.
- A publish response followed by server audience coercion must use the GET-by-id result in the success message and cache state.

---

### Task 1: Publication scope types, rules, errors, and SEO catalog guard

**Files:**
- Create: `apps/the_monkeys/src/services/blog/blogPublication.ts`
- Create: `apps/the_monkeys/__tests__/src/services/blog/blogPublication.test.ts`
- Modify: `apps/the_monkeys/src/services/blog/blogTypes.ts`
- Modify: `apps/the_monkeys/src/lib/seoCatalog.ts`
- Modify: `apps/the_monkeys/src/lib/seoCatalog.test.ts`

**Interfaces:**
- Produces: `BlogAudience` in `blogTypes.ts`, plus `BlogPublicationSelection`, `BlogPublicationScope`, `effectiveBlogAudience`, `activePublishGroups`, `publicationScope`, and `blogApiError` in `blogPublication.ts`.
- Produces: optional `audience` and `group_slug` fields on `Blog`, `MetaBlog`, `FollowingFeed`, and `BlogCardData`.
- Consumes: `GroupItem.visibility` and `GroupItem.viewer_member_status`.

- [ ] **Step 1: Write failing publication-rule and SEO tests**

Create `blogPublication.test.ts` with concrete public, private, unlisted, pending, missing-audience, and error-body cases:

```ts
import {
  activePublishGroups,
  blogApiError,
  effectiveBlogAudience,
  publicationScope,
} from '@/services/blog/blogPublication';
import { GroupItem } from '@/services/groups/groupsTypes';
import { describe, expect, it } from 'vitest';

const group = (overrides: Partial<GroupItem>): GroupItem => ({
  id: 1,
  slug: 'writers',
  name: 'Writers',
  status: 'published',
  visibility: 'public',
  viewer_member_status: 'active',
  ...overrides,
});

describe('blog publication scope', () => {
  it('offers only active memberships regardless of role', () => {
    expect(
      activePublishGroups([
        group({ slug: 'active' }),
        group({ slug: 'pending', viewer_member_status: 'pending' }),
        group({ slug: 'organizer-only', viewer_member_status: '', viewer_role: 'organizer' }),
      ]).map((item) => item.slug)
    ).toEqual(['active']);
  });

  it('forces private and unlisted groups to members only', () => {
    expect(effectiveBlogAudience(group({ visibility: 'private' }), 'public')).toBe('group_only');
    expect(effectiveBlogAudience(group({ visibility: 'unlisted' }), 'public')).toBe('group_only');
  });

  it('omits both fields when no group is selected', () => {
    expect(publicationScope(null, 'group_only')).toEqual({});
  });

  it('reads both supported API error keys', () => {
    expect(blogApiError({ isAxiosError: true, response: { data: { error: 'group not found' } } })).toBe('group not found');
    expect(blogApiError({ isAxiosError: true, response: { data: { message: 'the blog does not exist' } } })).toBe('the blog does not exist');
  });
});
```

Extend `seoCatalog.test.ts` so `normalizePublicPosts` retains missing or public audience and excludes explicit members-only content:

```ts
it('excludes members-only posts from sitemap and RSS catalogs', () => {
  const posts = normalizePublicPosts({
    blogs: [
      { blog_id: 'old', title: 'Old public post' },
      { blog_id: 'public', title: 'Public post', audience: 'public' },
      { blog_id: 'private', title: 'Members post', audience: 'group_only' },
    ],
  });

  expect(posts.map((post) => post.blog_id)).toEqual(['old', 'public']);
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run:

```powershell
pnpm --filter the_monkeys test -- __tests__/src/services/blog/blogPublication.test.ts src/lib/seoCatalog.test.ts
```

Expected: FAIL because `blogPublication.ts` and the new audience fields do not exist and the SEO catalog currently keeps `group_only` records.

- [ ] **Step 3: Implement the domain types and deterministic rules**

Add these fields to the existing blog types and create `blogPublication.ts`:

```ts
import axios, { AxiosError } from 'axios';

import { BlogAudience } from '@/services/blog/blogTypes';
import { GroupItem } from '@/services/groups/groupsTypes';

export type BlogPublicationSelection = {
  group: GroupItem | null;
  audience: BlogAudience;
};

export type BlogPublicationScope = {
  group_slug?: string;
  audience?: BlogAudience;
};

export const activePublishGroups = (groups: GroupItem[] = []) =>
  groups.filter((group) => group.viewer_member_status === 'active');

export const effectiveBlogAudience = (
  group: GroupItem | null,
  requested: BlogAudience = 'public'
): BlogAudience => {
  if (!group) return 'public';
  if (group.visibility === 'private' || group.visibility === 'unlisted') {
    return 'group_only';
  }
  return requested === 'group_only' ? 'group_only' : 'public';
};

export const publicationScope = (
  group: GroupItem | null,
  requested: BlogAudience
): BlogPublicationScope => {
  if (!group) return {};
  return {
    group_slug: group.slug.trim(),
    audience: effectiveBlogAudience(group, requested),
  };
};

export function blogApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = (error as AxiosError<{ error?: string; message?: string }>).response?.data;
    return data?.error || data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong';
}
```

Define `export type BlogAudience = 'public' | 'group_only'` in `blogTypes.ts`. Add `audience?: BlogAudience` and `group_slug?: string` to `Blog`, `MetaBlog`, and `FollowingFeed`. Add `audience?: BlogAudience` and `groupSlug?: string` to `BlogCardData`.

In `normalizePublicPosts`, return no entry when `post.audience === 'group_only'` before validating and mapping the record. Preserve `audience: 'public'` and a string `group_slug` only when those values are present and valid.

- [ ] **Step 4: Run the focused tests and verify pass**

Run the Step 2 command.

Expected: PASS.

- [ ] **Step 5: Commit the publication domain and SEO guard**

```powershell
git add apps/the_monkeys/src/services/blog/blogPublication.ts apps/the_monkeys/src/services/blog/blogTypes.ts apps/the_monkeys/src/lib/seoCatalog.ts apps/the_monkeys/src/lib/seoCatalog.test.ts apps/the_monkeys/__tests__/src/services/blog/blogPublication.test.ts
git commit -m "feat: model group blog publication scope"
```

### Task 2: Optional-auth group blog service and infinite query

**Files:**
- Create: `apps/the_monkeys/__tests__/src/services/groups/groupsApi.test.ts`
- Modify: `apps/the_monkeys/src/services/groups/groupsTypes.ts`
- Modify: `apps/the_monkeys/src/services/groups/groupsApi.ts`
- Modify: `apps/the_monkeys/src/hooks/groups/useGroupQueries.ts`
- Modify: `apps/the_monkeys/src/lib/queryKeys.ts`
- Modify: `apps/the_monkeys/src/lib/queryFreshness.ts`

**Interfaces:**
- Consumes: `Blog` from `blogTypes.ts`.
- Produces: `GroupBlogsParams`, `GroupBlogsResponse`, `listGroupBlogs(slug, params)`, and `useGroupBlogs(slug, limit, enabled)`.
- Produces: `queryKeys.groups.blogs(slug, params)` for cache isolation and invalidation.

- [ ] **Step 1: Write failing service tests**

Mock `axiosInstanceNoAuth` and assert URL encoding and pagination:

```ts
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import { listGroupBlogs } from '@/services/groups/groupsApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/api/axiosInstanceNoAuth', () => ({
  default: { get: vi.fn() },
}));

describe('listGroupBlogs', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the optional-auth group endpoint with limit and offset', async () => {
    vi.mocked(axiosInstanceNoAuth.get).mockResolvedValue({ data: { blogs: [] } });

    await expect(listGroupBlogs('tea club', { limit: 20, offset: 40 })).resolves.toEqual({ blogs: [] });
    expect(axiosInstanceNoAuth.get).toHaveBeenCalledWith('/groups/tea%20club/blogs', {
      params: { limit: 20, offset: 40 },
    });
  });
});
```

- [ ] **Step 2: Run the service test and verify failure**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/services/groups/groupsApi.test.ts
```

Expected: FAIL because `listGroupBlogs` does not exist.

- [ ] **Step 3: Add the service, keys, infinite query, and invalidation**

Add the exact response types to `groupsTypes.ts`:

```ts
export type GroupBlogsParams = { limit?: number; offset?: number };
export type GroupBlogsResponse = { blogs: Blog[] };
```

Add the service:

```ts
export const listGroupBlogs = (slug: string, params: GroupBlogsParams = {}) =>
  axiosInstanceNoAuth
    .get<GroupBlogsResponse>(`${root}/${seg(slug)}/blogs`, { params })
    .then((response) => response.data);
```

Add a query key and infinite hook:

```ts
blogs: (slug: QueryId, params: Record<string, unknown> = {}) =>
  [...groupRoot, 'blogs', slug, params] as const,
```

```ts
export function useGroupBlogs(
  slug: string | undefined,
  limit = 20,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.groups.blogs(slug, { limit }),
    queryFn: ({ pageParam }) =>
      listGroupBlogs(slug!, { limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.blogs.length === limit
        ? pages.reduce((count, page) => count + page.blogs.length, 0)
        : undefined,
    enabled: enabled && !!slug,
    staleTime: LIVE_LIST_STALE_MS,
  });
}
```

Include `queryKeys.groups.blogs(slug)` in group write invalidation so visibility and deletion changes clear the attached-post list.

- [ ] **Step 4: Run service tests and type checking**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/services/groups/groupsApi.test.ts
pnpm --filter the_monkeys lint
```

Expected: PASS, with only the repository's existing lint warnings.

- [ ] **Step 5: Commit the group-blog data layer**

```powershell
git add apps/the_monkeys/src/services/groups/groupsTypes.ts apps/the_monkeys/src/services/groups/groupsApi.ts apps/the_monkeys/src/hooks/groups/useGroupQueries.ts apps/the_monkeys/src/lib/queryKeys.ts apps/the_monkeys/src/lib/queryFreshness.ts apps/the_monkeys/__tests__/src/services/groups/groupsApi.test.ts
git commit -m "feat: add group blog listing client"
```

### Task 3: Reusable audience badge, card privacy, and group Blogs tab

**Files:**
- Create: `apps/the_monkeys/src/components/blog/BlogAudienceBadge.tsx`
- Create: `apps/the_monkeys/src/components/groups/detail/GroupBlogsPanel.tsx`
- Create: `apps/the_monkeys/__tests__/src/components/groups/detail/GroupBlogsPanel.test.tsx`
- Create: `apps/the_monkeys/__tests__/src/components/cards/blog/FeedBlogCard.test.tsx`
- Modify: `apps/the_monkeys/src/utils/blogCardAdapters.ts`
- Modify: `apps/the_monkeys/src/components/cards/blog/FeedBlogCard.tsx`
- Modify: `apps/the_monkeys/src/components/groups/detail/GroupCommunity.tsx`

**Interfaces:**
- Consumes: `useGroupBlogs`, `fromBlog`, and existing `FeedBlogCard` variants.
- Produces: `BlogAudienceBadge`, `fromBlog(blog)`, and `FeedBlogCard.showShare`.
- Produces: a Blogs tab that never derives private data outside a successful group-blog response.

- [ ] **Step 1: Write failing group-panel and card tests**

Test these outcomes with mocked `useGroupBlogs`:

```ts
it('renders an empty state for a successful empty response', () => {
  mockedUseGroupBlogs.mockReturnValue({
    data: { pages: [{ blogs: [] }] },
    isLoading: false,
    isError: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isFetchingNextPage: false,
  });

  render(<GroupBlogsPanel group={publicGroup} />);
  expect(screen.getByText('No posts have been published to this group yet.')).toBeTruthy();
});

it('labels members-only posts and offers pagination', async () => {
  const fetchNextPage = vi.fn();
  mockedUseGroupBlogs.mockReturnValue({
    data: { pages: [{ blogs: [membersOnlyBlog] }] },
    isLoading: false,
    isError: false,
    hasNextPage: true,
    fetchNextPage,
    isFetchingNextPage: false,
  });
  render(<GroupBlogsPanel group={publicGroup} />);
  expect(screen.getByText('Members only')).toBeTruthy();
  await userEvent.click(screen.getByRole('button', { name: 'Load more posts' }));
  expect(fetchNextPage).toHaveBeenCalledOnce();
});
```

In `FeedBlogCard.test.tsx`, mock the share dialog and verify it is absent for `group_only` and retained for public or missing audience.

- [ ] **Step 2: Run focused tests and verify failure**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/components/groups/detail/GroupBlogsPanel.test.tsx __tests__/src/components/cards/blog/FeedBlogCard.test.tsx
```

Expected: FAIL because the panel, badge, adapter, and share control do not exist.

- [ ] **Step 3: Implement full-blog adaptation and card privacy**

Add `fromBlog` without inventing metadata:

```ts
export const fromBlog = (post: Blog): BlogCardData => {
  const { titleContent, descriptionContent, imageContent } = getCardContent({ blog: post });
  return {
    blogId: post.blog_id,
    authorId: post.owner_account_id,
    date: post.published_time,
    slug: generateSlug(titleContent),
    tags: post.tags ?? [],
    title: titleContent,
    description: descriptionContent,
    image: imageContent ?? '',
    audience: post.audience,
    groupSlug: post.group_slug,
    initialLikeCount: post.like_count ?? post.LikeCount,
  };
};
```

Render `BlogAudienceBadge` whenever `blog.audience === 'group_only'`. Add `showShare?: boolean` to card props and calculate `const canShare = showShare && blog.audience !== 'group_only'`. Pass `canShare` through every card variant to `ArticleActions`, and conditionally render `BlogShareDialog` there.

- [ ] **Step 4: Implement the Group Blogs panel and tab**

Flatten the infinite query safely:

```ts
const posts = data?.pages.flatMap((page) => page.blogs ?? []) ?? [];
```

Render one-column cards on mobile and two columns from `md`, use the existing loader for the first request, use a dashed empty state for a successful empty response, and show a generic unavailable message for errors. Add the Blogs tab after Events in `GroupCommunity` and render `GroupBlogsPanel` for that tab. Do not alter the staff tabs or existing group visibility gate.

- [ ] **Step 5: Run focused tests and lint**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/components/groups/detail/GroupBlogsPanel.test.tsx __tests__/src/components/cards/blog/FeedBlogCard.test.tsx
pnpm --filter the_monkeys lint
```

Expected: PASS.

- [ ] **Step 6: Commit the group Blogs experience**

```powershell
git add apps/the_monkeys/src/components/blog/BlogAudienceBadge.tsx apps/the_monkeys/src/components/groups/detail/GroupBlogsPanel.tsx apps/the_monkeys/src/components/groups/detail/GroupCommunity.tsx apps/the_monkeys/src/components/cards/blog/FeedBlogCard.tsx apps/the_monkeys/src/utils/blogCardAdapters.ts apps/the_monkeys/__tests__/src/components/groups/detail/GroupBlogsPanel.test.tsx apps/the_monkeys/__tests__/src/components/cards/blog/FeedBlogCard.test.tsx
git commit -m "feat: show scoped posts on group pages"
```

### Task 4: Publish drawer group and audience controls

**Files:**
- Create: `apps/the_monkeys/src/components/blog/actions/BlogPublicationScopeFields.tsx`
- Create: `apps/the_monkeys/__tests__/src/components/blog/actions/BlogPublicationScopeFields.test.tsx`
- Modify: `apps/the_monkeys/src/components/blog/actions/PublishBlogDrawer.tsx`

**Interfaces:**
- Consumes: `useUserGroups(username, { limit: 100, offset: 0 })`, `activePublishGroups`, and `effectiveBlogAudience`.
- Produces: `PublishBlogDrawer.handlePublish(selection)` and `handleSchedule(scheduleTime, timezone, selection)`.
- Keeps the selection inside the publish drawer so it never enters draft editor state.

- [ ] **Step 1: Write failing publication-control tests**

Cover active filtering, no-group state, public choices, forced private selection, clear behavior, and mobile labels. Define the shared setup in the test file:

```ts
const emptySelection: BlogPublicationSelection = {
  group: null,
  audience: 'public',
};

const onChange = vi.fn();

const chooseGroup = async (label: string) => {
  const input = screen.getByRole('combobox', { name: 'Publish to a group' });
  await userEvent.type(input, label);
  await userEvent.click(await screen.findByText(label));
};

it('shows both audiences only for an active public group', async () => {
  render(<BlogPublicationScopeFields username='ada' value={emptySelection} onChange={onChange} />);
  await chooseGroup('Public Writers');
  expect(screen.getByRole('radio', { name: /Public/i })).toBeTruthy();
  expect(screen.getByRole('radio', { name: /Members only/i })).toBeTruthy();
});

it('forces members only for private groups', async () => {
  render(<BlogPublicationScopeFields username='ada' value={emptySelection} onChange={onChange} />);
  await chooseGroup('Private Writers');
  expect(screen.queryByRole('radio', { name: /^Public/ })).toBeNull();
  expect(onChange).toHaveBeenLastCalledWith({
    group: expect.objectContaining({ slug: 'private-writers' }),
    audience: 'group_only',
  });
});
```

- [ ] **Step 2: Run the component test and verify failure**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/components/blog/actions/BlogPublicationScopeFields.test.tsx
```

Expected: FAIL because the publication-scope component does not exist.

- [ ] **Step 3: Implement the searchable picker and audience radio group**

Use non-creatable `Select` from `react-select`, the existing `SelectInputStyles`, and `RadioGroup` from `@the-monkeys/ui/atoms/radio-group`. Keep the option value as the complete `GroupItem`:

```ts
type GroupOption = { value: GroupItem; label: string };

const options = activePublishGroups(data?.groups).map((group) => ({
  value: group,
  label: group.name,
}));

const selectGroup = (option: GroupOption | null) => {
  if (!option) {
    onChange({ group: null, audience: 'public' });
    return;
  }
  onChange({
    group: option.value,
    audience: effectiveBlogAudience(option.value, value.audience),
  });
};
```

Label the picker `Publish to a group`, include `No group` as the clearable state, and explain that only active memberships are listed. Disable Public entirely for private and unlisted groups rather than rendering a selectable option that the server will coerce.

- [ ] **Step 4: Connect selection to both drawer actions**

Initialize drawer-local state:

```ts
const [publication, setPublication] = useState<BlogPublicationSelection>({
  group: null,
  audience: 'public',
});
```

Change callback signatures to:

```ts
handlePublish: (selection: BlogPublicationSelection) => void;
handleSchedule?: (
  scheduleTime: string,
  timezone: string,
  selection: BlogPublicationSelection
) => void;
```

Pass the same `publication` object to immediate and scheduled submissions. Do not pass it to `setData`, editor blocks, or websocket formatting.

- [ ] **Step 5: Run focused tests and lint**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/components/blog/actions/BlogPublicationScopeFields.test.tsx
pnpm --filter the_monkeys lint
```

Expected: PASS.

- [ ] **Step 6: Commit the publish controls**

```powershell
git add apps/the_monkeys/src/components/blog/actions/BlogPublicationScopeFields.tsx apps/the_monkeys/src/components/blog/actions/PublishBlogDrawer.tsx apps/the_monkeys/__tests__/src/components/blog/actions/BlogPublicationScopeFields.test.tsx
git commit -m "feat: add group audience publishing controls"
```

### Task 5: Publish and schedule API integration with authoritative read-back

**Files:**
- Create: `apps/the_monkeys/src/services/blog/blogApi.ts`
- Create: `apps/the_monkeys/__tests__/src/services/blog/blogApi.test.ts`
- Modify: `apps/the_monkeys/src/app/edit/[blogId]/page.tsx`

**Interfaces:**
- Consumes: `BlogPublicationSelection`, `publicationScope`, V1 authenticated Axios, V2 authenticated Axios, and V2 optional-auth Axios.
- Produces: `publishBlog`, `scheduleBlog`, and `getPublishedBlog` service functions.
- Publishes only scope fields selected in the drawer; draft websocket payloads remain unchanged.

- [ ] **Step 1: Write failing API service tests**

Mock all three Axios instances and verify paths and exact bodies:

```ts
it('publishes with group scope on the existing v1 endpoint', async () => {
  mockedV1.post.mockResolvedValue({ data: { message: 'published' } });
  await publishBlog('post-1', {
    tags: ['tea'],
    slug: 'tea-notes',
    group_slug: 'tea-club',
    audience: 'group_only',
  });
  expect(mockedV1.post).toHaveBeenCalledWith('/blog/publish/post-1', {
    tags: ['tea'],
    slug: 'tea-notes',
    group_slug: 'tea-club',
    audience: 'group_only',
  });
});

it('schedules with the same scope on the existing v2 endpoint', async () => {
  await scheduleBlog('post-1', {
    tags: ['tea'],
    slug: 'tea-notes',
    schedule_time: '2026-09-20T10:00:00Z',
    timezone: 'Asia/Kolkata',
    group_slug: 'tea-club',
    audience: 'group_only',
  });
  expect(mockedV2.post).toHaveBeenCalledWith('/blog/post-1/schedule_blog', expect.any(Object));
});
```

- [ ] **Step 2: Run the API tests and verify failure**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/services/blog/blogApi.test.ts
```

Expected: FAIL because `blogApi.ts` does not exist.

- [ ] **Step 3: Implement the focused API service**

```ts
export type PublishBlogBody = BlogPublicationScope & {
  tags: string[];
  slug?: string;
};

export type ScheduleBlogBody = PublishBlogBody & {
  schedule_time: string;
  timezone: string;
};

export const publishBlog = (blogId: string, body: PublishBlogBody) =>
  axiosInstance.post(`/blog/publish/${encodeURIComponent(blogId)}`, body).then((response) => response.data);

export const scheduleBlog = (blogId: string, body: ScheduleBlogBody) =>
  axiosInstanceV2.post(`/blog/${encodeURIComponent(blogId)}/schedule_blog`, body).then((response) => response.data);

export const getPublishedBlog = (blogId: string) =>
  axiosInstanceNoAuthV2.get<Blog>(`/blog/${encodeURIComponent(blogId)}`).then((response) => response.data);
```

- [ ] **Step 4: Integrate editor submission without changing autosave**

In each handler, derive the scope only at submission time:

```ts
const scope = publicationScope(selection.group, selection.audience);
await publishBlog(blogId, {
  tags: formatted.tags,
  slug: formatted.slug,
  ...scope,
});
```

Schedule with the same scope plus time fields. In both catch blocks use `blogApiError(error)` as the toast description.

After immediate publish, call `getPublishedBlog(blogId)`. If it succeeds, seed `[BLOG_DETAIL_QUERY_KEY, blogId]`, invalidate `queryKeys.groups.blogs(actual.group_slug)` when attached, and use `actual.audience === 'group_only'` to show `Published for group members` rather than claiming public availability. If the read-back fails, keep publication successful and show `Your post was published.`.

Do not perform read-back after scheduling because the scheduled item is not yet a published article and membership may change before execution.

- [ ] **Step 5: Run service tests, lint, and editor type checking**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/services/blog/blogApi.test.ts __tests__/src/services/blog/blogPublication.test.ts
pnpm --filter the_monkeys lint
```

Expected: PASS.

- [ ] **Step 6: Commit publish and schedule integration**

```powershell
git add apps/the_monkeys/src/services/blog/blogApi.ts apps/the_monkeys/src/app/edit/[blogId]/page.tsx apps/the_monkeys/__tests__/src/services/blog/blogApi.test.ts
git commit -m "feat: publish and schedule posts to groups"
```

### Task 6: Viewer-aware article server loading and private SEO behavior

**Files:**
- Modify: `apps/the_monkeys/src/app/blog/[slug]/blogData.ts`
- Modify: `apps/the_monkeys/src/app/blog/[slug]/page.tsx`
- Modify: `apps/the_monkeys/src/app/blog/[slug]/blogSeo.ts`
- Modify: `apps/the_monkeys/src/hooks/blog/useGetPublishedBlogDetailByBlogId.ts`
- Modify: `apps/the_monkeys/__tests__/src/app/blog/blogData.test.ts`
- Modify: `apps/the_monkeys/__tests__/src/app/blog/blogSeo.test.ts`
- Create: `apps/the_monkeys/__tests__/src/app/blog/blogPage.test.tsx`

**Interfaces:**
- Produces: `loadBlogForViewer(id)` with request cookie forwarding and `cache: 'no-store'`.
- Retains: `loadPublicBlogForSeo(id)` as the anonymous cached public metadata loader.
- Changes: client article fetching from auth-required `authFetcherV2` to optional-auth `fetcherV2`.

- [ ] **Step 1: Write failing loader, SEO, and page tests**

Mock `next/headers` and prove the viewer loader forwards `mat` without shared caching:

```ts
mockedCookies.mockReturnValue({
  get: vi.fn().mockReturnValue({ value: 'member-token' }),
});
vi.mocked(fetch).mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => blog,
} as Response);

await expect(loadBlogForViewer('123')).resolves.toEqual(blog);
expect(fetch).toHaveBeenCalledWith('https://api.example.test/v2/blog/123', {
  cache: 'no-store',
  headers: {
    Authorization: 'Bearer member-token',
    'Content-Type': 'application/json',
  },
});
```

Add tests for no cookie, 404 returning `null`, 500 returning `undefined`, and a page-level 404 invoking `notFound()` before rendering `BlogPageClient`.

Extend `blogSeo.test.ts`:

```ts
it('does not build public SEO for members-only posts', () => {
  const privateBlog = { ...blog, audience: 'group_only' as const };
  const metadata = buildBlogMetadata(privateBlog, 'useful-post-123', 'Ada');
  expect(metadata.robots).toMatchObject({ index: false, follow: false });
  expect(metadata.openGraph).toBeUndefined();
  expect(buildBlogJsonLd(privateBlog, 'useful-post-123', 'Ada')).toBeNull();
});
```

- [ ] **Step 2: Run article server tests and verify failure**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/app/blog/blogData.test.ts __tests__/src/app/blog/blogSeo.test.ts __tests__/src/app/blog/blogPage.test.tsx
```

Expected: FAIL because the viewer loader and private SEO guards do not exist.

- [ ] **Step 3: Add the request-scoped viewer loader**

```ts
export const loadBlogForViewer = requestCache(
  async (id: string): Promise<Blog | null | undefined> => {
    if (!id) return null;
    if (!API_URL_V2) return undefined;
    try {
      const token = cookies().get('mat')?.value;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(
        `${API_URL_V2}/blog/${encodeURIComponent(id)}`,
        { cache: 'no-store', headers }
      );
      if (response.status === 404) return null;
      if (!response.ok) return undefined;
      const value = (await response.json()) as Blog;
      return value?.blog_id && value.blog?.blocks ? value : undefined;
    } catch {
      return undefined;
    }
  }
);
```

Keep `loadPublicBlogForSeo` anonymous and revalidated. Do not add cookies to that loader.

- [ ] **Step 4: Use the viewer loader for page rendering and public loader for metadata**

In the route component, use `loadBlogForViewer` for hydration and call `notFound()` on `null` or draft. Keep `generateMetadata` on `loadPublicBlogForSeo` so a crawler never receives member-authorized metadata. Emit JSON-LD only when `buildBlogJsonLd` returns a non-null public schema.

In `buildBlogMetadata`, return a strict `noIndexRobots` response before reading content when `audience === 'group_only'`. In `buildBlogJsonLd`, return `null` for the same condition.

Switch the browser hook to `fetcherV2`, retain credentials through `axiosInstanceNoAuthV2`, and set `retry: false` so privacy-preserving 404s are not retried.

- [ ] **Step 5: Run article tests and lint**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/app/blog/blogData.test.ts __tests__/src/app/blog/blogSeo.test.ts __tests__/src/app/blog/blogPage.test.tsx
pnpm --filter the_monkeys lint
```

Expected: PASS.

- [ ] **Step 6: Commit viewer-aware article loading**

```powershell
git add apps/the_monkeys/src/app/blog/[slug]/blogData.ts apps/the_monkeys/src/app/blog/[slug]/page.tsx apps/the_monkeys/src/app/blog/[slug]/blogSeo.ts apps/the_monkeys/src/hooks/blog/useGetPublishedBlogDetailByBlogId.ts apps/the_monkeys/__tests__/src/app/blog/blogData.test.ts apps/the_monkeys/__tests__/src/app/blog/blogSeo.test.ts apps/the_monkeys/__tests__/src/app/blog/blogPage.test.tsx
git commit -m "fix: enforce group post privacy on article reads"
```

### Task 7: Article group context, share suppression, and secondary-request gating

**Files:**
- Create: `apps/the_monkeys/src/app/blog/components/BlogScopeLine.tsx`
- Create: `apps/the_monkeys/__tests__/src/app/blog/BlogPageClient.test.tsx`
- Create: `apps/the_monkeys/__tests__/src/app/blog/BlogScopeLine.test.tsx`
- Modify: `apps/the_monkeys/src/app/blog/[slug]/BlogPageClient.tsx`
- Modify: `apps/the_monkeys/src/app/blog/components/BlogReactions.tsx`

**Interfaces:**
- Consumes: `Blog.group_slug`, `Blog.audience`, `useGroupDetail`, `BlogAudienceBadge`.
- Produces: `BlogScopeLine({ groupSlug, audience })` and `BlogReactionsContainer.showShare`.
- Guarantees: no activity or interaction controls before a valid article exists.

- [ ] **Step 1: Write failing article presentation tests**

Mock the article hook and verify. Define `publicBlog` as a complete `Blog` fixture and bind the mocked hook before the tests:

```ts
const mockedArticleHook = vi.mocked(useGetPublishedBlogDetailByBlogId);
const publicBlog: Blog = {
  blog_id: '123',
  owner_account_id: 'author-1',
  blog: {
    time: 1,
    blocks: [{ id: 'title', type: 'header', data: { text: 'Post' }, author: [], time: 1 }],
  },
  is_draft: false,
  published_time: '2026-09-19T10:00:00Z',
  tags: ['writing'],
  LikeCount: 0,
  like_count: 0,
  BookmarkCount: 0,
  bookmark_count: 0,
};

it('does not record activity or render interactions when the article failed', () => {
  mockedArticleHook.mockReturnValue({ blog: undefined, isLoading: false, isError: true });
  render(<BlogPageClient urlBlogId='hidden' fullSlug='hidden-hidden' />);
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.queryByText('Members only')).toBeNull();
  expect(screen.queryByTestId('blog-reactions')).toBeNull();
});

it('hides public sharing and snapshots for members-only articles', () => {
  mockedArticleHook.mockReturnValue({
    blog: { ...publicBlog, audience: 'group_only', group_slug: 'writers' },
    isLoading: false,
    isError: false,
  });
  render(<BlogPageClient urlBlogId='123' fullSlug='post-123' />);
  expect(screen.getByText('Members only')).toBeTruthy();
  expect(screen.queryByTestId('blog-share')).toBeNull();
  expect(screen.queryByTestId('social-snapshot')).toBeNull();
});
```

Test `BlogScopeLine` with a mocked group detail response so the link uses the group name and `/groups/:slug` path, and verify no group request runs when `groupSlug` is absent.

- [ ] **Step 2: Run article client tests and verify failure**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/app/blog/BlogPageClient.test.tsx __tests__/src/app/blog/BlogScopeLine.test.tsx
```

Expected: FAIL because activity starts before the error guard and private controls are still rendered.

- [ ] **Step 3: Gate all client-only article work on a valid article**

Move the activity effect behind a data guard:

```ts
useEffect(() => {
  if (!blog || isLoading || isError) return;
  const startTime = Date.now();
  let hasSent = false;

  const sendData = () => {
    const durationMs = Date.now() - startTime;
    if (hasSent || durationMs <= 1000 || !urlBlogId) return;
    hasSent = true;
    fetch(`/api/v2/blog/${urlBlogId}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duration_ms: durationMs,
        interaction_type: 'read_duration',
      }),
      keepalive: true,
    }).catch(() => undefined);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') sendData();
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    sendData();
  };
}, [blog, isError, isLoading, urlBlogId]);
```

Because the reactions, likes, bookmark status, author query, group query, and snapshot components render only after the valid-blog guard, a 404 starts none of those requests.

- [ ] **Step 4: Add group context and private action suppression**

Render `BlogScopeLine` between the date and title. It calls `useGroupDetail(groupSlug)` only when the slug exists and renders:

```tsx
<div className='flex flex-wrap items-center justify-center gap-2'>
  {groupSlug && (
    <Link href={`${GROUPS_ROUTE}/${groupSlug}`}>
      {group?.name || groupSlug.replace(/-/g, ' ')}
    </Link>
  )}
  {audience === 'group_only' && <BlogAudienceBadge />}
</div>
```

Pass `showShare={blog.audience !== 'group_only'}` to `BlogReactionsContainer`, conditionally render its share segment, and render `SocialSnapshotCard` only for non-members-only posts.

- [ ] **Step 5: Run article client tests and lint**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/app/blog/BlogPageClient.test.tsx __tests__/src/app/blog/BlogScopeLine.test.tsx
pnpm --filter the_monkeys lint
```

Expected: PASS.

- [ ] **Step 6: Commit article presentation and request gating**

```powershell
git add apps/the_monkeys/src/app/blog/components/BlogScopeLine.tsx apps/the_monkeys/src/app/blog/[slug]/BlogPageClient.tsx apps/the_monkeys/src/app/blog/components/BlogReactions.tsx apps/the_monkeys/__tests__/src/app/blog/BlogPageClient.test.tsx apps/the_monkeys/__tests__/src/app/blog/BlogScopeLine.test.tsx
git commit -m "feat: display group context on scoped posts"
```

### Task 8: Profile, My published, and bookmark compatibility

**Files:**
- Create: `apps/the_monkeys/__tests__/src/components/cards/blog/ProfileBlogCard.test.tsx`
- Modify: `apps/the_monkeys/src/components/cards/blog/ProfileBlogCard.tsx`
- Modify: `apps/the_monkeys/src/utils/blogCardAdapters.ts`

**Interfaces:**
- Consumes: optional `MetaBlog.audience` and `MetaBlog.group_slug`.
- Uses: `BlogAudienceBadge` and the existing group route.
- Guarantees: missing scope metadata does not fabricate a badge or group, and members-only cards omit share controls.

- [ ] **Step 1: Write failing profile and adapter tests**

```ts
const metaBlog: MetaBlog = {
  blog_id: 'post-1',
  title: 'Writing together',
  first_image: '',
  first_paragraph: 'A group writing post.',
  owner_account_id: 'author-1',
  published_time: '2026-09-19T10:00:00Z',
  tags: ['writing'],
};

it('shows real members-only and group metadata without a public share action', () => {
  render(
    <ProfileBlogCard
      blog={{ ...metaBlog, audience: 'group_only', group_slug: 'writers' }}
      isAuthenticated
      modificationEnable
    />
  );
  expect(screen.getByText('Members only')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'writers' })).toHaveAttribute('href', '/groups/writers');
  expect(screen.queryByTestId('blog-share')).toBeNull();
});

it('does not invent scope metadata for old cards', () => {
  expect(fromMetaBlog(metaBlog)).toMatchObject({
    audience: undefined,
    groupSlug: undefined,
  });
});
```

Add an adapter assertion that supplied scope fields survive into `BlogCardData`, which lets Bookmarks automatically hide sharing and show the badge through `FeedBlogCard`.

- [ ] **Step 2: Run the profile-card tests and verify failure**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/components/cards/blog/ProfileBlogCard.test.tsx
```

Expected: FAIL because profile cards do not render scope metadata and `fromMetaBlog` drops it.

- [ ] **Step 3: Add conditional scope presentation**

Copy only real optional fields in `fromMetaBlog`:

```ts
audience: blog.audience,
groupSlug: blog.group_slug,
```

In `ProfileBlogCard`, render the badge for explicit `group_only`, render a group link only when `group_slug` exists, and render `BlogShareDialog` only when the post is not a draft and not members-only. Keep edit and delete permissions based on existing owner/co-author logic, not group role.

Do not add local filtering to profile or bookmark collections. The optional-auth profile endpoint and authenticated bookmark endpoint remain authoritative.

- [ ] **Step 4: Run focused tests and lint**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/components/cards/blog/ProfileBlogCard.test.tsx __tests__/src/components/cards/blog/FeedBlogCard.test.tsx
pnpm --filter the_monkeys lint
```

Expected: PASS.

- [ ] **Step 5: Commit profile and bookmark compatibility**

```powershell
git add apps/the_monkeys/src/components/cards/blog/ProfileBlogCard.tsx apps/the_monkeys/src/utils/blogCardAdapters.ts apps/the_monkeys/__tests__/src/components/cards/blog/ProfileBlogCard.test.tsx
git commit -m "feat: label scoped posts in user collections"
```

### Task 9: Whole-feature verification and manual privacy matrix

**Files:**
- No planned file changes. Any verification correction must stay within files already listed in Tasks 1 through 8.

**Interfaces:**
- Consumes all completed tasks.
- Produces a verified branch with no unrelated staged files.

- [ ] **Step 1: Run every new or modified focused test**

```powershell
pnpm --filter the_monkeys test -- __tests__/src/services/blog/blogPublication.test.ts __tests__/src/services/blog/blogApi.test.ts __tests__/src/services/groups/groupsApi.test.ts __tests__/src/components/blog/actions/BlogPublicationScopeFields.test.tsx __tests__/src/components/groups/detail/GroupBlogsPanel.test.tsx __tests__/src/components/cards/blog/FeedBlogCard.test.tsx __tests__/src/components/cards/blog/ProfileBlogCard.test.tsx __tests__/src/app/blog/blogData.test.ts __tests__/src/app/blog/blogSeo.test.ts __tests__/src/app/blog/blogPage.test.tsx __tests__/src/app/blog/BlogPageClient.test.tsx __tests__/src/app/blog/BlogScopeLine.test.tsx src/lib/seoCatalog.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run the complete frontend suite**

```powershell
pnpm --filter the_monkeys test
```

Expected: PASS. If an unrelated pre-existing test fails, record its exact name and verify it also fails on `main` before excluding it from this feature.

- [ ] **Step 3: Run lint and production build**

```powershell
pnpm --filter the_monkeys lint
pnpm --filter the_monkeys build
```

Expected: both commands exit 0. Existing warnings may remain, but no new warning may originate from a changed file.

- [ ] **Step 4: Run the backend-connected manual matrix**

Verify all of the following with local gateway `http://127.0.0.1:8081/api/v1` and the existing frontend development server:

1. Public group plus Public appears on home, search, profile, group page, sitemap, RSS, and direct article URL.
2. Public group plus Members only is absent from home, search, stranger profile, sitemap, and RSS; active members and the author can open it; strangers receive the normal 404.
3. Private and unlisted groups never offer Public in the drawer.
4. Pending membership does not appear in the picker.
5. A stale membership publish receives and displays `join this group to publish there` exactly.
6. An unknown group displays `group not found` exactly.
7. Server-coerced audience is reflected in the success message and article badge after read-back.
8. Article 404 creates no activity, like, bookmark, stats, author, or group network request.
9. Members-only article cards and pages expose no share or snapshot control.
10. Leaving a group removes inaccessible bookmarks after refetch, while remove-bookmark remains functional.
11. Switching a public group to private removes attached public posts from public discovery without a frontend migration call.
12. Deleting a group leaves public posts public and leaves `group_only` posts author-only without a group link.
13. Mobile, tablet, and desktop views show the picker, radio choices, group tab, cards, badges, and article header without clipping or horizontal overflow.

- [ ] **Step 5: Inspect branch scope and sensitive data**

```powershell
git status --short
git diff --check main...HEAD
git diff --name-only main...HEAD
rg -n -i 'BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|api[_-]?key\s*[:=]|secret\s*[:=]|password\s*[:=]' apps/the_monkeys
```

Expected: only the design, plan, intended frontend files, and their tests belong to this branch; no credentials or tokens are present.

- [ ] **Step 6: Commit any verification-driven corrections**

If verification required code corrections, stage only the files corrected for this feature and commit them:

```powershell
git commit -m "fix: complete group blog privacy verification"
```

If verification required no corrections, do not create an empty commit.
