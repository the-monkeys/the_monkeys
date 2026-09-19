# Comprehensive SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every Monkeys route an intentional crawl policy, accurate server-rendered metadata, connected structured data, resilient discovery feeds, and low-overhead rendering.

**Architecture:** A shared SEO module owns canonical URLs, copy normalization, crawler directives, publisher identity, and schema references. Public dynamic routes reuse request-scoped server loaders for metadata and rendering, while sitemap and feed routes use normalized public catalogs. Client components remain responsible only for interaction.

**Tech Stack:** Next.js 14 App Router, React 18 server and client components, TypeScript, Vitest, React Testing Library, JSON-LD, XML sitemaps, RSS 2.0.

**Spec:** `docs/superpowers/specs/2026-09-14-comprehensive-seo-design.md`

## Global Constraints

- Stay on `codex/comprehensive-seo`.
- Do not commit, push, merge, rebase, or change branches.
- Stage only the relevant implementation, test, plan, and specification files after all verification passes.
- Use `Buddhicintaka (OPC) Pvt. Ltd.` as the exact legal publisher name.
- Describe Monkeys as a content and community platform, not only as a blogging product.
- Do not use em dashes in controlled visible copy or SEO metadata.
- Do not expose private event meeting links, invitation tokens, account fields, or member-only content.
- Search pages use `noindex, follow`; private workflow pages use `noindex, nofollow`.
- Do not add a backend dependency unless a required public catalog is unavailable, in which case omit that discovery surface and document the limitation.
- Keep structured data and metadata server-side and do not add client bundle weight for SEO.

---

### Task 1: Shared SEO primitives and entity identity

**Files:**

- Modify: `apps/the_monkeys/src/lib/seo.ts`
- Modify: `apps/the_monkeys/src/lib/seoSchema.ts`
- Modify: `apps/the_monkeys/src/lib/landingPageSeo.ts`
- Modify: `apps/the_monkeys/src/app/layout.tsx`
- Test: `apps/the_monkeys/src/lib/seo.test.ts`
- Test: `apps/the_monkeys/src/lib/landingPageSeo.test.ts`

**Interfaces:**

- Produces: `LEGAL_PUBLISHER_NAME`, `LEGAL_PUBLISHER_ID`, `MONKEYS_BRAND_ID`, `MONKEYS_WEBSITE_ID`, `noIndexFollowRobots`, `normalizeSeoText`, `publisherOrg`, `monkeysBrand`, `monkeysWebsite`, and `landingEntityGraph`.
- Consumes: existing `SITE_URL`, `SITE_NAME`, `OG_IMAGE`, `absoluteUrl`, and `pageMetadata` helpers.

- [x] **Step 1: Write failing tests for shared identity and normalization**

```ts
expect(LEGAL_PUBLISHER_NAME).toBe("Buddhicintaka (OPC) Pvt. Ltd.");
expect(publisherOrg()["@id"]).toBe("https://buddhicintaka.com/#organization");
expect(monkeysBrand().parentOrganization).toEqual({
  "@id": LEGAL_PUBLISHER_ID,
});
expect(monkeysWebsite().publisher).toEqual({ "@id": LEGAL_PUBLISHER_ID });
expect(normalizeSeoText("<b>Hello</b>   world", 160)).toBe("Hello world");
expect(JSON.stringify(landingEntityGraph)).not.toContain("\u2014");
```

- [x] **Step 2: Run the focused tests and confirm they fail**

Run: `pnpm --dir apps/the_monkeys test -- src/lib/seo.test.ts src/lib/landingPageSeo.test.ts`

Expected: FAIL because the identity helpers and connected graph are not implemented.

- [x] **Step 3: Implement stable entity helpers and safe defaults**

```ts
export const LEGAL_PUBLISHER_NAME = "Buddhicintaka (OPC) Pvt. Ltd.";
export const LEGAL_PUBLISHER_ID = "https://buddhicintaka.com/#organization";
export const MONKEYS_BRAND_ID = `${SITE_URL}/#brand`;
export const MONKEYS_WEBSITE_ID = `${SITE_URL}/#website`;

