# Monkeys local SEO audit and repair record

Started November 13, 2026. Verification continued after midnight on November 14.

## What was checked

This is an implementation audit against the local source and a synthetic local API. It does not use production accounts, production databases, production HTTP responses or another product's search data.

The installed Codex SEO audit, technical, sitemap and drift workflows were used, with the native adapter's safety and evidence rules. Their upstream method is pinned to `cca7e4a267991aca880efade1fd12e8498caf2ce`.

Saved initial HTML was checked for 13 page templates: the landing page, topic directory, topic detail, public post, events directory, event detail, groups directory, group detail, public creator profile, discussion directory, discussion detail, Studio X view and search. The main sitemap, post RSS and robots response were checked separately. The synthetic sitemap contains 18 URLs, including four fixture posts.

The test site is `http://127.0.0.1:3003`, backed only by an in-memory API on port 60736. Outbound application requests are restricted to loopback, with Google Fonts allowed for the local Next.js build. Browser resource policy blocks external application connections and images. Production URLs appear in canonical metadata as expected, but are not fetched.

## Repairs

1. **One post destination across discovery.** Long or formatted titles previously generated a different sitemap/RSS URL from the page canonical. The same existing 100-character metadata normalization now drives sitemap entries, RSS item links, topic structured links and public card destinations. The page canonical itself is unchanged. Full visible titles remain intact, including the Satoshi headline. Old aliases still resolve by their terminal post identifier.

2. **Useful content in the first response.** Event and group pages now seed their public detail queries from the data already loaded on the server. Creator layouts seed the public profile query through an explicit field allowlist. This supplies headings and author information before browser API calls. The real group header also displays a short description before its default Posts tab. The public event snapshot excludes the protected meeting link. Private/draft event and group snapshots are not seeded by this public path.

3. **Fresh viewer access.** Event and group detail queries explicitly refresh after hydration, even when the application-wide cache is fresh for one minute. This preserves confirmed RSVP meeting access and group management permissions rather than leaving a signed-in user on public first-paint data.

   Event reaction buttons also reconcile the refreshed viewer state while preserving pending optimistic changes. An identity generation and per-type request token ensure that an old failed request cannot undo a newer Like after logout/sign-in to the same account. Deferred-request tests cover both cases.

4. **Correct topic outage handling.** A failed topic catalog request no longer becomes an empty catalog and a false 404. A real successful catalog that lacks the topic still returns not-found. Temporary failures take the normal error path.

5. **Studio mode agrees with its metadata.** The server-selected `view=x` initializes the X controls and preview immediately. The existing URL-first and saved-tab preference behavior is retained.

6. **Accurate ticket offers.** Event structured data includes free tiers alongside paid tiers and marks exhausted capacity as sold out. An unlimited tier remains available. This changes public structured data, not ticket prices, checkout or RSVP APIs.

7. **Consistent publisher identity.** The visible product owner and copyright use the existing shared legal name: Buddhicintaka (OPC) Pvt. Ltd.

8. **Accessible discovery controls.** Social icons in the footer have readable link names. Discussion detail pages have an unobtrusive screen-reader heading using their existing headline logic. These changes add no visible introduction or new colors.

9. **Search sharing metadata.** Internal search remains `noindex, follow`; its social metadata now points to the search page rather than inheriting the homepage URL. Search queries are not copied into shared metadata.

10. **Focused style scanning.** Tailwind scans the shared UI source directory rather than recursively scanning the UI package's dependencies. All owned shared components remain included. This removes an observed build warning without changing theme values or breakpoints.

11. **Backend indexing cleanup, isolated locally.** Ordinary post publication no longer calls Google's restricted Indexing API or retired sitemap ping. The compatible repair retains `HandleSEOForBlog` and configuration fields while making unsupported submission a successful skip. It is separate from the original backend `main` checkout, on `codex/seo-post-discovery` under `C:/Users/Dave/.codex/worktrees/monkeys-seo-indexing-fix/the_monkeys_engine`. Only `microservices/the_monkeys_blog/internal/seo/seo.go` and its new `seo_test.go` change there.

## Existing SEO preserved

- Public metadata, canonicals, Open Graph, structured data, topic discovery, RSS and crawler rules remain in place.
- Search and personalized/private routes keep their indexing restrictions.
- Member-only posts, private groups and protected meeting access stay outside public schema.
- Browser timezone conversion, existing event forms, post editing and the optional free readiness reports retain their interfaces.
- No keyword-heavy hero, forced word count, automatic publishing block, paid service or new analytics tracker was added.

The current crawler policy permits ordinary public crawling by Google and Bing, explicitly allows OpenAI search/user crawlers and Perplexity, and leaves other public crawlers under its general rules. Access policy is separate from whether an engine has indexed or cited a particular page. Public RSS can continue to be consumed by feed readers and integrations without connecting user accounts.

## How tool warnings were interpreted

The tool's checks are observations, not a traffic score. Search `noindex` is intentional. Legacy post aliases are intentionally canonicalized to the existing destination. Studio's `view=x` is a meaningful public variant; the offline tool rejects query-bearing input base URLs, so its file was audited against the query-free base and the actual variant/canonical was inspected separately. Those expected differences were not treated as broken pages.

Short synthetic introductions do not establish thin production content. The first image reported by the parser was often the navigation logo, not the largest content image. Existing image wrappers reserve space through CSS, so a missing width attribute alone does not prove a layout shift. No user headline or username was changed to satisfy a heuristic.

## Verification ledger

