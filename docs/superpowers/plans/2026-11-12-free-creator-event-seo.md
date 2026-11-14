# Free Creator and Event SEO Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Give post creators and event hosts free, understandable search and AI readiness feedback without changing saved content or existing SEO behavior.

**Architecture:** Read copies of the current draft or event form into a small shared analysis model. Run versioned local checks and show an optional report through the existing drawer design. Keep public metadata generation authoritative and unchanged; add no payment, model-provider or database dependency for the first release.

**Tech Stack:** Existing Next.js 14 App Router, React 18, TypeScript, Tailwind, Monkeys UI primitives, MonkeysEditor, Vitest and Testing Library. Reuse existing event time and SEO helpers. No new package is planned.

**Spec:** `docs/superpowers/specs/2026-11-12-free-creator-event-seo-design.md`

**Status:** Tasks 1-7 implemented and verified locally on 12 November 2026. See the verification document for actual coverage and limits. Task 8 is a separate backend cleanup. Later groups, discussions, comments, visibility reporting and optional model assistance remain separate.

## Global Constraints

- All checks and detailed reports shipped in this project are free. No payment gates, credits, subscriptions or upgrade prompts.
- Do not change existing public metadata, canonical URLs, slugs, saved documents, editor title behavior or event instants.
- Reports never block valid saving, publishing, scheduling or RSVP.
- No external model or ranking-provider calls in the first release. No analysis endpoint, database migration or protobuf change is required.
- Preserve private/member/group visibility and never expose private meeting links or attendee data.
- Keep user-written content unchanged. Use existing Monkeys styling, mobile-first layouts, dark mode and 44px touch targets. Use post in visible product copy. Do not introduce em dashes in controlled copy.
- Rules version is `creator-event-v1`. Refresh only while the report is open, after 800 milliseconds without a relevant edit.
- Analysis limits are 2,000 blocks, 200,000 extracted characters, 10,000 nested list nodes and 12 list nesting levels. Reaching a limit means Partial check, never data loss.
- Keep all current staged mobile landing changes and unrelated files untouched. Planning does not authorize a commit, push, merge, deployment or production access.
- At implementation time, use a dedicated branch in the visible checkout after the staged work has been handled. Do not move it or stash it automatically.
- If later work genuinely needs protobuf changes, ask the user to run their usual generation. Do not run or generate a protoc command.

## Review Focus

- Legacy or mixed editor blocks must not change the public title, description or canonical URL. Covered by Tasks 1-2.
- A late report must not replace results for a different revision, document or account, or recreate the editor. Covered by Tasks 3 and 5.
- Unsaved event values, pending covers, timezone changes and recurrence must be inspected without triggering submit, uploads or geocoding. Covered by Tasks 2 and 6.
- Private/unlisted/member content and unknown enclosing-group visibility must never produce an indexed/public claim or leak a meeting URL. Covered by Tasks 2, 4 and 7.
- Offline, malformed, unsupported and oversized input must leave the authoring flow usable and clearly identify incomplete checks. Covered by Tasks 2-7.

## In simple English

We first protect today's SEO with tests. Then we build a read-only analyser, a small report and its editor/event connections. Finally, we test all existing publishing flows and responsive layouts. Backend indexing cleanup is independent and should have its own review.

The first release gives a numerical estimate only for the explainable automated SEO checklist. Answer readiness and Source clarity show useful observations and human-review questions. We will not invent precise AEO/GEO scores from keyword counts or pretend a source link proves accuracy.

## File layout and ownership

All frontend paths below are relative to `local/the_monkeys`. The app is `apps/the_monkeys`.

- `src/lib/postSeoContent.ts`: shared pure extraction of the current public post SEO preview, without changing its results.
- `src/features/content-readiness/types.ts`: input, checks and report contracts.
- `src/features/content-readiness/adapters.ts`: read-only post and event adapters with bounded extraction.
- `src/features/content-readiness/rules.ts`: stable post/event check definitions and explanatory copy.
- `src/features/content-readiness/analyse.ts`: combine results, coverage and the deterministic SEO estimate.
- `src/features/content-readiness/useReadinessReport.ts`: revisions, timing, cancellation and failure state.
- `src/features/content-readiness/ReadinessPanel.tsx`: themed report and accessible drawer.
- `src/features/content-readiness/PostReadiness.tsx`: lazy authoring entry point using parent draft state.
- `src/features/content-readiness/EventReadiness.tsx`: event entry point using a safe form snapshot.
- Tests beside the pure engine/hook files; integration tests under the existing `__tests__/src` structure.