export const noIndexFollowRobots: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
};
```

Remove the global homepage canonical and unsupported language alternates from `app/layout.tsx`. Keep only safe global defaults and render the connected homepage graph from the landing page, not on every route.

- [x] **Step 4: Run the focused tests**

Run: `pnpm --dir apps/the_monkeys test -- src/lib/seo.test.ts src/lib/landingPageSeo.test.ts`

Expected: PASS.

### Task 2: Route indexing policy and static metadata audit

**Files:**

- Modify: `apps/the_monkeys/src/app/search/layout.tsx`
- Modify: `apps/the_monkeys/src/app/auth/layout.tsx`
- Modify: `apps/the_monkeys/src/app/activity/layout.tsx`
- Modify: `apps/the_monkeys/src/app/library/layout.tsx`
- Modify: `apps/the_monkeys/src/app/notifications/layout.tsx`
- Modify: `apps/the_monkeys/src/app/settings/layout.tsx`
- Modify: `apps/the_monkeys/src/app/create/layout.tsx`
- Modify: `apps/the_monkeys/src/app/edit/[blogId]/layout.tsx`
- Modify: static public route metadata under `apps/the_monkeys/src/app/about`, `contact-us`, `support`, `feed`, `events`, `groups`, `snapshot`, `cards`, and `app/(marketing)`
- Test: `apps/the_monkeys/src/lib/seoRoutePolicy.test.ts`

**Interfaces:**

- Consumes: `pageMetadata`, `noIndexPage`, `noIndexFollowRobots`, and route constants.
- Produces: one intentional metadata policy for each public, search, and private route family.

- [x] **Step 1: Add a route-policy test matrix**

```ts
const cases = [
  ["/search", false, true],
  ["/auth/login", false, false],
  ["/notifications", false, false],
  ["/events", true, true],
  ["/groups", true, true],
] as const;

for (const [path, index, follow] of cases) {
  expect(routeRobots(path)).toMatchObject({ index, follow });
}
```

- [x] **Step 2: Run the policy test and confirm it fails**

Run: `pnpm --dir apps/the_monkeys test -- src/lib/seoRoutePolicy.test.ts`

Expected: FAIL for missing or inconsistent directives.

- [x] **Step 3: Apply route-specific metadata**

Use `noindex, follow` only for search. Use `noindex, nofollow` for authentication and account workflows. Give each public static route a self-referencing canonical and product-accurate title and description.

- [x] **Step 4: Run the route-policy test**

Run: `pnpm --dir apps/the_monkeys test -- src/lib/seoRoutePolicy.test.ts`

Expected: PASS.

### Task 3: Consolidated post metadata and Article schema

**Files:**

- Create: `apps/the_monkeys/src/app/blog/[slug]/blogSeo.ts`
- Modify: `apps/the_monkeys/src/app/blog/[slug]/page.tsx`
- Modify: `apps/the_monkeys/src/app/blog/[slug]/layout.tsx`
- Modify: `apps/the_monkeys/src/app/blog/[slug]/utils.ts`
- Test: `apps/the_monkeys/__tests__/src/app/blog/blogSeo.test.ts`

**Interfaces:**

- Produces: `getBlogIdFromSlug(slug: string): string`, `loadPublicBlogForSeo(id: string): Promise<Blog | null>`, `buildBlogMetadata(blog: Blog, slug: string, authorName?: string): Metadata`, and `buildBlogJsonLd(...)`.
- Consumes: `normalizeSeoText`, `pageMetadata`, stable publisher identifiers, `getCardContent`, and existing blog API types.

- [x] **Step 1: Add failing metadata and schema tests**

```ts
expect(metadata.alternates).toEqual({
  canonical: "https://monkeys.com.co/blog/useful-post-123",
});
expect(metadata.description).toBe(
  "The first substantial paragraph from the post.",
);
expect(JSON.stringify(schema.publisher)).toContain(
  "Buddhicintaka (OPC) Pvt. Ltd.",
);
expect(schema.mainEntityOfPage["@id"]).toContain("/blog/useful-post-123");
expect(JSON.stringify(metadata)).not.toContain("/en-US");
```

- [x] **Step 2: Run the post SEO tests and confirm they fail**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/blog/blogSeo.test.ts`

