# Group-Scoped Blogs Frontend Design

**Date:** 2026-09-19

**Status:** Approved design

**Application:** `apps/the_monkeys`
**Backend status:** Engine and gateway contract already shipped

## Context

The Monkeys already has EditorJS posts, groups, publishing, scheduling, article pages, profiles, feeds, search, and bookmarks. This change connects those existing systems so an author can optionally publish a post to a group and choose whether it is public or visible only to active group members.

This is not a discussion or comment feature. It does not introduce a second authoring system or a new write endpoint. The existing blog editor and publish routes remain authoritative.

## Goals

1. Let an author attach an existing EditorJS post to one group during publish or scheduling.
2. Let an author choose public or members-only visibility when the selected group permits it.
3. Add a Blogs tab to group pages using the new group-blog listing endpoint.
4. Make article loading respect optional authentication and the backend's privacy-preserving 404 behavior.
5. Prevent members-only posts from leaking through metadata, structured data, social sharing, activity, reactions, profiles, bookmarks, search, or feeds.
6. Preserve existing blog ownership and co-author permissions.
7. Reuse existing cards, controls, query patterns, and error presentation where practical.

## Non-goals

1. Building group discussions, chat, or blog comments.
2. Adding a group-specific blog write endpoint.
3. Calling staff or admin blog APIs from the public application.
4. Giving group staff permission to edit or delete another author's post.
5. Reimplementing backend filtering for feeds, search, profiles, or bookmarks.
6. Persisting group selection through the draft websocket.
7. Fabricating audience or group data when a response does not contain it.

## Locked product rules

The frontend uses these audience rules:

- A post without `group_slug` is public. Missing `audience` on an older post is also treated as public.
- A public post attached to a public group appears on normal public surfaces and on the group page.
- A `group_only` post is available to its author and active members of the attached group.
- A public post cannot remain public when attached to a private or unlisted group. The interface forces Members only and the server remains authoritative.
- Only a group whose `viewer_member_status` is `active` may be selected for publishing. A role such as organizer or moderator is not a substitute for active membership.
- An unauthorized viewer receives the same 404 and existing not-found page as a missing post. The interface never identifies a hidden post as private or forbidden.
- Leaving, removal from, or deletion of a group may make an existing members-only post inaccessible. Client caches must not override the latest server decision.

## API contracts

### Group blog listing

Add an optional-auth client for:

`GET /api/v1/groups/:slug/blogs?limit=<n>&offset=<n>`

The response is `{ "blogs": Blog[] }`. The default page size is 20, the maximum is 100, and an empty group returns an empty array. A 404 is rendered as the existing unavailable group state because the server intentionally uses the same status for missing and inaccessible groups.

The browser request uses the existing no-auth Axios instance, which still sends credentials. This allows public visitors to receive public posts and active members to receive public plus members-only posts without requiring a separate endpoint.

### Publish

Continue using:

`POST /api/v1/blog/publish/:blog_id`

The request may include:

```ts
type BlogAudience = 'public' | 'group_only';

type BlogPublicationScope = {
  group_slug?: string;
  audience?: BlogAudience;
};
```

When no group is selected, `group_slug` and `audience` are omitted. Existing `tags` and `slug` behavior is unchanged.

### Schedule

Continue using:

`POST /api/v2/blog/:blog_id/schedule_blog`

The request uses the same optional publication scope plus existing `tags`, `slug`, `schedule_time`, and `timezone` fields.

The interface does not assume the group remains attached until publication. If membership changes before the scheduled job runs, the backend may detach the group while preserving the selected audience.

### Article and related reads

The following existing requests remain optional-auth and must carry the viewer cookie when it exists:

- `GET /api/v2/blog/:blog_id`
- `GET /api/v2/blog/:blog_id/stats`
- `POST /api/v2/blog/:blog_id/activity`
- `GET /api/v2/blog/user/:username`

Like and bookmark endpoints remain unchanged. The frontend starts those requests only after the article itself has loaded successfully.

## Type model

The shared blog model gains optional fields so old payloads remain valid:

```ts
export type BlogAudience = 'public' | 'group_only';

export type Blog = {
  // existing fields
  audience?: BlogAudience;
  group_slug?: string;
};
```

Metadata-card types gain the same optional fields only where the backend payload can include them. Rendering code treats absent `audience` as public and does not infer a group from tags, URLs, or other content.

The group service gains:

```ts
export type GroupBlogsResponse = {
  blogs: Blog[];
};

export type GroupBlogsParams = {
  limit?: number;
  offset?: number;
};
```

## Publishing interface

### Component boundary

A focused publication-scope component will be added beside the existing publish controls. It owns presentation and selection rules but not network submission. The editor page remains responsible for constructing publish and schedule payloads.

Inputs:

- Current username.
- Selected group and audience.
- Change callbacks.
- Loading and disabled state from the existing publish flow.

Outputs:

- Selected `GroupItem | null`.
- Effective `BlogAudience`.

This keeps group membership and visibility rules out of the already large editor page while allowing publish and schedule to share one selection state.

### Group picker

The picker uses `GET /api/v1/groups/user/:username` through the existing `useUserGroups` hook. It requests a practical first page up to the server maximum and filters the response to:

```ts
group.viewer_member_status === 'active'
```

Pending, left, removed, banned, and unknown membership states are excluded. The control displays the group name and preserves the full `GroupItem` so visibility can drive the audience choices.

### Audience choices

No audience control is shown until a group is selected.

For a public group:

- Public: appears on the group page and ordinary public discovery surfaces.
- Members only: appears to the author and active members, and is excluded from public discovery.

For private or unlisted groups, only Members only is presented and the effective value is immediately set to `group_only`.

Clearing the group also clears the audience selection from the request. The payload then omits both new fields and preserves legacy public publishing behavior.

### Submission and server reconciliation

Draft autosave and the draft websocket remain unchanged. Group scope exists only in local client state until publish or schedule submission.

Publish and schedule payload builders add `group_slug` and `audience` only when a group is selected. The selected slug is trimmed before submission.

After immediate publication succeeds, the frontend reads `GET /api/v2/blog/:blog_id` and uses the returned `audience` and `group_slug` as authoritative. This covers silent server coercion for private or unlisted groups. If the read-back fails temporarily, publication still counts as successful and the interface uses a neutral success message without claiming a public audience.

Scheduling reports successful submission but does not claim the eventual group attachment because membership can change before execution.

### Errors

One blog API error helper reads both response shapes:

```ts
{ error?: string; message?: string }
```

The server string is shown unchanged in the toast when present, including `join this group to publish there`, `group not found`, and `the blog does not exist`. A generic existing fallback is used only when neither key is available.

## Group Blogs tab

`GroupCommunity` adds Blogs as a normal community tab. Existing group visibility gating remains in place, and the backend remains the final authority.

The panel:

1. Calls `GET /groups/:slug/blogs` with `limit` and `offset`.
2. Shows the existing loader while the first page loads.
3. Shows a dedicated empty state for `{ blogs: [] }`.
4. Renders existing blog cards after normalizing the full EditorJS blog document into the card model.
5. Shows a Members only badge only when `audience === 'group_only'`.
6. Links to the existing article URL generated from the post title and `blog_id`.
7. Uses incremental pagination without replacing already loaded cards.

The card action surface receives an optional share flag. Public cards preserve current sharing behavior. Members-only cards hide public share controls because the URL is not world-readable. Like and bookmark behavior remains available for viewers who can see the card.

A 404 from the group-blog list is not converted into an authorization message. It uses the same unavailable result used by an inaccessible or missing group.

## Article loading and privacy

### Viewer-aware server load

The article page cannot rely exclusively on the current anonymous SEO fetch because that would reject an active member's `group_only` post before hydration.

The page render therefore uses a request-scoped viewer loader:

- Read `mat` from the incoming Next.js cookie store.
- Forward it as `Authorization: Bearer <token>` when present.
- Use `cache: 'no-store'` so a member response cannot enter a shared cache.
- Return `null` for 404, `undefined` for a temporary upstream failure, and a validated `Blog` for success.
- Use React request memoization only to deduplicate calls within one render request.

The successful result is placed in the React Query hydration cache. A 404 invokes the existing `notFound()` route without rendering the client article component.

Client refetches use the existing optional-auth V2 fetcher rather than an auth-required refresh flow. Credentials are still sent, so logged-in authors and members receive the correct response while logged-out readers can open public posts.

### Metadata and indexing

Public metadata continues to use an anonymous, cached lookup. This intentionally means a `group_only` post produces not-found or noindex metadata even when the current viewer may read it.

For a members-only post:

- Set `robots` to `noindex, nofollow` or the project's strict private equivalent.
- Do not emit Article JSON-LD.
- Do not emit public Open Graph or social-card metadata that describes the private content.
- Do not render the public social snapshot control.
- Do not place the URL in sitemaps, RSS, home, search, trending, or public feeds. The engine already performs collection filtering, so the frontend does not add a second content filter.

### Article header

When `group_slug` is present, the article header shows a group link. The group name is obtained from the existing group detail query when available; until then the normalized slug is used as accessible fallback text. A Members only badge is shown only for `audience === 'group_only'`.

If a scheduled post is eventually detached, no group link is shown. A detached `group_only` post still shows Members only and remains readable only to the author according to the engine response.

### Secondary requests