These files now implement the first release. `ReadinessPanelLoader.tsx` additionally contains local report-load failures so they cannot unmount the editor. No empty service, unused API adapter or future billing folder was added.

## Shared interfaces

Define these contracts in `src/features/content-readiness/types.ts` before connecting components:

- `ContentKind = 'post' | 'event'`.
- `VisibilityAssessment = 'public' | 'restricted' | 'unknown'`; this is provided from known permissions/context, not inferred from a score.
- `CheckStatus = 'pass' | 'improve' | 'manual' | 'not-applicable' | 'unknown'`.
- `ReadinessCheck`: stable `id`, section (`seo`, `answers` or `sources`), `status`, `scored` boolean, human-readable `label`, `finding`, `reason` and optional `fieldKey`.
- `ReadinessSnapshot`: `kind`, `revision` number, `resourceKey` string, `accountKey` string, visibility assessment, extracted title/description/body/headings/topics/images/links, optional author context, optional event schedule and public location, and extraction coverage flags. Do not include cookies, tokens, meeting URLs, attendee lists or embed payloads.
- `ReadinessReport`: rules version, resource/account/revision identifiers, nullable `seoScore`, `passedCount`, `applicableKnownCount`, `coverage` (`complete` or `partial`), visibility, checks, and a nullable existing-rule search preview. Answer/source sections have no numeric score in this version.
- `ReadinessState`: `idle`, `pending`, `current`, `stale` or `error`, plus the last report where appropriate.
- `toPostSnapshot(document: unknown, context: PostReadinessContext): ReadinessSnapshot`.
- `toEventSnapshot(values: EventReadinessValues, context: EventReadinessContext): ReadinessSnapshot`.
- `analyseReadiness(snapshot: ReadinessSnapshot): ReadinessReport`.
- `useReadinessReport(snapshot: ReadinessSnapshot | null, open: boolean): { state: ReadinessState; report: ReadinessReport | null; checkAgain: () => void }`.

`PostReadinessContext` contains the resource/account/revision identifiers, current topics/publication audience, draft/published state, and optional author context. `EventReadinessValues` contains only the current title, description, public cover reference or pending status, topics, event type, `startLocal`/`endLocal` strings, selected `timezone`, public venue, recurrence summary and visibility context. `EventReadinessContext` contains resource/account/revision identifiers, draft/published state, optional organizer context, known enclosing-group visibility, `isExistingEvent: boolean`, `eventEnded: boolean`, `savedTimezone?: string`, `savedStart?: ProtoTime` and `savedEnd?: ProtoTime`. Import `ProtoTime` as a type from the existing event types. Keep the existing `Blog`, `OutputData`, `EventBody` and `EventItem` API types unchanged.

The event adapter resolves each wall-time field exactly as current submission does: for an existing ended event, or when the selected zone matches the saved zone and the field equals `toLocalInput(originalInstant, selectedZone)`, preserve `toIsoTime(originalInstant)`. The saved-zone fallback remains the form's existing `UTC` fallback; do not persist it as a migration. Otherwise call `fromLocalInput` with the selected zone. Catch conversion failures as report findings without setting form errors. Keep resolved ISO instants in the schedule projection, never reparse a preserved instant from a display string.

## Task 1: Protect existing post metadata before reusing its preview

**Files:** Modify `apps/the_monkeys/src/app/blog/[slug]/blogSeo.ts`; create `apps/the_monkeys/src/lib/postSeoContent.ts`; extend `apps/the_monkeys/__tests__/src/app/blog/blogSeo.test.ts`.

**Interfaces:** Export `getPostSeoContent(document: unknown)` returning `{ title: string; description: string; image: string; articleBody: string }`. Its input is the existing `{ blocks: [...] }` document, not a full Blog API envelope. Existing public functions call it with `blog.blog`; the draft adapter supplies the matching document shape. It must reproduce current `blogContent` outputs, including fallbacks and limits, for the same block document. Public `buildBlogMetadata`, `canonicalBlogSlug` and `buildBlogJsonLd` signatures remain unchanged.

- [x] Add exact before/after metadata and canonical assertions for a normal post, legacy title block, first title/header mismatch, HTML/entities, long title, missing image, missing paragraphs, private post and draft. Include a canonical near the current title truncation boundary.
- [x] Record the current passing baseline before moving code. Add a failing direct shared-helper test before implementing the new export.
- [x] Move the existing public extraction logic into the pure helper without altering title precedence, current 100/160/5,000-character limits, fallbacks or URL/image choice. Keep public helper outputs identical. Do not run editor normalization here.
- [x] Run `pnpm --filter the_monkeys exec vitest run __tests__/src/app/blog/blogSeo.test.ts`. Expected: all baseline and new helper assertions pass.
- [x] Review the diff specifically for unchanged canonicals, private metadata and serialized Article data. Treat any changed public output as a regression, not an acceptable SEO improvement in this task.

