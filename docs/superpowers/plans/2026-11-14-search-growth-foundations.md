# Search growth foundations implementation plan

**Goal:** Improve public discovery and useful search landing pages using the observed Monkeys Search Console evidence.

**Approved scope:** Extend the current frontend and backend SEO branches. Preserve backward compatibility, the existing design and the separately staged mobile fixes. Keep implementation and tests local. The business target is 100,000 monthly search clicks; this change does not represent a measured traffic forecast.

**Architecture:** Incrementally improve the existing Next.js server-rendered collections and Go public catalog. Preserve existing routes and APIs. Use actual public posts for collections and existing Studio capabilities for useful product content. Do not publish bulk empty landing pages.

**Constraints:** No production calls or writes during implementation; no credentials, new dependencies, database mutations or protobuf generation. Existing draft/private/member-only behavior stays protected. Do not change either branch. Use the existing Tailwind version, theme, components and mobile breakpoints. No em dashes in controlled product copy.

## Evidence and decisions

- Search Console export: 56 Google Web clicks, 3,496 impressions, 14 October to 10 November 2026. Visible query rows omit anonymized traffic and are not site totals.
- Google reports no manual actions or security issues. The indexing sample includes empty-looking topic pages and real posts awaiting indexing.
- The current topic sitemap includes every catalog topic. Topic post fetch failures become an empty collection. The public catalog's parsing assumes every legacy block has well-formed nested fields.
- Chosen approach: repair these existing discovery paths and add useful, modest public Studio/learning content. Avoid a redesign, fabricated editorial content, paid tools and mass-generated thin pages.

## Tasks

- [x] **Public catalog compatibility:** Add failing Go tests with a local rejecting/fake transport for legacy/malformed block records and catalog pagination semantics. Preserve H1 title preference; add safe legacy fallbacks without changing the response contract. Keep privacy filters and fix only verified defects. Run the affected and broader blog tests.
- [x] **Topic discovery integrity:** Add failing tests for catalog topics with no public posts, private/malformed metadata, server failures and capped pagination. Exclude genuinely empty topics from the topic sitemap using the existing public post catalog, not one request per topic. Keep valid empty topic URLs usable with noindex/follow and honest navigation. Failures must stay failures, rather than looking like empty content.
- [x] **Useful public entry points:** Improve the existing Snapshot landing page's server-rendered product explanation while preserving signed-in functionality. Add a focused learning collection built from real public posts with crawlable links, existing theme and responsive layout. Test metadata, link destinations and guest/signed-in compatibility.
- [x] **Integration and verification:** Wire discovery links and sitemap entries; verify all existing public page families retain their metadata/privacy rules. Run relevant regressions, full frontend suite, type checking, lint, isolated build and local mobile/tablet/desktop checks. Review the final diff and verify the original 18-file mobile index fingerprint is unchanged.

## Review focus

1. Legacy post blocks missing text, level, file or nested objects must not panic or disappear silently when a useful title can be recovered.
2. API failures must not remove valid topic content from search as if it were empty.
3. Backend page-size caps, duplicate pages and inaccurate totals must not silently truncate public discovery.
4. Private posts, private group context and member data must never appear in public collections or schemas.
5. Server-rendered product content must not break Snapshot selection, login handling, editor links or narrow-screen layout.

## Delivery

Keep changes reviewable on the existing branches. This implementation does not deploy, submit URLs, send outreach, alter creator posts or spend money. Record verification and any genuine follow-up separately from traffic outcomes.

## Verification status

- Frontend: 1,009 tests across 178 files, production build and restored-config type check passed. Full lint plus the final RSS-file lint checks passed.
- Independent review findings were fixed and rechecked: premature-empty catalogs, deep pagination, oversized public requests, cancellation and bounded recent RSS.
- The user restored the browser connection. Local viewport checks covered phone (320px and 390px), tablet (768px) and desktop (1440px), with light and dark theme checks. The narrow empty-topic button adjustment passed its rebuilt-preview recheck, final frontend suite and scoped lint.
- The user authorized committing and pushing on the same SEO branches after verification. No deployment, indexing submission or production mutation is authorized by this step. The original staged mobile patch is preserved.