Activity, stats, reactions, like status, bookmark status, and counts must not start until the article GET has returned a usable post. On article 404, the page exits through `notFound()` and no secondary blog request is sent.

The activity cleanup request is also gated by a successfully loaded blog so navigating away from an error state cannot record phantom activity.

## Profiles, published posts, bookmarks, feeds, and search

The existing profile request already uses an optional-auth client and sends cookies. The backend decides whether the profile owner may see their own members-only posts. The frontend displays audience and group badges only when those fields are actually present.

The My published view accepts `group_only` records. It shows a Members only badge and group link only when the payload supplies the needed fields.

The bookmarks view accepts that the server may remove inaccessible posts after the viewer leaves a group. Its existing empty state remains valid when the list becomes empty. Remove-bookmark remains usable through its existing endpoint and no client-side visibility cache is used to reinsert removed records.

Home, following feed, trending, topics, and `/blog/search/v2` receive no additional filtering. The engine already excludes `group_only`, and duplicating that policy in each component would risk inconsistent behavior.

## Cache behavior

- Group blog queries are keyed by group slug, limit, and offset.
- Selecting or clearing a publication group does not mutate group membership caches.
- A successful publish invalidates relevant post, profile, and group-blog queries using existing query freshness helpers where available.
- Viewer-specific article reads use no shared server cache.
- Public SEO reads may keep their current bounded revalidation cache.
- Browser queries must honor a fresh 404 after membership changes and must not retain inaccessible article data indefinitely.

## Accessibility and responsive behavior

- Group and audience controls have explicit labels, descriptions, keyboard operation, and visible focus states.
- Members only is text, not color alone.
- The group Blogs tab follows the existing horizontally scrollable mobile tab behavior.
- Blog cards use the current one-column mobile grid and expand at existing breakpoints.
- Group links and badges wrap rather than overflow narrow article headers.
- Empty, loading, and pagination states remain readable in light and dark themes.

## Security and privacy requirements

1. Treat every server 404 for an article as not found, regardless of authentication state.
2. Never replace that 404 with a login prompt, forbidden message, private-post explanation, or membership hint.
3. Never cache a viewer-authorized article response in a shared Next.js cache.
4. Never expose article body, title, author, group, or audience in metadata after an anonymous 404.
5. Never enable a pending member to publish by relying on `viewer_role` alone.
6. Never send group fields through draft autosave.
7. Never use `/api/v1/admin/*`.
8. Never infer group staff editing rights from group membership.

## Testing strategy

Implementation follows test-driven development.

### Unit and service tests

- Group-blog service URL encoding, `limit`, `offset`, empty responses, and error propagation.
- Publication payload construction with no group, a public group, a members-only choice, and a private or unlisted group.
- Active-membership filtering, including pending and missing membership status.
- API error extraction from both `error` and `message` response keys.
- Viewer-aware article loader forwarding the cookie, using no-store, and distinguishing 404 from upstream failure.
- Missing `audience` normalizing to public.

### Component tests

- Group picker contains only active memberships.
- Audience controls stay hidden without a group.
- Public groups expose both choices.
- Private and unlisted groups expose only Members only.
- Clearing a group removes group and audience fields.
- Publish and schedule use the same effective scope.
- Group Blogs tab covers loading, empty, pagination, public cards, and members-only badges.
- Members-only group cards do not expose public sharing.
- Article header renders the group link and Members only badge from actual response fields.
- Forbidden article 404 does not start activity, stats, likes, or bookmarks.
- Members-only articles omit snapshot and public sharing controls.
- Profile, My published, and bookmark lists tolerate missing scope metadata and shrinking results.

### Integration and manual verification

1. Public group plus public audience appears on home, search, group page, public profile, and public article GET.
2. Public group plus members-only audience is absent from public collections and stranger profiles, appears for active members, and returns 404 to logged-out users and non-members.
3. Private and unlisted groups do not offer Public and publish as `group_only`.
4. A non-member publish attempt shows the exact server error `join this group to publish there`.
5. A pending member cannot select the group.
6. The author sees members-only posts in My published and their own profile response when supplied by the server.
7. Likes and bookmarks return not found when the viewer loses access, while remove-bookmark remains usable.
8. Changing a group from public to private removes attached public posts from public discovery without an extra frontend write.
9. Deleting a group leaves the post intact, removes the group link, and leaves a `group_only` post author-only.
10. Scheduled publication tolerates membership changes and displays the server's final group and audience state.
11. Mobile, tablet, and desktop layouts preserve the controls, cards, badges, and article header without overflow.

## Delivery boundaries

All implementation changes stay in `apps/the_monkeys` and its tests unless an existing shared workspace utility must be extended. No backend changes are required for this frontend contract.

The branch is `codex/group-scoped-blogs`. Existing unrelated working-tree files are not part of this feature and must not be staged or modified.
