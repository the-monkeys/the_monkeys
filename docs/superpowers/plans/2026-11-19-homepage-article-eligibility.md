# Homepage Article Eligibility Implementation Plan

> **For agentic workers:** Execute the approved criteria in the existing isolated checkouts; independent frontend/backend integration may run in parallel. Use failing regressions before implementation and review the whole change before committing.

**Goal:** Keep published test/untitled/thin articles off every homepage article section while preserving publishing and all other discovery surfaces.
**Architecture:** Add a homepage-only HTTP feed backed by the existing blog metadata RPC with an explicit internal metadata selector. Evaluate stored EditorJS content on read; filter before logical offset/limit using bounded ES traversal. Legacy API/RPC callers remain unchanged. No database/index migrations, protobuf generation, new dependencies, or production operations.
**Tech Stack:** Existing Go/Gin/gRPC/Elasticsearch; React/Next.js/TanStack Query and existing Publishing readiness controls.
**Spec:** User approved the preceding criteria and 250 readable-word minimum, confirmed both earlier PRs merged, and authorized new branches from latest main on 2026-11-19.

## Approved rules and constraints
- Published public, non-archived, non-scheduled article; preserve existing public/group permissions. Legacy missing audience means public under current rules.
- Authored title, excluding exact normalized placeholders (including Untitled Post, Untitled, Test); legitimate longer titles containing testing remain valid. Do not synthesize a title from body text to qualify an untitled post.
- At least 250 readable body words, excluding the title, markup, URLs and editor placeholders. Support Unicode letters/marks, Hindi and scripts without ASCII word boundaries; use matching documented frontend/server counting fixtures.
- At least one usable non-placeholder topic.
- Lead additionally requires a persisted usable image reference; no fallback to an ineligible or image-less article. Preserve existing image load fallback for transport failure.
- All homepage article slots, including Trending, use the policy. An article below the threshold still publishes and appears on ordinary feeds/search/profile/topic routes with the existing permissions.
- Re-evaluate stored content on every homepage fetch; do not require new fields or republishing older content.
- No design changes, publishing gates, auth changes, dependencies, production operations, PR creation, or edits to the separate 18 staged mobile files.

## Stable interfaces
- Go package common/homepage: Version = homepage-v1, MinimumWords = 250, MetadataKey = x-monkeys-homepage-policy. Assess(doc map[string]interface{}) Assessment.
- Assessment JSON: eligible, lead_eligible, word_count, minimum_words, reasons, version. Title is a Go-only authored-title value for homepage metadata; never change global metadata titles.
- New GET /api/v2/blog/homepage?limit=12&offset=0&sort=latest|trending. Response: blogs[], has_more, homepage_policy_version. Each blog includes homepage_eligibility.
- Gateway attaches the policy metadata to existing GetBlogsMetadata RPC; blog service takes the new path only with exact version. Reject/mask unsupported policy responses so a mixed deployment cannot silently return unfiltered results.
- Homepage reader optional structural interface: GetHomepageBlogs(ctx context.Context, limit, offset int, blogIDs []string) ([]map[string]interface{}, bool, error). Empty IDs = latest order; nonempty IDs = caller's trending order. Use an explicit empty trending result without issuing an unrestricted ID query.
- New feed limit 1..50 and offset 0..1000. Bound traversal time and memory, clean up ES scroll contexts, propagate cancellation and fail on partial/time-out responses. Do not return misleading total_blogs from candidate totals.
- Trending starts with a bounded candidate window, widens when ineligible candidates occupy the first window, and filters before pagination. Deadline/candidate ceiling failures return an unavailable response rather than promoting unsuitable fallback articles.
- Frontend new homepage-specific service/query keys; preserve existing general-feed hooks and all default APIs. Parent invalidations for writes must also refresh homepage keys.
- Publishing readiness adds unscored Homepage placement checks; existing score calculation, Event readiness and publish/save actions stay unchanged.