Expected: FAIL because post SEO currently has two metadata owners and incorrect schema URLs.

- [x] **Step 3: Move all dynamic post SEO into `page.tsx` through `blogSeo.ts`**

Keep `layout.tsx` presentational only. Build descriptions from the first meaningful paragraph, sanitize HTML, use the actual image when valid, include publication and modification dates, and return noindex metadata for missing or non-public posts.

- [x] **Step 4: Reuse the request-scoped blog loader for metadata and rendering**

Wrap the server loader with React `cache` so `generateMetadata` and the page body do not make duplicate requests for the same post ID during one render.

- [x] **Step 5: Run post SEO and existing blog tests**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/blog/blogSeo.test.ts`

Expected: PASS.

### Task 4: Server-rendered topic exploration

**Files:**

- Create: `apps/the_monkeys/src/lib/topicCatalog.ts`
- Create: `apps/the_monkeys/src/app/topics/explore/TopicsExplorerClient.tsx`
- Modify: `apps/the_monkeys/src/app/topics/explore/page.tsx`
- Modify: `apps/the_monkeys/src/app/topics/explore/layout.tsx`
- Modify: `apps/the_monkeys/src/app/topics/explore/components/TopicsList.tsx`
- Test: `apps/the_monkeys/__tests__/src/app/topics/ExploreTopicsPage.test.tsx`
- Test: `apps/the_monkeys/src/lib/topicCatalog.test.ts`

**Interfaces:**

- Produces: `normalizeCategoryCatalog(value: unknown): GetAllCategoriesAPIResponse`, `fetchTopicCatalog(): Promise<GetAllCategoriesAPIResponse>`, and a client component accepting `initialCategories`.
- Consumes: `/user/category`, `createTopicUrl`, existing topic controls, and shared collection metadata.

- [x] **Step 1: Add failing catalog normalization and server-markup tests**

```ts
expect(
  normalizeCategoryCatalog({
    category: { Business: { Topics: ["AI", "AI", 9] } },
  }),
).toEqual({ category: { Business: { Topics: ["AI"] } } });
expect(renderedHtml).toContain('href="/topics/ai"');
expect(renderedHtml).toContain("Business");
```

- [x] **Step 2: Run the topic exploration tests and confirm they fail**

Run: `pnpm --dir apps/the_monkeys test -- src/lib/topicCatalog.test.ts __tests__/src/app/topics/ExploreTopicsPage.test.tsx`

Expected: FAIL because the catalog is currently fetched only in the browser.

- [x] **Step 3: Fetch and render the catalog on the server**

Make `page.tsx` a server component. Pass normalized initial data to `TopicsExplorerClient` for letter filtering and authenticated add/follow actions. Keep topic links as normal anchors in initial HTML.

- [x] **Step 4: Add CollectionPage, ItemList, and breadcrumb JSON-LD**

The `ItemList` must contain canonical topic URLs derived only from normalized string topics.

- [x] **Step 5: Run the focused tests**

Run: `pnpm --dir apps/the_monkeys test -- src/lib/topicCatalog.test.ts __tests__/src/app/topics/ExploreTopicsPage.test.tsx`

Expected: PASS.

### Task 5: Topic detail metadata, validation, and ItemList

**Files:**

- Create: `apps/the_monkeys/src/app/topics/[topic]/topicSeo.ts`
- Modify: `apps/the_monkeys/src/app/topics/[topic]/page.tsx`
- Test: `apps/the_monkeys/__tests__/src/app/topics/topicSeo.test.ts`
- Extend: `apps/the_monkeys/__tests__/src/app/topics/BlogsByTopic.test.tsx`

**Interfaces:**

- Produces: `fetchTopicPosts(topic: string): Promise<GetMetaFeedBlogs>`, `buildTopicMetadata(topic: string, slug: string, posts: MetaBlog[]): Metadata`, and `buildTopicJsonLd(...)`.
- Consumes: normalized post records, `slugToTopic`, `topicToSlug`, `pageMetadata`, and the stable website identifiers.

- [x] **Step 1: Add failing topic metadata and ItemList tests**

```ts
expect(metadata.title).toEqual({
  absolute: "Business Posts and Community | Monkeys",
});
expect(schema.mainEntity.itemListElement[0].url).toContain("/blog/");
expect(schema.mainEntity.numberOfItems).toBe(2);
expect(JSON.stringify(metadata).toLowerCase()).not.toContain(
  "blogging community",
);
```

- [x] **Step 2: Run the topic tests and confirm they fail**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/topics/topicSeo.test.ts __tests__/src/app/topics/BlogsByTopic.test.tsx`

