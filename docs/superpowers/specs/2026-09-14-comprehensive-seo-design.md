# Comprehensive SEO and AI Discovery Design

**Date:** 2026-09-14
**Status:** Approved for implementation
**Product:** Monkeys
**Legal publisher:** Buddhicintaka (OPC) Pvt. Ltd.

## Context

Monkeys is no longer only a blogging product. It is a content and community platform where people publish posts, discover topics and authors, create or join groups, and host or attend events. It also includes creator tools such as social snapshots and digital business cards.

The current implementation has useful SEO foundations, including server metadata, canonical URLs, structured data, XML sitemaps, RSS feeds, `robots.txt`, and `llms.txt`. Live verification also confirms that public Monkeys pages can be fetched by conventional crawlers, `OAI-SearchBot`, and `ChatGPT-User`.

The remaining problems are consistency, route classification, entity identity, server-rendered discovery, sitemap quality, and metadata duplication. Some metadata still describes Monkeys primarily as a blogging platform. The legal relationship between Monkeys and Buddhicintaka is not represented correctly. Some pages advertise unsupported language alternatives, the post route generates metadata in two places, and the topic catalog is populated only after client-side JavaScript runs.

## Goals

1. Give every public route accurate, unique, and stable metadata.
2. Represent Buddhicintaka (OPC) Pvt. Ltd. as the legal publisher and Monkeys as its product and brand.
3. Make public posts, topics, events, groups, profiles, and product tools easy for search and AI crawlers to discover.
4. Prevent private, user-specific, thin, and unlimited query URLs from entering search indexes.
5. Remove obsolete blogging-only language and use consistent product terminology.
6. Make important discovery content available in server-rendered HTML.
7. Produce resilient, complete, and internally consistent sitemaps and feeds.
8. Add automated checks for metadata, crawl rules, schemas, and malformed API responses.
9. Preserve mobile-first behavior and avoid adding blocking client work.
10. Avoid em dashes in visible product copy and SEO metadata.

## Non-goals

1. Guaranteeing a particular ranking position. Search and AI ranking depend on external authority, content quality, competition, engagement, and time.
2. Indexing arbitrary internal search-result URLs.
3. Publishing private member data or private group and event content.
4. Rewriting the BUDDHICINTAKA website in this branch.
5. Adding future product capabilities before they are available.
6. Using keyword repetition as a substitute for useful content.

## Success criteria

The implementation is successful when:

1. Every route has an intentional index or noindex policy.
2. Every indexable page has one canonical URL that points to itself or its correct canonical equivalent.
3. Unsupported `/en-US` and `/de-DE` alternates are absent until localized pages exist.
4. Public posts, topic pages, event pages, group pages, and profiles have complete server-rendered metadata and structured data.
5. `/topics/explore` exposes crawlable topic links in the initial HTML.
6. `/search` and all query variants use `noindex, follow` and do not appear in sitemaps.
7. Private routes use `noindex` and are excluded from all discovery feeds.
8. The schema graph connects Monkeys to Buddhicintaka (OPC) Pvt. Ltd.
9. `robots.txt` explicitly permits `OAI-SearchBot` and does not accidentally expose private routes.
10. All sitemap URLs return valid public resources and contain valid modification dates when available.
11. Lighthouse SEO reaches 100 on representative public pages where the audit applies.
12. Structured data tests and the production build complete without critical errors.

## Product positioning

The primary description is:

> Monkeys is a content and community platform for publishing thoughtful posts, discovering events, and building communities around shared interests. It is created and operated by Buddhicintaka (OPC) Pvt. Ltd.

The supporting positioning is:

> Monkeys brings posts, authors, topics, groups, and community-led events into one connected experience.

The brand remains **Monkeys**. Supporting metadata and structured data may use **Monkeys by Buddhicintaka** as an alternate identity, but the visible logo and product name do not change.

## Entity architecture

The homepage will expose a connected JSON-LD graph with stable identifiers:

1. `Organization` for Buddhicintaka (OPC) Pvt. Ltd.

   - Stable `@id` based on `https://buddhicintaka.com/#organization`.
   - Exact legal name.
   - Company URL, logo, location, and verified social profiles when available.
   - A `brand` relationship to Monkeys.

2. `Brand` for Monkeys.

   - Stable `@id` based on `https://monkeys.com.co/#brand`.
   - Product name, URL, logo, and description.
   - Referenced by the Buddhicintaka organization's `brand` property.

3. `WebSite` for Monkeys.

   - Stable `@id` based on `https://monkeys.com.co/#website`.
   - Publisher relationship to Buddhicintaka.
   - Brand relationship to Monkeys.
   - `alternateName` set to `Monkeys by Buddhicintaka`.