## Tasks
- [ ] Parent: implement common/homepage pure policy with red/green tests for 249/250 boundary, placeholder exact matching, HTML/entities/URLs, Hindi/CJK, missing/legacy data, unknown blocks, draft/restricted/scheduled/archived states and cover references.
- [ ] Backend integration: implement bounded eligible-before-pagination reader, opt-in service branch and new gateway homepage/latest/trending handling with tests. Verify ordinary metadata calls and scopes remain unchanged.
- [ ] Frontend integration: request only the new homepage feed in SSR/client/Trending, separate its cache keys from general feeds, remove unsuitable lead fallback, and display unscored readiness explanations using current design. Test backward-compatible defaults and empty/error states.
- [ ] Parent: check cross-language policy fixtures, independent review, focused regressions/types/lint/build and real local API/browser checks at phone/tablet/desktop. Use no simultaneous heavy builds/full suites.
- [ ] Verify the original staged mobile fingerprint. Commit and push only relevant changes to codex/homepage-article-eligibility in both repos; no PR.

## Review focus
- Many newer test posts must not hide an older eligible post behind candidate pagination.
- Article edits, deletes or visibility changes must not leave a permanent eligible flag or cached public leak.
- Legacy articles without added metadata remain eligible when actual content satisfies the rule.
- HTML/URLs/title repetitions must not inflate readable-body counts; never render unsanitized metadata.
- No eligible lead, unavailable blog service or mixed service versions must never enable the old first-post fallback.

## Backend verification and rollout
- All six affected Go packages pass: common policy; blog database/service; gateway blog; activity database/service. Regressions cover exact 249/250 boundaries, legacy/Unicode/structured bodies, pagination after exclusions, permissions, canceled/partial searches, mixed blog versions, and a real gRPC response above 4 MiB.
- Real local API comparison: ordinary public feed still has the same 458 published records and first-page IDs. The short Hindi article h0bq remains published and readable at its existing URL, while absent from homepage Latest and Trending. Eligible offset pagination and the frontend proxy pass.
- Homepage Trending marks activity requests explicitly. Only those requests bypass the old limited cache and reject partial search results; ordinary activity callers retain their existing response behavior.
- No stored eligibility field, backfill, index/database migration, protobuf change, authentication change or publishing gate is required. Existing articles qualify on their next homepage read from their stored content.
- Deploy activity and blog services, then gateway, then frontend. An older frontend continues using its unchanged routes. The new frontend requires the homepage endpoint; missing/mixed policy responses display the existing unavailable state instead of an unfiltered fallback.
- Word counting is a deterministic readable-unit estimate: Unicode letter/number runs, combining marks and Indic joiners preserved; Han and Japanese kana count per character. It excludes the main title, URLs, markup, Markdown markers/reference definitions and placeholder-only content units. It is not a semantic-quality or SEO score.
- Local service replacement was restricted to blog, gateway and activity. All 18 other running containers retained their original IDs; Monkeys AI was not started.


## Frontend compatibility verification
- Homepage Latest and Trending have their own versioned query branch. Ordinary feeds and personalized caches retain their existing hooks and request formats.
- Successful article save, publish, delete, move-to-draft, schedule and group-visibility writes invalidate only homepage queries in addition to their existing invalidations.
- Fresh request-scoped server data remains in SSR and initial hydration. Browser revalidation withholds previously cached eligibility until it succeeds; failure does not restore an unfiltered fallback.
- Shared Unicode and full-document fixtures match the backend. Homepage placement is unscored and does not change existing article/event readiness scores or publish/save actions.
- Genuine in-app browser checks passed at 320x740, 390x844, 820x1180 and 1440x1000 without horizontal page overflow. The readiness drawer was inspected on mobile, tablet and desktop; publishing remained enabled for an ineligible draft. A local blank draft 6mkq2 was created for this check and was not published.
- Initial HTTP HTML contains the eligible lead and article cards before JavaScript executes. The existing Hindi article h0bq still opens at its unchanged URL while being absent from homepage cards.
- Existing fonts, page layout, responsive lead image, event/group/discussion controls, authentication, IDs, URLs and publishing request payloads are preserved. No production operations or pull requests were performed.
- Final validation: full frontend suite 1,440 tests in 213 files passed; final cache/write/hydration subset 15 tests passed. Standalone TypeScript, scoped lint and production-mode build passed. The final build used the real loopback backend, not synthetic catalog fixtures. Temporary generated output was archived outside the source tree and the original TypeScript configuration restored.