## Task 2: Build read-only adapters and explainable rules

**Files:** Create `types.ts`, `adapters.ts`, `rules.ts`, `analyse.ts`, and `adapters.test.ts`/`analyse.test.ts` in `apps/the_monkeys/src/features/content-readiness/`. Reuse `src/lib/postSeoContent.ts` and `src/lib/eventTime.ts`.

**Interfaces:** Implement the snapshot and `analyseReadiness` contracts above. Pure analysis never performs network requests or writes to its input.

- [x] Add failing tests for each scored rule ID and the unscored observations listed in the design. Pin the score to 67 for two passes out of three known applicable checks, and to null for zero known applicable checks. Manual/unknown/not-applicable items must not change that denominator.
- [x] Add frozen-input tests covering null/missing values, mixed legacy blocks, nested lists, Markdown, citations, methodology/datasets, malformed images, empty links, hostile HTML, unsupported blocks, long non-Latin text and missing author names. Verify unchanged input and no `undefined` in visible messages.
- [x] Add limit tests for 2,001 blocks, text beyond 200,000 characters, list depth 13 and more than 10,000 list nodes. Expect partial coverage and preserved source content. Include a header beyond block 2,000 that changes the public title/canonical: the authoring report must omit its entire exact preview, mark preview-dependent checks unknown, and not call the uncapped helper. The public metadata baseline still returns its original full-document result. Unsupported source-bearing blocks must produce unknown source coverage rather than a false no-sources finding.
- [x] Add event tests for virtual/in-person/hybrid, invalid versus missing zones, preserved legacy timestamps, an unchanged repeated DST hour with non-zero seconds, a changed zone/wall time, end before start, past/completed events, recurring series, pending cover upload, tickets and unknown group visibility. Assert preserved/resolved instants equal the existing form's submitted instants. Verify snapshots contain no meeting URL, attendee fields, cookies or tokens.
- [x] Implement bounded adapters, the exact first-version rule set, optional observations, coverage and the deterministic score. Reuse current public preview output only when the post's extraction is complete; otherwise omit the exact preview without changing public metadata extraction. Mirror current event `pageMetadata`/`truncateMeta` inputs in the event preview and pin them against the public event page's existing output. Do not import the server page, cookies, or client-only code across boundaries.
- [x] Run `pnpm --filter the_monkeys exec vitest run src/features/content-readiness/adapters.test.ts src/features/content-readiness/analyse.test.ts`. Expected: all cases pass and a network stub records zero requests.

## Task 3: Refresh reports without interrupting writing

**Files:** Create `apps/the_monkeys/src/features/content-readiness/useReadinessReport.ts` and `useReadinessReport.test.tsx`.

**Interfaces:** Implement `useReadinessReport` above. Its identity is resource + account + revision, not title text alone.

- [x] With fake timers, prove that closed panels do no work, opening starts a check, multiple edits settle into one check after 800 milliseconds, closing/unmounting cancels scheduled work, and Check again runs against current values.
- [x] Simulate late results from a previous revision and a different resource/account. Expect them to be ignored. A new edit marks the displayed old report stale immediately.
- [x] Simulate an analysis error. Expect an actionable local retry state with no thrown page error and no save/publish state changes.
- [x] Implement the smallest scheduler and result identity guards. Keep reports in memory only; do not add local storage, analytics content logging or HTTP calls.
- [x] Run `pnpm --filter the_monkeys exec vitest run src/features/content-readiness/useReadinessReport.test.tsx`. Expected: all timing, identity and error cases pass.

## Task 4: Build the shared report using current design primitives

**Files:** Create `apps/the_monkeys/src/features/content-readiness/ReadinessPanel.tsx` and `ReadinessPanel.test.tsx`.

**Interfaces:** `ReadinessPanel` receives `open`, `onOpenChange`, `state`, nullable `report`, `onCheckAgain`, and optional `onGoToField(fieldKey: string)`. It does not fetch or save content.