Expected: FAIL because the ItemList is empty and copy is blogging-only.

- [x] **Step 3: Implement one cached topic fetch and one schema builder**

Use the same normalized post list for metadata, JSON-LD, count text, and visible cards. Reject blank, malformed, and noncanonical topic slugs with noindex or not-found behavior.

- [x] **Step 4: Run the focused tests**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/topics/topicSeo.test.ts __tests__/src/app/topics/BlogsByTopic.test.tsx`

Expected: PASS.

### Task 6: Event and group privacy-safe schemas

**Files:**

- Modify: `apps/the_monkeys/src/lib/seoSchema.ts`
- Modify: `apps/the_monkeys/src/app/events/[slug]/eventMetadata.ts`
- Modify: `apps/the_monkeys/src/app/events/[slug]/page.tsx`
- Modify: `apps/the_monkeys/src/app/groups/[slug]/groupMetadata.ts`
- Modify: `apps/the_monkeys/src/app/groups/[slug]/page.tsx`
- Test: `apps/the_monkeys/__tests__/src/app/events/eventMetadata.test.ts`
- Test: `apps/the_monkeys/__tests__/src/app/groups/groupMetadata.test.ts`
- Test: `apps/the_monkeys/src/lib/seoSchema.test.ts`

**Interfaces:**

- Produces: request-scoped event and group loaders, privacy-safe `eventJsonLd`, and semantically correct `groupJsonLd`.
- Consumes: existing `EventItem`, `GroupItem`, event time helpers, and stable publisher references.

- [x] **Step 1: Add failing privacy and semantics assertions**

```ts
expect(JSON.stringify(eventJsonLd(event))).not.toContain(event.meeting_link);
expect(eventJsonLd(event).location).toEqual({
  "@type": "VirtualLocation",
  url: "https://monkeys.com.co/events/public-event",
});
expect(groupJsonLd(group)).not.toHaveProperty("numberOfEmployees");
expect(groupJsonLd(group).interactionStatistic).toMatchObject({
  userInteractionCount: 42,
});
```

- [x] **Step 2: Run event and group tests and confirm they fail**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/events/eventMetadata.test.ts __tests__/src/app/groups/groupMetadata.test.ts src/lib/seoSchema.test.ts`

Expected: FAIL for meeting-link leakage and employee-count misuse.

- [x] **Step 3: Correct schemas and deduplicate request loaders**

Use the public event page as the VirtualLocation URL. Represent group membership with `InteractionCounter` and `JoinAction` where supported. Retain authenticated lookups for page access while never serializing private fields.

- [x] **Step 4: Run the focused tests**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/events/eventMetadata.test.ts __tests__/src/app/groups/groupMetadata.test.ts src/lib/seoSchema.test.ts`

Expected: PASS.

### Task 7: Public profile metadata and ProfilePage schema

**Files:**

- Create: `apps/the_monkeys/src/app/[username]/profileSeo.ts`
- Modify: `apps/the_monkeys/src/app/[username]/layout.tsx`
- Test: `apps/the_monkeys/__tests__/src/app/profile/profileSeo.test.ts`

**Interfaces:**

- Produces: `loadPublicProfile(username: string)`, `buildProfileMetadata(profile, username)`, and `buildProfileJsonLd(profile, username)`.
- Consumes: `GetPublicUserProfileApiResponse`, `pageMetadata`, profile-image URL fallbacks, and stable website identifiers.

- [x] **Step 1: Add failing profile metadata and privacy tests**

```ts
expect(schema["@type"]).toBe("ProfilePage");
expect(schema.mainEntity).toMatchObject({
  "@type": "Person",
  alternateName: "@ada",
});
expect(JSON.stringify(schema)).not.toContain("contact_number");
expect(metadata.alternates?.canonical).toBe("https://monkeys.com.co/ada");
```

- [x] **Step 2: Run the profile test and confirm it fails**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/profile/profileSeo.test.ts`