4. `CollectionPage` for the landing page.
   - References the website and its major public collections.
   - Describes posts, topics, events, groups, and authors without claiming unavailable functionality.

Detail schemas will refer to these stable identifiers instead of recreating disconnected organization objects on each route.

## Route indexing policy

### Public pages to index

- `/`
- `/feed`
- `/about`
- `/contact-us`
- `/support`
- `/topics/explore`
- `/topics/[topic]` when the topic is valid
- `/blog/[slug]` when the post is published and publicly accessible
- `/events`
- `/events/[slug]` when the event is public and published
- `/groups`
- `/groups/[slug]` when the group is public and published
- `/[username]` when the profile is public
- Public product-tool landing pages such as `/snapshot` and `/snapshot/new`
- `/cards` as a product landing page if it can be separated from private card data
- Public legal pages

### Pages to keep out of the index

- `/search` and every `?query=` variation
- `/auth/*`
- `/settings`
- `/notifications`
- `/library`
- `/activity` when it is user-specific
- `/create`
- `/edit/*`
- Creation, edit, manage, request, and member-management routes
- Invitation-token routes
- API routes
- Private or draft posts, events, groups, profiles, cards, and snapshots

Search will use `noindex, follow`. This allows search-result links to be followed without creating unlimited indexable query combinations. High-value recurring queries should be represented by curated topic or collection pages.

## Metadata architecture

SEO constants and helpers will live in the existing `src/lib/seo.ts` area or focused modules beside it. They will provide:

- Canonical URL normalization.
- Title and description sanitization.
- Safe truncation with useful fallbacks.
- Shared index and noindex directives.
- Publisher and website entity references.
- Open Graph and social-card defaults.
- Route-specific metadata builders.

Dynamic routes will have one metadata owner. In particular, `/blog/[slug]` will no longer generate competing metadata in both `page.tsx` and `layout.tsx`.

Global metadata will provide only safe defaults. It will not declare a homepage canonical or language alternatives that can be inherited incorrectly by unrelated routes.

Localized alternatives will be omitted until real localized URLs and translated content exist.

## Route-specific metadata

### Landing page

- Position Monkeys as a content and community platform.
- Mention posts, topics, events, groups, and authors naturally.
- Use a self-referencing canonical.
- Provide the root entity graph.

### Posts

- Use the actual post title as the primary title.
- Derive a meaningful description from the first substantial text block.
- Include canonical URL, representative image, author, topics, date published, and date modified.
- Use `Article` or `BlogPosting` consistently.
- Return a proper 404 or noindex state when the post cannot be published publicly.

### Topic exploration

- Server-render the topic catalog and links.
- Use `CollectionPage`, `ItemList`, and breadcrumb structured data.
- Give the page a self-referencing canonical and clear discovery description.

### Topic detail pages

- Use the normalized topic name in the title and description.
- Include real post items in the `ItemList` when available.
- Reuse one cached server fetch for metadata and page rendering.
- Do not index invalid or empty generated slugs that do not represent real topics.

### Search

- Use a professional static title and description.
- Set `noindex, follow` for the page and query variants.
- Keep search results out of all sitemaps.
- Preserve crawlable links from results for user navigation.

### Events

- Use public event metadata, canonical URL, image, organizer, attendance mode, location, start date, end date, status, and offers.
- Never expose a private online meeting URL in metadata or structured data.
- Index only public published events.

### Groups

- Use group name, description, image, organizer, public location, and topics.
- Represent groups without misusing employee-related schema properties.
- Index only public groups.

### Profiles

- Use `ProfilePage` with a `Person` main entity.
- Index public profiles only.
- Avoid exposing private account fields.

### Product tools

- Index stable product landing pages with `WebApplication` schema.
- Keep private or user-generated artifact routes out of the index unless explicit public visibility exists.
- Keep the `/cards` product landing page indexable while child card routes remain excluded unless an explicit public-visibility model exists.

## Server rendering and data flow

Important public collections must not depend on client-only API calls for their initial links and content.

The implementation will:

1. Fetch the topic catalog on the server for `/topics/explore`.
2. Pass normalized data into an interactive client component for filtering and authenticated actions.
3. Reuse cached server fetch functions between metadata and page rendering where Next.js request memoization does not already deduplicate them.
4. Normalize all untrusted API fields before metadata, schema, or JSX rendering.
5. Preserve useful page content when optional APIs fail.
6. Avoid adding browser-side public IP or geolocation work to SEO rendering paths.

## Sitemap and feed architecture

Discovery will be divided by resource type:

- Main static sitemap for canonical public landing pages.
- Post sitemap for published posts.
- Topic sitemap for valid topic collections.
- Event sitemap for public published events.
- Group sitemap for public groups.
- Profile sitemap for public profiles when the API can provide a safe public catalog.

The main sitemap will not list sitemap XML files as ordinary webpage URLs. `robots.txt` or a sitemap index will advertise sitemap files.

Sitemap generation will:

- Exclude private, draft, deleted, malformed, and unknown resources.
- Use actual modification timestamps.
- Use cached fetches and preserve the last valid catalog where the deployment platform permits it.
- Avoid returning malformed placeholder URLs when an API response is incomplete.
- Split sitemaps when platform limits require it.

A public post RSS feed will be added alongside the existing event and group feeds. Feeds will contain canonical URLs and sanitized summaries.

## AI discovery

`robots.txt` will explicitly declare public access for:

- `OAI-SearchBot`
- `ChatGPT-User`
- Other already supported search and assistant crawlers where desired

Search visibility and model-training permissions will not be treated as the same setting. This branch will preserve the current GPTBot permission while explicitly adding the crawler used for OpenAI search. A future training-policy change requires a separate business decision.

`llms.txt` will be updated to:

- Identify Monkeys and its legal publisher.
- Describe posts, topics, authors, events, groups, and public product tools.
- Link to canonical collections, sitemaps, and RSS feeds.
- Use current terminology.
- Avoid em dashes.

AI visibility is supported by readable server-rendered pages, stable URLs, clear authorship, publication dates, citations, and consistent publisher identity. `llms.txt` is a supporting hint and not a ranking guarantee.

## Performance requirements

SEO work must not increase the existing client bundle unnecessarily.

- Keep schema and metadata generation server-side.
- Prefer server components for public discovery content.
- Hydrate only controls that require interaction.
- Avoid duplicate metadata and page API requests.
- Lazy-load development-only and non-critical tools.
- Preserve image dimensions and responsive image behavior.
- Measure representative landing, post, topic, event, and group pages after implementation.

## Error handling

- Invalid public slugs return a proper 404 where the resource is absent.
- Private resources return an appropriate not-found or noindex response without leaking private metadata.
- Metadata generation uses safe fallbacks and never crashes the page.
- Malformed API records are filtered from schemas, sitemaps, feeds, and visible collections.
- Temporary catalog failures do not generate placeholder URLs.
- Recovery pages remain noindex and provide user navigation.

## Testing strategy

Automated coverage will include:

1. Global entity graph and exact legal publisher name.
2. Route-level canonical generation.
3. Index and noindex classification.
4. Absence of unsupported language alternatives.
5. Post metadata and schema from valid and malformed content.
6. Topic exploration server-rendered links.
7. Topic `ItemList` population.
8. Search `noindex, follow` behavior for query variants.
9. Event meeting-link privacy in metadata and schema.
10. Group schema semantics.
11. Sitemap filtering, canonical URLs, and modification dates.
12. `robots.txt` coverage, including `OAI-SearchBot`.
13. `llms.txt` product and publisher identity.
14. No em dashes in controlled SEO copy.
15. Production build and representative metadata snapshots.

Manual verification will cover:

- Google Rich Results Test for representative structured-data types.
- Google Search Console URL inspection after deployment.
- Sitemap submission and index coverage.
- Bing Webmaster Tools and optional IndexNow integration.
- Live responses for standard crawlers, `OAI-SearchBot`, and `ChatGPT-User`.
- Lighthouse SEO and performance checks on mobile and desktop.

## Branch and delivery strategy

The implementation branch is `codex/comprehensive-seo`, based on `codex/production-ui-stability`. This preserves the server-rendering and error-containment work from PR #710.

The SEO pull request should remain stacked on PR #710 until that pull request merges. It can then be rebased or retargeted to `main` without mixing unrelated backend changes.

Backend changes are not required for the metadata and rendering work. If new public profile or content catalogs are needed for complete sitemaps, those API additions will be proposed separately rather than assumed in the frontend branch.

## Deployment sequence

1. Merge and deploy PR #710.
2. Merge and deploy the comprehensive SEO branch.
3. Validate live metadata, schemas, robots rules, sitemaps, feeds, and status codes.
4. Submit sitemaps in Google Search Console and Bing Webmaster Tools.
5. Request re-indexing for the homepage and representative collection pages.
6. Monitor crawl errors, indexed pages, canonical selection, search queries, impressions, and Core Web Vitals.
7. Update the BUDDHICINTAKA products page with a dedicated Monkeys URL and reciprocal entity markup in a separate change.