- [x] Add tests for the three section labels, estimate/coverage explanation, partial check, stale/error states, passed/improve/manual findings, unknown data and intentional restricted visibility. A perfect automated score must not hide unresolved manual review items.
- [x] Add tests that private meeting URLs cannot appear in text or links; malicious snippets are text, not executable markup; no ranking guarantee, payment gate, upgrade action or invented traffic appears.
- [x] Add accessibility tests for drawer title/description, keyboard focus return, named close/check controls and non-color status descriptions. Refresh messages must not announce every keystroke or steal focus.
- [x] Implement using existing Drawer, Button and typography/theme tokens. Use one responsive report, with no new top-level H1 and no fixed height that hides the bottom actions behind the phone keyboard.
- [x] Run `pnpm --filter the_monkeys exec vitest run src/features/content-readiness/ReadinessPanel.test.tsx`. Expected: all behavior and accessibility assertions pass. Actual geometry is verified in Task 7.

## Task 5: Connect the post editor and current publish drawer

**Files:** Create `apps/the_monkeys/src/features/content-readiness/PostReadiness.tsx`; modify `apps/the_monkeys/src/app/edit/[blogId]/page.tsx` and `apps/the_monkeys/src/components/blog/actions/PublishBlogDrawer.tsx`; add `apps/the_monkeys/__tests__/src/components/editor/PostReadiness.test.tsx`.

**Interfaces:** `PostReadiness` consumes the existing parent's document/topics/publication state and the shared report hook. Own one report drawer at the editor-page level. If adding a summary to `PublishBlogDrawer`, add only an optional read-only `readiness?: { state: ReadinessState; report: ReadinessReport | null }` prop; old call sites remain valid. Only a current matching report may supply a score there. Do not nest/open a second drawer or run checks automatically when publishing. The legacy `PublishBlogDialog.tsx` is not the live editor entry point; do not wire a second hidden report there.

- [x] Add an integration test that opens readiness for a saved legacy post and a new draft, edits content, checks stale/current state, and closes the report. Assert the editor mount count, block IDs, title rule, selection and undo/redo behavior are unchanged.
- [x] Test that opening/checking/closing performs no extra editor save, WebSocket write, publish, schedule or audience change. Existing publish/schedule actions still work when analysis fails or is never opened.
- [x] Test members-only scope, a missing author profile, image upload in progress and description edits from the current drawer. Analysis must read updated content without turning the paragraph control into a new SEO override field.
- [x] Add the compact entry control and dynamically load the report from authoring routes. Reuse the parent's `data` snapshot and existing change callbacks. Do not put state inside the editor instance or rebuild its holder.
- [x] Run the new integration test plus `src/components/editor/index.test.tsx`, `src/components/editor/editorCrashGuards.contract.test.ts`, and `src/components/editor/postCanvas/` tests. Expected: report and existing title/history safeguards pass.

## Task 6: Connect event create and edit without changing submissions

**Files:** Create `apps/the_monkeys/src/features/content-readiness/EventReadiness.tsx`; modify `apps/the_monkeys/src/components/events/EventForm.tsx`; extend `apps/the_monkeys/__tests__/src/components/events/EventForm.test.tsx`; add `EventReadiness.test.tsx` beside the new entry component.

**Interfaces:** The event entry consumes a typed projection of current form values and controlled state. Create the projection in `EventForm` using its form reference and state; never call `handleSubmit` or `onSubmit` for analysis. Preserve `Props.onSubmit(body: EventBody, coverFile?: File)` unchanged.

- [x] Add tests proving an unsaved title/description and changed timezone/venue appear in the report. Check readiness must not submit the form, geocode a location, upload a cover or modify selected co-hosts.
- [x] Test create/edit, group-created events, virtual/hybrid/in-person, pending cover file, recurrence and old events with absent optional fields. Verify saved instants, venue coordinates, price units, recurrence body and RSVP options remain byte-for-byte equivalent for existing fixtures.
- [x] Test private/unlisted/group-member content and unknown group context. Expect restricted or unknown visibility explanations, never public indexing claims or private-link leakage. Preserve the existing server authorization boundary.
- [x] Add the report control and safe value projection. Compose with the existing `onChangeCapture` invalidation rather than replacing it; trigger revision changes for custom state setters as well as native form edits. Avoid converting the whole form to a new state library.
- [x] Run `pnpm --filter the_monkeys exec vitest run __tests__/src/components/events/EventForm.test.tsx src/features/content-readiness/EventReadiness.test.tsx`. Expected: old form submission tests and new report tests pass.

## Task 7: Verify existing discovery and release locally

**Files:** Existing SEO and form/editor tests; create `docs/superpowers/reviews/2026-11-12-free-creator-event-seo-verification.md` when implementation is actually tested. Do not create a report claiming unrun tests passed.

**Interfaces:** No new public route or backend endpoint. Public discovery responses remain the baseline from before Tasks 1-6.