Expected: FAIL because the existing schema contains only the username and incorrectly describes Monkeys as an employer.

- [x] **Step 3: Build metadata and JSON-LD from one cached public profile fetch**

Use public name, bio, public social URLs, topics, canonical URL, and profile image only. Missing profiles receive noindex metadata and no Person schema.

- [x] **Step 4: Run the profile test**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/profile/profileSeo.test.ts`

Expected: PASS.

### Task 8: Resilient sitemaps and post RSS

**Files:**

- Modify: `apps/the_monkeys/src/lib/seoCatalog.ts`
- Modify: `apps/the_monkeys/src/lib/seoFeed.ts`
- Modify: `apps/the_monkeys/src/app/sitemap.ts`
- Modify: `apps/the_monkeys/src/app/topics/sitemap.ts`
- Modify: `apps/the_monkeys/src/app/events/sitemap.ts`
- Modify: `apps/the_monkeys/src/app/groups/sitemap.ts`
- Create: `apps/the_monkeys/src/app/posts/feed.xml/route.ts`
- Test: `apps/the_monkeys/src/lib/seoCatalog.test.ts`
- Test: `apps/the_monkeys/src/lib/seoFeed.test.ts`
- Test: `apps/the_monkeys/__tests__/src/app/sitemap.test.ts`

**Interfaces:**

- Produces: `fetchPublicPosts`, `fetchPublicTopics`, normalized public catalog functions, canonical sitemap records, and `/posts/feed.xml`.
- Consumes: configured API origins, `MetaBlog`, event and group catalogs, `buildRssXml`, and URL normalizers.

- [x] **Step 1: Add failing malformed-record and canonical URL tests**

```ts
expect(
  normalizePublicPosts([{ blog_id: "1", title: "Valid" }, { blog_id: null }]),
).toHaveLength(1);
expect(sitemapUrls).not.toContain("https://monkeys.com.co/topics/sitemap.xml");
expect(sitemapUrls.some((url) => url.includes("unknown"))).toBe(false);
expect(postFeed).toContain("<link>https://monkeys.com.co/blog/valid-1</link>");
```

- [x] **Step 2: Run catalog, feed, and sitemap tests and confirm they fail**

Run: `pnpm --dir apps/the_monkeys test -- src/lib/seoCatalog.test.ts src/lib/seoFeed.test.ts __tests__/src/app/sitemap.test.ts`

Expected: FAIL because the main sitemap hardcodes an API origin, lists a sitemap as a page, and has no post RSS route.

- [x] **Step 3: Centralize normalized catalogs and update discovery routes**

Use configured API constants with production fallback, valid modification dates only, canonical slugs, and filtered public statuses. Keep profile sitemap creation out of this frontend change because no safe public profile catalog endpoint exists.

- [x] **Step 4: Add the post RSS route and advertise it from post-related metadata**

Use sanitized descriptions, canonical links, publication dates, and the existing RSS response cache headers.

- [x] **Step 5: Run the focused tests**

Run: `pnpm --dir apps/the_monkeys test -- src/lib/seoCatalog.test.ts src/lib/seoFeed.test.ts __tests__/src/app/sitemap.test.ts`

Expected: PASS.

### Task 9: Crawler policy and AI discovery text

**Files:**

- Modify: `apps/the_monkeys/src/app/robots.ts`
- Modify: `apps/the_monkeys/src/app/llms.txt/route.ts`
- Test: `apps/the_monkeys/__tests__/src/app/discoveryRoutes.test.ts`

**Interfaces:**

- Produces: explicit `OAI-SearchBot` and `ChatGPT-User` access, private-route disallows, complete sitemap declarations, and current `llms.txt` terminology.
- Consumes: `SITE_URL`, sitemap and feed route locations, and exact publisher identity.

- [x] **Step 1: Add failing crawler and text tests**

```ts
expect(robots.rules).toContainEqual(
  expect.objectContaining({ userAgent: "OAI-SearchBot", allow: "/" }),
);
expect(robots.sitemap).toContain("https://monkeys.com.co/events/sitemap.xml");
expect(llmsText).toContain("Buddhicintaka (OPC) Pvt. Ltd.");
expect(llmsText).toContain("/posts/feed.xml");
expect(llmsText).not.toMatch(/blogs|\u2014/i);
```

- [x] **Step 2: Run the discovery route test and confirm it fails**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/discoveryRoutes.test.ts`