- Regression tests first reproduced long/formatted title destination mismatches, missing initial public content, a false topic 404, the wrong initial Studio mode, missing/misleading ticket offers, publisher mismatch and unnamed controls.
- The final complete frontend run passed **981 tests across 173 files**. Earlier checkpoints also passed at 969, 975 and 980 tests; the final count includes all review regressions.
- Type checking and lint passed on the final code. Existing image-element and hook-dependency warnings remain in unrelated components.
- The final isolated production build passed using the synthetic local API. The shared first-load JavaScript remained 96.5 kB in the build report; this is a bundle measurement, not a Core Web Vitals score or traffic result. The dependency-scan Tailwind warning disappeared after narrowing the source path.
- Phone, tablet and desktop browser checks covered 320, 390, 768 and 1440 pixel widths. The Satoshi title was complete and there was no horizontal page overflow. Event, group, profile and Studio checks at 320, 768 and 1440 pixels also had no horizontal overflow. Studio selected the X tab. These checks used synthetic local data and retain the existing theme.
- Saved HTML checks cover 13 templates. The saved synthetic main sitemap passed the installed XML checks with 18 entries and no sitemap-format findings. Page availability was checked independently through local HTTP 200 responses.
- Independent review was completed and its important findings were fixed with failing-then-passing regressions. The final session-generation/request-token guard passed a fresh independent 3-test rerun with no remaining important finding in that scope.
- The original `codex/mobile-landing-fixes` branch remains in place with **18 staged files** and the same staged patch fingerprint. All **17 readiness feature files** matched their pre-audit hashes. This SEO checkout remains on `codex/free-creator-event-seo`, with no staged files. No commit or push was made.
- The original backend checkout remains on `main`; its unrelated edits were not used as the repair workspace. The backend fix remains uncommitted on its separate branch.
- Temporary Next.js TypeScript include paths were removed after verification; the tracked TypeScript configuration is unchanged. One earlier type-only check overlapped build-generated file cleanup and was rerun sequentially. Final source checks passed.
- The final group excerpt was visually inspected at 390 pixels in the real UI. A repeated multi-width pass timed out under concurrent build/test load; its temporary viewport was reset. Earlier group/header and other page checks at 320/768/1440 pixels are separate evidence, not an assertion that the interrupted pass completed.

### Independent review and backend checks

The review found and corrected adjacent-tag URL mismatches, a reaction-state refresh issue, an invented description assertion in a mocked group client, and privacy assertions that did not inspect the serialized query state. The revised tests use an actual public card, the real group header and direct dehydrated-state inspection. A further logout/sign-in request race was reproduced, fixed and independently rechecked. The reviewer reported no remaining important findings in that guard.

Backend SEO tests passed with a rejecting HTTP transport: three top-level tests, seven configuration/context cases and 32 concurrent calls. A fresh parent rerun also passed with dependency downloads disabled. The broader blog package run passed consumer, database, scheduler, SEO, services and audience tests, and compiled the blog entry point. `go vet` and formatting checks passed. Race instrumentation was unavailable because this local toolchain has no cgo C compiler; no compiler was installed and no live publishing flow was exercised.

The durable technical facts are saved beside this report in `2026-11-13-local-seo-baseline.json`. Full local logs and transient HTML/tool output are under `apps/the_monkeys/.next/seo-audit/`. The baseline labels its synthetic records and capture checkpoints explicitly.

## Two-week comparison

Use a deployment annotation and compare Monkeys only. Keep the creator/event-host work and this repair set identifiable. The proposed first review is November 27, 2026; use 14 complete days after deployment if deployment occurs later.

1. Record the deployed frontend/backend revisions and date. No deployment happens in this task.
2. Export Search Console site totals and page-level results for the 14 days before deployment and the 14 complete days after it. Keep query rows separate from site totals.
3. Compare clicks, impressions, CTR and position by page family: posts, events, topics, groups, discussions and Studio. Segment mobile/desktop and country, and distinguish new content from existing URLs.
4. Inspect representative canonical URLs and sitemap coverage. Record false 404s, indexing errors and duplicate-canonical selection separately from traffic.
5. Compare organic landing sessions and actual actions such as post reading, RSVP starts/completions, group joins and Studio use, using existing consented analytics or supplied exports.
6. Check a fixed list of relevant AI-search questions and record the date, engine, cited URL and whether Monkeys was actually mentioned. Crawler permission alone is not a citation result.
7. Use field Core Web Vitals when available. Keep these separate from local development timings and synthetic lab scores.

No Monkeys Search Console, analytics or AI-citation export was supplied. Those baseline cells are unmeasured, not zero. The local HTML and tests provide the technical comparison baseline. No BusinessNetworkIndia coordination or cross-product data was used in this task.

## Follow-up candidates

- Review the large existing client bundles on topic, group and event routes, beginning with icon imports and client-only controls. Server-rendered content now reduces their dependency on waiting for browser data; a bundle refactor needs its own compatibility and visual checks.
- Investigate legacy posts whose catalog H1 title differs from the first header chosen by existing page metadata. A future additive canonical field in the public catalog can remove this older ambiguity without changing established page URLs. The normalization repair here covers the same-title long/markup cases and does not claim to resolve differing source titles.
- Review the existing automatic donation overlay separately with the product owner. It can cover first-visit content; no donation behavior was changed here.
- Validate real search coverage and field performance after the user deploys, using the comparison above.

## Policy references

Only official documentation was fetched during this task; Monkeys production was not accessed.

- [Google Indexing API eligibility](https://developers.google.com/search/apis/indexing-api/v3/using-api)
- [Google's retired sitemap ping endpoint](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)
- [Event structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/event)