- [x] Run the full frontend test suite with the existing package-manager version: `pnpm --filter the_monkeys exec vitest run --maxWorkers=2 --minWorkers=1`. Run TypeScript validation, scoped lint and the production build, recording exact commands and actual results. For the local build, use cached fonts/assets or a clearly documented local-only fixture where needed; do not contact production or ship a test-only font override.
- [x] Explicitly include existing `seo.test.ts`, `seoSchema.test.ts`, `seoCatalog.test.ts`, `seoFeed.test.ts`, `seoRoutePolicy.test.ts`, post/topic/profile/discussion metadata tests, sitemap tests and the existing editor title/history tests. Compare public metadata/JSON-LD output to the baseline; no unintended canonical, publisher, robots, feed or index-policy changes are allowed.
- [x] Browser-test local create/edit post and event routes at 320/390/430/768/1440px in light/dark themes, using the current design. Check keyboard focus, 44px targets, long text, drawer scrolling, mobile keyboard, existing save/publish controls and successful close/reopen without content loss.
- [x] Test offline reporting and an intentionally failed analyser, then successfully save/publish/schedule valid local fixtures through existing paths. Run normal event timezone/recurrence/venue checks and confirm readiness never changes their submitted values.
- [x] Measure a 10,000-word draft and a maximum-bound snapshot. Record the device and processing time. If analysis creates a main-thread task above 50 milliseconds, add a module-worker implementation behind the same pure contract and rerun the cancellation/error tests before calling performance complete.
- [x] Use restored local data or clearly labelled fixtures. Never replace the running preview's API destination without explaining it. Keep production requests blocked during tests; restore any temporary local test settings afterward.
- [x] Review the diff and bundle imports: the report must be absent from public landing/post/event bundles and all feeds/sitemaps. Confirm no secret, provider key or draft text is logged or staged.
- [x] Record actual verification evidence and rollback steps. Stage/commit/push only when the user requests those actions. No production deployment is included in this plan.

## Task 8: Separate backend indexing cleanup, not a panel dependency

**Repository:** `the_monkeys_engine`, separate from the frontend repository.
**Files:** `microservices/the_monkeys_blog/internal/seo/seo.go`, a new `seo_test.go` beside it, and focused tests around immediate/scheduled publishing callers in `internal/services/service.go` and `internal/scheduler/scheduler.go` if their behavior needs coverage. Keep the existing `SEOManager` interface/config fields compatible.

**Interfaces:** `HandleSEOForBlog(context.Context, string, string) error` keeps its signature. Ordinary Article pages must not be sent through the restricted Google Indexing API. A skipped unsupported submission is a non-fatal, structured diagnostic, not an indexing success.

- [ ] Add local HTTP-spy tests proving ordinary post handling makes zero Google Indexing API and retired sitemap-ping requests, including calls from immediate and scheduled publishing. No service-account credentials or external network are needed for these tests.
- [ ] Add tests proving publishing and scheduling still succeed, existing config keys still parse, and discoverable public URLs remain supplied through existing frontend sitemaps/RSS. Do not claim an HTTP 200 notification means indexed.
- [ ] Remove the retired ping and skip the unsupported ordinary-post submission path without changing publication storage, timestamps or caller API responses. Keep unrelated Telegram/Discord placeholders and configs untouched. Do not manufacture BroadcastEvent/JobPosting markup to qualify.
- [ ] Run focused Go package tests with external network blocked. At local integration time rebuild only the affected blog service if needed; do not rebuild all services or enable Monkeys AI.
- [ ] Review and deliver this cleanup separately. No database edits, schema migration, protobuf generation, production credentials or live submission are required.

## Later work, kept separate

- Group owners and discussion authors: reuse the analysis model with rules suitable for each content type, preserving current public/private visibility.
- Discussion replies: preserve current parent-thread structured data and reply anchors; do not index a new page for every short comment.
- Future post comments: add discovery integration only after comments, moderation and privacy are implemented.
- Free measured visibility reporting: use authorised reporting sources, per-content permissions and honest no-data states. Do not put platform Search Console credentials in the browser or fabricate rank history.
- Optional free AI suggestions: design privacy, provider budget and authorization separately before any model connection. Do not add inactive payment code now.

## Completion and rollback

The release is complete only when all first-release tests and local UX checks pass, existing public SEO output is preserved, reports are understandable and free, and valid authoring still works with the feature unavailable.

Rollback removes or disables the two entry components and the lazily loaded report module. There is no report database, content rewrite, URL migration or payment state to reverse. If the shared preview extraction was introduced, retain its unchanged output or revert it together with the feature after the same canonical tests pass.