Expected: FAIL because `OAI-SearchBot` is not explicit and `llms.txt` uses outdated wording.

- [x] **Step 3: Update robots and llms text**

Keep crawler training permissions separate from search discovery permissions. List all sitemap and RSS locations without allowing restricted application routes.

- [x] **Step 4: Run the focused test**

Run: `pnpm --dir apps/the_monkeys test -- __tests__/src/app/discoveryRoutes.test.ts`

Expected: PASS.

### Task 10: Performance safeguards and complete verification

**Files:**

- Modify if measurements justify it: `apps/the_monkeys/src/app/layout.tsx`
- Modify if measurements justify it: route-local layouts for Studio and Cards
- Update: tests created in Tasks 1 through 9

**Interfaces:**

- Consumes: all prior tasks.
- Produces: verified production output with no SEO regression and no unnecessary font preloads or client SEO code.

- [x] **Step 1: Prevent noncritical design fonts from preloading globally**

Set `preload: false` for Studio and card-only font families that must remain globally declared, or move those declarations to their route layouts if the variables are not required elsewhere. Keep Inter, DM Sans, and Newsreader behavior unchanged.

- [x] **Step 2: Run the full application test suite**

Run: `pnpm --dir apps/the_monkeys test`

Expected: all tests PASS.

- [x] **Step 3: Run application lint separately from the known workspace Biome issue**

Run: `pnpm --dir apps/the_monkeys lint`

Expected: PASS. Record the existing untouched `packages/ui` CRLF Biome failure separately if the root hook is invoked.

- [x] **Step 4: Run the production build**

Run: `pnpm --dir apps/the_monkeys build`

Expected: PASS with all public, sitemap, feed, robots, and `llms.txt` routes generated successfully.

- [x] **Step 5: Inspect representative server output**

Start the production server and verify `/`, one post, `/topics/explore`, `/topics/business`, `/search?query=ai`, one event, one group, and one public profile. Confirm canonical URLs, robots directives, JSON-LD, visible server-rendered topic links, and status codes.

- [x] **Step 6: Run final repository checks**

Run: `git diff --check`

Run: `$emDash = [char]0x2014; rg -n "$emDash|blogging community|/en-US|/de-DE|meeting_link" apps/the_monkeys/src/app apps/the_monkeys/src/lib`

Expected: no em dashes in controlled SEO copy, no obsolete blogging-only phrase, no unsupported language alternates, and no serialized private meeting link.

- [x] **Step 7: Scan changed files for common secret patterns**

Run: `git diff --name-only | ForEach-Object { if (Test-Path -LiteralPath $_) { Select-String -LiteralPath $_ -Pattern 'api[_-]?key|client[_-]?secret|private[_-]?key|password\s*[:=]|BEGIN [A-Z ]*PRIVATE KEY' -CaseSensitive:$false } }`

Expected: no secret-like values in changed files.

- [x] **Step 8: Stage only the verified relevant files**

Run: `git add -- docs/superpowers/specs/2026-09-14-comprehensive-seo-design.md docs/superpowers/plans/2026-09-14-comprehensive-seo-implementation.md apps/the_monkeys`

Run: `git status --short`

Expected: only comprehensive SEO implementation, tests, specification status, and plan files are staged. Do not commit or push.
